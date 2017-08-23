<?php

namespace VisualComposer\Modules\Editors\Templates;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\EditorTemplates;
use VisualComposer\Helpers\File;
use VisualComposer\Helpers\Hub\Actions\TemplatesBundle;
use VisualComposer\Helpers\Hub\Templates;
use VisualComposer\Helpers\Logger;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class TemplatesDownloadController
 * @package VisualComposer\Modules\Editors\Templates
 */
class TemplatesDownloadController extends Container implements Module
{
    use EventsFilters;

    /**
     * TemplatesDownloadController constructor.
     *
     * @param \VisualComposer\Helpers\Options $optionsHelper
     */
    public function __construct(Options $optionsHelper)
    {
        if (vcvenv('VCV_ENV_TEMPLATES_DOWNLOAD')) {
            /** @see \VisualComposer\Modules\Editors\Templates\TemplatesDownloadController::updateTemplates */
            $this->addFilter(
                'vcv:hub:download:bundle vcv:hub:download:bundle:templates',
                'updateTemplates',
                60
            );
        }
    }

    /**
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\EditorTemplates $editorTemplatesHelper
     * @param \VisualComposer\Helpers\Hub\Actions\TemplatesBundle $hubBundleHelper
     * @param \VisualComposer\Helpers\File $fileHelper
     * @param \VisualComposer\Helpers\Hub\Templates $hubTemplatesHelper
     * @param Logger $loggerHelper
     *
     * @return array|bool
     */
    protected function updateTemplates(
        $response,
        $payload,
        Options $optionsHelper,
        EditorTemplates $editorTemplatesHelper,
        TemplatesBundle $hubBundleHelper,
        File $fileHelper,
        Templates $hubTemplatesHelper,
        Logger $loggerHelper
    ) {
        $bundleJson = $payload['archive'];
        if (vcIsBadResponse($response) || is_wp_error($bundleJson)) {
            $loggerHelper->log(__('Failed to update templates', 'vcwb'), [
                'response' => $response,
                'bundleJson' => $bundleJson,
            ]);

            return ['status' => false];
        }
        if (isset($bundleJson['templates'])) {
            $templates = $bundleJson['templates'];
            $toSaveTemplates = [];

            $fileHelper->createDirectory(
                $hubTemplatesHelper->getTemplatesPath()
            );

            foreach ($templates as $templateKey => $template) {
                // File is locally available
                $tempTemplatePath = $hubBundleHelper->getTempBundleFolder('templates/' . $template['id']);
                if (is_dir($tempTemplatePath)) {
                    // We have local assets for template, so we need to copy them to real templates folder
                    $fileHelper->createDirectory($hubTemplatesHelper->getTemplatesPath($template['id']));
                    $fileHelper->copyDirectory(
                        $tempTemplatePath,
                        $hubTemplatesHelper->getTemplatesPath($template['id'])
                    );
                }

                $template = $this->processTemplateMetaImages($template);
                $templateElements = json_decode(
                    str_replace(
                        '[publicPath]',
                        $hubTemplatesHelper->getTemplatesUrl($template['id']),
                        json_encode($template['data'])
                    ),
                    true
                );
                $elementsImages = $this->getTemplateElementImages($templateElements);
                foreach ($elementsImages as $element) {
                    foreach ($element['images'] as $image) {
                        if (isset($image['complex']) && $image['complex']) {
                            $imageData = $this->processWpMedia(
                                $image,
                                $template,
                                $element['elementId'] . '-' . $image['key'] . '-'
                            );
                        } else {
                            // it is simple url
                            $imageData = $this->processSimple(
                                $image['url'],
                                $template,
                                $element['elementId'] . '-' . $image['key'] . '-'
                            );
                        }

                        if (!is_wp_error($imageData) && $imageData) {
                            $templateElements[ $element['elementId'] ][ $image['key'] ] = $imageData;
                        }
                    }
                }
                $templateElements = $this->processDesignOptions($templateElements, $template);
                unset($template['data']);
                $toSaveTemplates[ $template['id'] ] = $template;
                $optionsHelper->set('predefinedTemplateElements:' . $template['id'], $templateElements);
            }

            // $differ = vchelper('Differ');
            // Set old
            // $differ->set($editorTemplatesHelper->allPredefined(false, true));
            // Merge new
            // $differ->set($toSaveTemplates);

            $editorTemplatesHelper->setPredefined(array_values($toSaveTemplates));
        }

        return $response;
    }

    /**
     * @param $template
     *
     * @return mixed
     */
    protected function processTemplateMetaImages($template)
    {
        $wpMediaHelper = vchelper('WpMedia');
        if ($wpMediaHelper->checkIsImage($template['preview'])) {
            $preview = $this->processSimple($template['preview'], $template);
            if (!is_wp_error($preview) && $preview) {
                $template['preview'] = $preview;
            }
        }

        if ($wpMediaHelper->checkIsImage($template['thumbnail'])) {
            $thumbnail = $this->processSimple($template['thumbnail'], $template);
            if (!is_wp_error($thumbnail) && $thumbnail) {
                $template['thumbnail'] = $thumbnail;
            }
        }

        return $template;
    }

    /**
     * @param $url
     * @param $template
     * @param string $prefix
     *
     * @return bool|mixed|string
     */
    protected function processSimple($url, $template, $prefix = '')
    {
        $fileHelper = vchelper('File');
        $hubTemplatesHelper = vchelper('HubTemplates');
        $urlHelper = vchelper('Url');

        if ($urlHelper->isUrl($url)) {
            $imageFile = $fileHelper->download($url);
            $localImagePath = strtolower($template['id'] . '/' . $prefix . '' . basename($url));
            if (!is_wp_error($imageFile)) {
                $fileHelper->createDirectory(
                    $hubTemplatesHelper->getTemplatesPath($template['id'])
                );

                if (rename(
                    $imageFile,
                    $hubTemplatesHelper->getTemplatesPath(
                        $localImagePath
                    )
                )) {
                    return $urlHelper->getContentAssetUrl(
                        'templates/' . $localImagePath
                    );
                }
            } else {
                return $imageFile;
            }
        } else {
            // File located locally
            return $hubTemplatesHelper->getTemplatesUrl($template['id'] . '/' . $url);
        }

        return false;
    }

    /**
     * @param $imageData
     * @param $template
     * @param string $prefix
     *
     * @return array
     */
    protected function processWpMedia($imageData, $template, $prefix = '')
    {
        $newImages = [];

        $value = $imageData['value'];
        $images = is_array($value) && isset($value['urls']) ? $value['urls'] : $value;
        foreach ($images as $key => $image) {
            if (is_string($image)) {
                $newUrl = $this->processSimple($image, $template, $prefix . $key . '-');
            } else {
                $newUrl = $this->processSimple($image['full'], $template, $prefix . $key . '-');
            }
            if ($newUrl) {
                $newImages[] = $newUrl;
            }
        }

        return $newImages;
    }

    /**
     * @param $elements
     *
     * @return array
     */
    protected function getTemplateElementImages($elements)
    {
        $images = [];

        foreach ($elements as $element) {
            $elementImages = $this->getElementImages($element);
            if ($elementImages['images']) {
                $images[] = $elementImages;
            }
        }

        return $images;
    }

    /**
     * @param $element
     *
     * @return array
     */
    protected function getElementImages($element)
    {
        $images = [];
        $wpMediaHelper = vchelper('WpMedia');
        foreach ($element as $propKey => $propValue) {
            if (in_array($propKey, ['metaThumbnailUrl', 'metaPreviewUrl'])) {
                continue;
            }
            // first level
            if (is_string($propValue)) {
                if ($wpMediaHelper->checkIsImage($propValue)) {
                    $images[] = [
                        'url' => $propValue,
                        'key' => $propKey,
                    ];
                }
                // second level
            } elseif (is_array($propValue) && isset($propValue['urls'])) {
                $images[] = [
                    'complex' => true,
                    'value' => $propValue,
                    'key' => $propKey,
                ];
            }
        }

        return [
            'elementId' => $element['id'],
            'images' => $images,
        ];
    }

    protected function processDesignOptions($templateElements, $template)
    {
        $arrayIterator = new \RecursiveArrayIterator($templateElements);
        $recursiveIterator = new \RecursiveIteratorIterator($arrayIterator, \RecursiveIteratorIterator::SELF_FIRST);

        $keys = [
            'image',
            'images',
        ];

        foreach ($recursiveIterator as $key => $value) {
            if (is_array($value) && in_array($key, $keys) && isset($value['urls'])) {
                $newValue = $this->processWpMedia(['value' => $value], $template);

                // Get the current depth and traverse back up the tree, saving the modifications
                $currentDepth = $recursiveIterator->getDepth();
                for ($subDepth = $currentDepth; $subDepth >= 0; $subDepth--) {
                    // Get the current level iterator
                    $subIterator = $recursiveIterator->getSubIterator($subDepth);
                    // If we are on the level we want to change
                    // use the replacements ($value) other wise set the key to the parent iterators value
                    $subIterator->offsetSet(
                        $subIterator->key(),
                        ($subDepth === $currentDepth
                            ? $newValue
                            : $recursiveIterator->getSubIterator(
                                ($subDepth + 1)
                            )->getArrayCopy())
                    );
                }
            }
        }

        return $recursiveIterator->getArrayCopy();
    }
}
