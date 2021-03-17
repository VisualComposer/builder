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
        $this->wpAddFilter(
            'template_include',
            'fallbackTemplate',
            1000
        );
    }

    protected function getCurrentTemplateLayout($output, PostType $postTypeHelper, Frontend $frontendHelper)
    {
        $postId = vcfilter('vcv:editor:settings:pageTemplatesLayouts:current:custom');

        //always return default template for search and archive page
        if ((is_search() || is_archive()) && !vcvenv('VCV_IS_ARCHIVE_TEMPLATE')) {
            return $output;
        }

        $post = $postTypeHelper->get($postId);
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

            $customTemplate = $this->getCustomTemplate($post->ID, $customTemplate, $customTemplateType);

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
                if (
                    ($frontendHelper->isFrontend() || $frontendHelper->isPageEditable())
                    && !get_post($post->ID)->post_content
                    && !get_post_meta(
                        $post->ID,
                        VCV_PREFIX . 'pageContent',
                        true
                    )
                ) {
                    if (vcvenv('VCV_FT_THEME_BUILDER_LAYOUTS')) {
                        $output = [
                            'type' => 'vc-custom-layout',
                            'value' => 'default',
                        ];
                    } else {
                        $output = [
                            'type' => 'theme',
                            'value' => !empty($currentPostTemplate) ? $currentPostTemplate : 'default',
                        ];
                    }
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

    protected function getCustomTemplate($postId, $customTemplate, $customTemplateType)
    {
        if ($customTemplateType === 'theme') {
            $customTemplate = get_post_meta($postId, '_wp_page_template', true);
        }

        return $customTemplate;
    }

    protected function viewPageTemplate($originalTemplate, Request $requestHelper)
    {
        if ($requestHelper->input('vcv-template') === 'default') {
            return $originalTemplate;
        }

        /** @see \VisualComposer\Modules\Editors\Settings\PageTemplatesController::getCurrentTemplateLayout */
        $current = vcfilter(
            'vcv:editor:settings:pageTemplatesLayouts:current',
            [
                'type' => 'theme',
                'value' => $originalTemplate,
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

    /**
     * Prevents issues when themeEditor/themeBuilder addons are disabled
     * Also, fixes issues when layout doesn't exists (removed)
     *
     * @param $template
     *
     * @return string
     */
    protected function fallbackTemplate($template)
    {
        if (empty($template) || !file_exists($template)) {
            $templateGroups = [
                'is_embed' => 'get_embed_template',
                'is_404' => 'get_404_template',
                'is_search' => 'get_search_template',
                'is_front_page' => 'get_front_page_template',
                'is_home' => 'get_home_template',
                'is_privacy_policy' => 'get_privacy_policy_template',
                'is_post_type_archive' => 'get_post_type_archive_template',
                'is_tax' => 'get_taxonomy_template',
                'is_attachment' => 'get_attachment_template',
                'is_single' => 'get_single_template',
                'is_page' => 'get_page_template',
                'is_singular' => 'get_singular_template',
                'is_category' => 'get_category_template',
                'is_tag' => 'get_tag_template',
                'is_author' => 'get_author_template',
                'is_date' => 'get_date_template',
                'is_archive' => 'get_archive_template',
            ];
            $template = false;

            // Loop through each of the template conditionals, and find the appropriate template file.
            foreach ($templateGroups as $tag => $templateCallback) {
                if (call_user_func($tag)) {
                    $template = call_user_func($templateCallback);
                }

                if ($template) {
                    if ($tag === 'is_attachment') {
                        remove_filter('the_content', 'prepend_attachment');
                    }

                    break;
                }
            }

            if (!$template) {
                $template = get_index_template();
            }

            return $template;
        }

        return $template;
    }
}
