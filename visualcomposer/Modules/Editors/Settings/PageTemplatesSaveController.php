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
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class PageTemplatesSaveController
 * @package VisualComposer\Modules\Editors\Settings
 */
class PageTemplatesSaveController extends Container implements Module
{
    use EventsFilters;

    /**
     * PageTemplatesSaveController constructor.
     */
    public function __construct()
    {
        if (vcvenv('VCV_PAGE_TEMPLATES_LAYOUTS')) {
            $this->addFilter('vcv:dataAjax:setData', 'setPageTemplate');
        }
    }

    /**
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @return mixed
     */
    protected function setPageTemplate($response, $payload, Request $requestHelper, Frontend $frontendHelper)
    {
        // TODO: Preview
        if ($requestHelper->exists('vcv-page-template')) {
            if ($frontendHelper->isPreview()) {

            } else {
                $sourceId = $payload['sourceId'];
                $pageTemplateData = $requestHelper->input('vcv-page-template');
                $value = $pageTemplateData['value'];
                $type = $pageTemplateData['type'];
                $post = get_post($sourceId);
                if ($post && $type && $value) {
                    update_post_meta($post->ID, '_vcv-page-template', $value);
                    update_post_meta($post->ID, '_vcv-page-template-type', $type);
                    if ($type === 'theme') {
                        $post->page_template = $value === 'default' ? '' : $value;
                        //temporarily disable (can break preview page and content if not removed)
                        remove_filter('content_save_pre', 'wp_filter_post_kses');
                        remove_filter('content_filtered_save_pre', 'wp_filter_post_kses');
                        wp_update_post($post);
                        //bring it back once you're done posting
                        add_filter('content_save_pre', 'wp_filter_post_kses');
                        add_filter('content_filtered_save_pre', 'wp_filter_post_kses');
                    }
                }
            }
        }

        return $response;
    }
}
