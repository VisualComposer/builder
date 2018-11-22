<?php

namespace VisualComposer\Modules\Hub\Templates;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\File;
use VisualComposer\Helpers\Hub\Actions\HubTemplatesBundle;
use VisualComposer\Helpers\Hub\Templates;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\WpMedia;
use WP_Query;

class TemplatesUpdater extends Container implements Module
{
    use EventsFilters;

    /** @noinspection PhpMissingParentConstructorInspection */
    public function __construct()
    {
        $this->addFilter(
            'vcv:hub:download:bundle vcv:hub:download:bundle:template/* vcv:hub:download:bundle:predefinedTemplate/*',
            'updateTemplate'
        );
    }

    protected function updateTemplate(
        $response,
        $payload,
        File $fileHelper,
        Templates $hubTemplatesHelper,
        HubTemplatesBundle $hubTemplatesBundleHelper,
        WpMedia $wpMediaHelper
    ) {
        $bundleJson = isset($payload['archive']) ? $payload['archive'] : false;
        if (vcIsBadResponse($response) || !$bundleJson || is_wp_error($bundleJson)) {
            return ['status' => false];
        }

        /** @see \VisualComposer\Modules\Editors\Templates\TemplatesDownloadController::updateTemplates */
        if (!isset($response['templates']) || empty($response['templates'])) {
            $response['templates'] = [];
        }

        $createDirResult = $fileHelper->createDirectory(
            $hubTemplatesHelper->getTemplatesPath()
        );
        if (vcIsBadResponse($createDirResult) && !$fileHelper->isDir($hubTemplatesHelper->getTemplatesPath())) {
            return false;
        }
        $template = $bundleJson;
        $template['id'] = $payload['actionData']['data']['id'];
        // File is locally available
        $tempTemplatePath = $hubTemplatesBundleHelper->getTempBundleFolder('templates/' . $template['id']);
        if (is_dir($tempTemplatePath)) {
            // We have local assets for template, so we need to copy them to real templates folder
            $createDirResult = $fileHelper->createDirectory($hubTemplatesHelper->getTemplatesPath($template['id']));
            if (vcIsBadResponse($createDirResult)
                && !$fileHelper->isDir(
                    $hubTemplatesHelper->getTemplatesPath($template['id'])
                )
            ) {
                return false;
            }
            $copyDirResult = $fileHelper->copyDirectory(
                $tempTemplatePath,
                $hubTemplatesHelper->getTemplatesPath($template['id'])
            );
            if (vcIsBadResponse($copyDirResult)) {
                return false;
            }
        }

        $templateMeta = $this->processTemplateMetaImages(
            [
                'id' => $template['id'],
                'preview' => $payload['actionData']['data']['preview'],
                'thumbnail' => $payload['actionData']['data']['thumbnail'],
            ]
        );
        $template['name'] = $payload['actionData']['data']['name'];
        $templateElements = $template['data'];
        $elementsImages = $wpMediaHelper->getTemplateElementMedia($templateElements);
        $templateElements = $this->processTemplateImages($elementsImages, $template, $templateElements);
        $templateElements = $this->processDesignOptions($templateElements, $template);
        $templateElements = json_decode(
            str_replace(
                '[publicPath]',
                $hubTemplatesHelper->getTemplatesUrl($template['id']),
                json_encode($templateElements)
            ),
            true
        );
        unset($template['data']);

        $savedTemplates = new WP_Query(
            [
                'post_type' => 'vcv_templates',
                'meta_query' => [
                    [
                        'key' => '_' . VCV_PREFIX . 'id',
                        'value' => $template['id'],
                        'compare' => '=',
                    ],
                    [
                        'key' => '_' . VCV_PREFIX . 'type',
                        'value' => 'custom',
                        'compare' => '!=',
                    ],
                ],
            ]
        );

        if (!$savedTemplates->have_posts()) {
            $templateId = wp_insert_post(
                [
                    'post_title' => $template['name'],
                    'post_type' => 'vcv_templates',
                    'post_status' => 'publish',
                ]
            );
        } else {
            $savedTemplates->the_post();
            $templateId = get_the_ID();
            wp_reset_postdata();
            wp_update_post(
                [
                    'ID' => $templateId,
                    'post_title' => $payload['actionData']['data']['name'],
                    'post_type' => 'vcv_templates',
                    'post_status' => 'publish',
                ]
            );
        }
        $template['description'] = $payload['actionData']['data']['description'];
        $template['thumbnail'] = $templateMeta['thumbnail'];
        $template['preview'] = $templateMeta['preview'];

        if (isset($payload['actionData']['data']['type'])) {
            $type = $payload['actionData']['data']['type'];
        } else {
            $type = 'hub';
        }

        update_post_meta($templateId, '_' . VCV_PREFIX . 'description', $template['description']);
        update_post_meta($templateId, '_' . VCV_PREFIX . 'type', $type);
        update_post_meta($templateId, '_' . VCV_PREFIX . 'thumbnail', $template['thumbnail']);
        update_post_meta($templateId, '_' . VCV_PREFIX . 'preview', $template['preview']);
        update_post_meta($templateId, '_' . VCV_PREFIX . 'id', $template['id']);
        update_post_meta($templateId, '_' . VCV_PREFIX . 'bundle', $payload['actionData']['action']);
        update_post_meta($templateId, 'vcvEditorTemplateElements', $templateElements);

        $response['templates'][] = [
            'id' => $templateId,
            'tag' => $payload['actionData']['action'],
            'bundle' => $payload['actionData']['action'],
            'name' => $template['name'],
            'description' => $template['description'],
            'data' => $templateElements,
            'thumbnail' => $template['thumbnail'],
            'preview' => $template['preview'],
            'type' => $type,
        ];

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
        $urlHelper = vchelper('Url');
        if ($wpMediaHelper->checkIsImage($template['preview'])) {
            $url = $template['preview'];
            if (!$urlHelper->isUrl($url) && strpos($url, '[publicPath]') === false) {
                $url = '[publicPath]' . $url;
            }

            $preview = $this->processSimple($url, $template);
            if ($preview) {
                $template['preview'] = $preview;
            }
        }

        if ($wpMediaHelper->checkIsImage($template['thumbnail'])) {
            $url = $template['thumbnail'];
            if (!$urlHelper->isUrl($url) && strpos($url, '[publicPath]') === false) {
                $url = '[publicPath]' . $url;
            }

            $thumbnail = $this->processSimple($url, $template);
            if ($thumbnail) {
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
        $assetsHelper = vchelper('Assets');

        if ($urlHelper->isUrl($url)) {
            $imageFile = $fileHelper->download($url);
            $localImagePath = $template['id'] . '/' . strtolower($prefix . '' . basename($url));
            if (!vcIsBadResponse($imageFile)) {
                $createDirResult = $fileHelper->createDirectory(
                    $hubTemplatesHelper->getTemplatesPath($template['id'])
                );
                if (vcIsBadResponse($createDirResult)) {
                    return false;
                }

                if (rename(
                    $imageFile,
                    $hubTemplatesHelper->getTemplatesPath(
                        $localImagePath
                    )
                )) {
                    return $assetsHelper->getAssetUrl(
                        'templates/' . $localImagePath
                    );
                }
            } else {
                return false;
            }
        } else {
            // File located locally
            if (strpos($url, '[publicPath]') !== false) {
                $url = str_replace('[publicPath]', '', $url);

                return $hubTemplatesHelper->getTemplatesUrl($template['id'] . '/' . ltrim($url, '\\/'));
            } elseif (strpos($url, 'assets/elements/') !== false) {
                return $hubTemplatesHelper->getTemplatesUrl($template['id'] . '/' . ltrim($url, '\\/'));
            } else {
                return $url; // it is local file url (default file)
            }
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
        if (is_string($images)) {
            $images = [
                $images => $images,
            ];
        }
        if (!empty($images) && is_array($images)) {
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
        }

        return $newImages;
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
            if (is_array($value) && in_array($key, $keys, true) && isset($value['urls'])) {
                $newValue = $this->processWpMedia(['value' => $value], $template);

                // Get the current depth and traverse back up the tree, saving the modifications
                $currentDepth = $recursiveIterator->getDepth();
                for ($subDepth = $currentDepth; $subDepth >= 0; $subDepth--) {
                    // Get the current level iterator
                    $subIterator = $recursiveIterator->getSubIterator($subDepth);
                    // If we are on the level we want to change
                    // use the replacements ($value) other wise set the key to the parent iterators value
                    if ($subDepth === $currentDepth) {
                        $val = $newValue;
                    } else {
                        $val = $recursiveIterator->getSubIterator(
                            ($subDepth + 1)
                        )->getArrayCopy();
                    }
                    $subIterator->offsetSet(
                        $subIterator->key(),
                        $val
                    );
                }
            }
        }

        return $recursiveIterator->getArrayCopy();
    }

    /**
     * @param $elementsImages
     * @param $template
     * @param $templateElements
     *
     * @return mixed
     */
    protected function processTemplateImages($elementsImages, $template, $templateElements)
    {
        foreach ($elementsImages as $element) {
            foreach ($element['media'] as $media) {
                if (isset($media['complex']) && $media['complex']) {
                    $imageData = $this->processWpMedia(
                        $media,
                        $template,
                        $element['elementId'] . '-' . $media['key'] . '-'
                    );
                } else {
                    // it is simple url
                    $imageData = $this->processSimple(
                        $media['url'],
                        $template,
                        $element['elementId'] . '-' . $media['key'] . '-'
                    );
                }
                if ($imageData) {
                    $templateElements[ $element['elementId'] ][ $media['key'] ] = $imageData;
                }
            }
        }

        return $templateElements;
    }
}
