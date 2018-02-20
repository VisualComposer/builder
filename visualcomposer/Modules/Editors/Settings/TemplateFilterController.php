<?php

namespace VisualComposer\Modules\Editors\Settings;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class TemplateFilterController extends Container/* implements Module*/
{
    protected $templates;

    use WpFiltersActions;
    use EventsFilters;

    public function __construct()
    {
        if (version_compare(get_bloginfo('version'), '4.7', '<')) {
            $this->wpAddFilter('page_attributes_dropdown_pages_args', 'registerProjectTemplates');
        } else {
            $this->wpAddFilter('theme_page_templates', 'addNewTemplate');
        }

        $this->wpAddFilter(
            'wp_insert_post_data',
            'registerProjectTemplates'
        );

        $this->wpAddFilter(
            'template_include',
            'viewProjectTemplate'
        );

        if (vcvenv('VCV_BOXED_BLANK_PAGE_TEMPLATE')) {
            $this->templates = [
                'blank-template.php' => __('Blank page', 'vcwb'),
                'boxed-blank-template.php' => __('Boxed blank page', 'vcwb'),
            ];
        } else {
            $this->templates = [
                'blank-template.php' => __('Blank page', 'vcwb'),
            ];
        }

        if (vcvenv('VCV_PAGE_TEMPLATES_FE')) {
            $this->addFilter('vcv:frontend:head:extraOutput', 'outputTemplates');
            $this->addFilter('vcv:dataAjax:setData', 'setPageTemplate');
        }

        if (vcvenv('VCV_IFRAME_RELOAD')) {
            $this->wpAddFilter('template_include', 'previewCustomTemplate', 20);
        }
    }

    protected function setPageTemplate($response, $payload, Request $requestHelper)
    {
        $sourceId = $payload['sourceId'];
        $pageTemplate = $requestHelper->input('vcv-page-template');
        $post = get_post($sourceId);
        if ($post && $pageTemplate) {
            // @codingStandardsIgnoreLine
            $post->page_template = $pageTemplate;
            //temporarily disable (can break preview page and content if not removed)
            remove_filter('content_save_pre', 'wp_filter_post_kses');
            remove_filter('content_filtered_save_pre', 'wp_filter_post_kses');
            wp_update_post($post);
            //bring it back once you're done posting
            add_filter('content_save_pre', 'wp_filter_post_kses');
            add_filter('content_filtered_save_pre', 'wp_filter_post_kses');
        }

        return $response;
    }

    protected function outputTemplates($response, $payload)
    {
        global $post;

        return array_merge(
            $response,
            [
                vcview(
                    'partials/constant-script',
                    [
                        'key' => 'VCV_PAGE_TEMPLATES',
                        'value' => [
                            // @codingStandardsIgnoreLine
                            'current' => $post && isset($post->page_template) && $post->page_template ? $post->page_template : 'default',
                            // @codingStandardsIgnoreLine
                            'all' => $post ? get_page_templates($post, $post->post_type) : [],
                        ],
                    ]
                ),
            ]
        );
    }

    protected function addNewTemplate($postsTemplates)
    {
        $frontendHelper = vchelper('Frontend');
        $requestHelper = vchelper('Request');
        if ($frontendHelper->isFrontend() || $frontendHelper->isPageEditable() || $requestHelper->exists('wp-preview')
            || $requestHelper->exists('preview')) {
            return $this->templates;
        } else {
            return $postsTemplates;
        }
    }

    protected function registerProjectTemplates($atts)
    {
        $cacheKey = 'page_templates-' . md5(get_theme_root() . '/' . get_stylesheet());
        $templates = wp_get_theme()->get_page_templates();
        $frontendHelper = vchelper('Frontend');
        $requestHelper = vchelper('Request');

        if (empty($templates)) {
            $templates = [];
        }

        wp_cache_delete($cacheKey, 'themes');
        if ($frontendHelper->isFrontend() || $frontendHelper->isPageEditable() || $requestHelper->exists('wp-preview')
            || $requestHelper->exists('preview')) {
            $templates = $this->templates;
        }

        wp_cache_add($cacheKey, $templates, 'themes', 1800);

        return $atts;
    }

    protected function viewProjectTemplate($template)
    {
        global $post;

        if (!$post) {
            return $template;
        }

        if (!isset($this->templates[ get_post_meta($post->ID, '_wp_page_template', true) ])) {
            return $template;
        }

        $file = $this->templatePath() . get_post_meta($post->ID, '_wp_page_template', true);

        if (file_exists($file)) {
            return $file;
        }

        return $template;
    }

    protected function previewCustomTemplate($originalTemplate)
    {
        $requestHelper = vchelper('Request');
        $templateName = $requestHelper->input('vcv-template');
        $templateList = wp_get_theme()->get_page_templates();
        if ($templateName) {
            if (isset($templateList[ $templateName ])) {
                if (locate_template($templateName)) {
                    $template = locate_template($templateName);
                } else {
                    $template = $this->templatePath() . $templateName;
                }
                if (file_exists($template)) {
                    return $template;
                }
            } elseif ($templateName === 'default') {
                return get_page_template();
            }
        }

        return $originalTemplate;
    }

    protected function templatePath()
    {
        /** @var \VisualComposer\Application $_app */
        $_app = vcapp();

        return $_app->path('visualcomposer/resources/views/editor/templates/');
    }
}
