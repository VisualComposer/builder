<?php

namespace VisualComposer\Modules\Editors\Settings;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\PageLayout;
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
        $this->addFilter(
            'vcv:editor:settings:pageTemplatesLayouts:current',
            'getCurrentTemplateLayout'
        );

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

    protected function getCurrentTemplateLayout(
        $output,
        PostType $postTypeHelper,
        Request $requestHelper
    ) {
        $postId = vcfilter('vcv:editor:settings:pageTemplatesLayouts:current:custom');

        // always return default template for search and archive page
        if ((is_search() || is_archive()) && !vcvenv('VCV_IS_ARCHIVE_TEMPLATE')) {
            return $output;
        }

        $post = $postTypeHelper->get($postId);

        if (!$post) {
            return $output;
        }

        $post = vchelper('Preview')->updateSourcePostWithAutosavePost($post);

        // check if custom vc template is set
        // but check the request first for a live templates changing in the builder
        if ($requestHelper->exists('vcv-template')) {
            $customTemplate = $requestHelper->input('vcv-template');
        } else {
            $customTemplate = get_post_meta($post->ID, '_vcv-page-template', true);
        }

        if ($requestHelper->exists('vcv-template-type')) {
            $customTemplateType = $requestHelper->input('vcv-template-type');
        } else {
            $customTemplateType = get_post_meta($post->ID, '_vcv-page-template-type', true);
        }

        // don't use custom template type value if type is theme, use native wp template type
        if (empty($customTemplateType)) {
            $customTemplateType = 'theme';
        }
        if ($customTemplateType === 'theme') {
            // @codingStandardsIgnoreLine
            $customTemplate = $post->page_template;
        }

        if ($requestHelper->exists('vcv-template-stretched')) {
            $templateStretch = $requestHelper->input('vcv-template-stretched', 0);
        } else {
            $templateStretch = get_post_meta($post->ID, '_vcv-page-template-stretch', true);
        }

        // BC: For TemplateFilterController.php
        if (in_array($customTemplate, ['boxed-blank-template.php', 'blank-template.php'])) {
            $customTemplateType = 'vc';
            $customTemplate = str_replace('-template.php', '', $customTemplate);
            $customTemplate = str_replace('boxed-blank', 'boxed', $customTemplate);
        }

        // BC: For 2.9 blank page update to stretchedContent/notStretchedContent options
        list($templateStretch, $customTemplate) = $this->bcBlankPageUpdate(
            $customTemplateType,
            $templateStretch,
            $customTemplate
        );

        $output = [
            'type' => 'theme',
            'value' => empty($customTemplate) ? 'default' : $customTemplate,
        ];

        $isCustomTemplate = !empty($customTemplate) && !empty($customTemplateType) && $customTemplateType !== 'theme';
        if ($isCustomTemplate) {
            $output = [
                'type' => $customTemplateType,
                'value' => $customTemplate,
                'stretchedContent' => (int)$templateStretch,
            ];
        }

        return $output;
    }

    protected function viewPageTemplate(
        $originalTemplate,
        Request $requestHelper,
        PageLayout $pageLayoutHelper
    ) {
        if ($requestHelper->input('vcv-template') === 'default' || $requestHelper->input('vcv-template') === 'theme:default') {
            return $originalTemplate;
        }

        /** @see \VisualComposer\Modules\Editors\Settings\PageTemplatesController::getCurrentTemplateLayout */
        $current = $pageLayoutHelper->getCurrentPageLayout(
            [
                'type' => 'theme',
                'value' => $originalTemplate,
            ]
        );

        if (empty($current)) {
            return $originalTemplate;
        }

        $result = $originalTemplate;
        // Since v41 we merging vc-custom-layout and theme
        if ($current['type'] === 'vc-custom-layout' && strpos($current['value'], 'theme:') !== false) {
            $current['type'] = 'theme';
            $current['value'] = str_replace('theme:', '', $current['value']);
        }

        if ($current['type'] === 'theme') {
            $result = locate_template($current['value']);
            if (empty($result)) {
                $result = $originalTemplate;
            }
        } elseif ($current['value'] && $current['value'] !== 'default') {
            $result = vcfilter('vcv:editor:settings:viewPageTemplate', $current['value'], $current);
        }

        return $result;
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
     * Also, fixes issues when layout doesn't exist (removed)
     *
     * @param $template
     *
     * @return string
     */
    protected function fallbackTemplate($template)
    {
        if (!empty($template) && file_exists($template)) {
            return $template;
        }

        // we need filter these behavior in cases when 3 party plugins
        // process includes directly in 'template_include' filter
        $isFallbackTemplate = vcfilter(
            'vcv:editor:settings:pageTemplatesLayouts:fallbackTemplate',
            true
        );

        if (!$isFallbackTemplate) {
            return $template;
        }

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
}
