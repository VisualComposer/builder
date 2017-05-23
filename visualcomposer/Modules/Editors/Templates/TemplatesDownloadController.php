<?php

namespace VisualComposer\Modules\Editors\Templates;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class TemplatesDownloadController extends Container implements Module
{
    use EventsFilters;

    public function __construct(Options $optionsHelper)
    {
        if (vcvenv('VCV_TEMPLATES_DOWNLOAD')) {
            $this->addFilter(
                'vcv:ajax:account:activation:adminNonce',
                'processTemplateDownload',
                60
            );
        }
    }

    protected function processTemplateDownload($response, $payload, Options $optionsHelper)
    {
        $request = wp_remote_get('http://localhost:8080/download/templates-bundle/lite');
        $templates = json_decode($request['body'], true);
        $toSaveTemplates = [];

        foreach ($templates as $templateKey => $template) {
            $template = $this->processTemplateMetaImages($template);
            $templateElements = $template['data'];
            $elementsImages = $this->getTemplateElementImages($templateElements);
            foreach ($elementsImages as $element) {
                foreach ($element['images'] as $image) {
                    if (isset($image['complex'])) {
                        // it is complex object... TODO: Process wpmedia
                        $this->processWpMedia($image);
                    } else {
                        // it is simple url
                        $imageUrl = $this->processSimple(
                            $image['url'],
                            $template,
                            $element['elementId'] . '-' . $image['key'] . '-'
                        );
                        if (!is_wp_error($imageUrl) && $imageUrl) {
                            $templateElements[ $element['elementId'] ][ $image['key'] ] = $imageUrl;
                        }
                    }
                }
            }
            unset($template['data']);
            $toSaveTemplates[] = $template;
            $optionsHelper->set('predefinedTemplateElements:' . $template['id'], $templateElements);
        }
        $optionsHelper->set('predefinedTemplates', $toSaveTemplates);

        return $response;
    }

    protected function processTemplateMetaImages($template)
    {
        if ($this->checkIsImage($template['preview'])) {
            $preview = $this->processSimple($template['preview'], $template);
            if (!is_wp_error($preview) && $preview) {
                $template['preview'] = $preview;
            }
        }

        if ($this->checkIsImage($template['thumbnail'])) {
            $thumbnail = $this->processSimple($template['thumbnail'], $template);
            if (!is_wp_error($thumbnail) && $thumbnail) {
                $template['thumbnail'] = $thumbnail;
            }
        }

        return $template;
    }

    protected function processSimple($url, $template, $prefix = '')
    {
        $fileHelper = vchelper('File');
        $hubTemplatesHelper = vchelper('HubTemplates');
        $urlHelper = vchelper('Url');

        $imageFile = $fileHelper->download($url);
        if (!is_wp_error($imageFile)) {
            $localImagePath = strtolower($template['id'] . '/' . $prefix . '' . basename($url));

            $fileHelper->createDirectory(
                $hubTemplatesHelper->getTemplatesPath()
            );
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

        return false;
    }

    protected function processWpMedia($image)
    {
    }

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
                ];
            }
        }

        return [
            'elementId' => $element['id'],
            'images' => $images,
        ];
    }
}
