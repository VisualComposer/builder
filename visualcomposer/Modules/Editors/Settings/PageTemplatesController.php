<?php

namespace VisualComposer\Modules\Editors\Settings;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\PostType;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class PageTemplatesController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:editor:settings:pageTemplatesLayouts:current', 'getCurrentTemplateLayout');

        $this->wpAddFilter(
            'template_include',
            'viewPageTemplate',
            11
        );
    }

    protected function getCurrentTemplateLayout($output, PostType $postTypeHelper, Frontend $frontendHelper)
    {
        //always return default template for search and archive page
        if (is_search() || is_archive()) {
            return $output;
        }

        $post = $postTypeHelper->get();
        if ($post) {
            if ($frontendHelper->isPreview()) {
                $preview = wp_get_post_autosave($post->ID);
                if (is_object($preview)) {
                    $post = $preview;
                }
            }
            // @codingStandardsIgnoreLine
            if ($post->page_template === 'default' && isset($output['value'])) {
                $currentPostTemplate = $output['value'];
            } else {
                // @codingStandardsIgnoreLine
                $currentPostTemplate = $post->page_template;
            }
            $customTemplate = get_post_meta($post->ID, '_vcv-page-template', true);
            $customTemplateType = get_post_meta($post->ID, '_vcv-page-template-type', true);
            $templateStretch = get_post_meta($post->ID, '_vcv-page-template-stretch', true);

            // BC: For TemplateFilterController.php
            if (in_array($currentPostTemplate, ['boxed-blank-template.php', 'blank-template.php'])) {
                $customTemplateType = 'vc';
                $currentPostTemplate = str_replace('-template.php', '', $currentPostTemplate);
                $customTemplate = str_replace('boxed-blank', 'boxed', $currentPostTemplate);
            }

            // BC: For 2.9 blank page update to stretchedContent/notStretchedContent options
            list($templateStretch, $customTemplate) = $this->bcBlankPageUpdate(
                $customTemplateType,
                $templateStretch,
                $customTemplate
            );

            if (!empty($customTemplateType) && !empty($customTemplate)) {
                $output = [
                    'type' => $customTemplateType,
                    'value' => $customTemplate,
                    'stretchedContent' => intval($templateStretch),
                ];
            } else {
                if (($frontendHelper->isFrontend() || $frontendHelper->isPageEditable())
                    && !get_post(
                        $post->ID
                    )->post_content
                    && !get_post_meta(
                        $post->ID,
                        VCV_PREFIX . 'pageContent',
                        true
                    )) {
                    $output = [
                        'type' => 'vc',
                        'value' => 'blank',
                    ];
                } else {
                    $output = [
                        'type' => 'theme',
                        'value' => !empty($currentPostTemplate) ? $currentPostTemplate : 'default',
                    ];
                }
            }
        }

        return $output;
    }

    protected function viewPageTemplate($originalTemplate, Request $requestHelper)
    {
        if ($requestHelper->input('vcv-template') === 'default') {
            return $originalTemplate;
        }

        /** @see \VisualComposer\Modules\Editors\Settings\PageTemplatesController::getCurrentTemplateLayout */
        $current = $this->call(
            'getCurrentTemplateLayout',
            [
                'output' => [
                    'type' => 'theme',
                    'value' => $originalTemplate,
                ],
            ]
        );
        if (!empty($current)) {
            $result = $originalTemplate;
            if ($current['type'] !== 'theme') {
                $result = vcfilter('vcv:editor:settings:viewPageTemplate', $current['value'], $current);
            } elseif ($current['value'] && $current['value'] !== 'default') {
                $result = locate_template($current['value']);
                if (empty($result)) {
                    $result = $originalTemplate;
                }
            }

            return $result;
        }

        return $originalTemplate;
    }

    /**
     * @param $customTemplateType
     * @param $templateStretch
     * @param $customTemplate
     *
     * @return array
     */
    protected function bcBlankPageUpdate($customTemplateType, $templateStretch, $customTemplate)
    {
        if (vcvenv('VCV_TF_BLANK_PAGE_BOXED')) {
            if ($customTemplateType === 'vc') {
                if ($customTemplate === 'blank' && $templateStretch === '') {
                    // It means that templateStretch=true
                    $templateStretch = true;
                } elseif ($customTemplate === 'boxed') {
                    // It means that templateStretch=false
                    $templateStretch = false;
                    $customTemplate = 'blank';
                }
            }
        }

        return [$templateStretch, $customTemplate];
    }
}
