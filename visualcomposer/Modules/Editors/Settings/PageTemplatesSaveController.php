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
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class PageTemplatesSaveController
 * @package VisualComposer\Modules\Editors\Settings
 */
class PageTemplatesSaveController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    /**
     * PageTemplatesSaveController constructor.
     */
    public function __construct()
    {
        $this->addFilter('vcv:dataAjax:setData', 'setPageTemplate');

        $this->wpAddAction('save_post', 'setLayout');
    }

    /**
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Frontend $frontendHelper
     *
     * @return mixed
     */
    protected function setPageTemplate($response, $payload, Request $requestHelper, Frontend $frontendHelper)
    {
        if ($requestHelper->exists('vcv-page-template')) {
            $sourceId = $payload['sourceId'];
            $post = get_post($sourceId);
            if ($frontendHelper->isPreview()) {
                $preview = wp_get_post_autosave($sourceId);
                if (is_object($preview)) {
                    $post = $preview;
                }
            }
            $pageTemplateData = $requestHelper->input('vcv-page-template');
            if (is_array($pageTemplateData)) {
                $value = $pageTemplateData['value'];
                $type = $pageTemplateData['type'];
                $stretchedContent = intval($pageTemplateData['stretchedContent']);
                if ($post && $type && $value) {
                    update_metadata('post', $post->ID, '_vcv-page-template', $value);
                    update_metadata('post', $post->ID, '_vcv-page-template-type', $type);
                    update_metadata('post', $post->ID, '_vcv-page-template-stretch', $stretchedContent);
                    if ($type === 'theme') {
                        // @codingStandardsIgnoreLine
                        $post->page_template = $value === 'default' ? '' : $value;
                        update_metadata('post', $post->ID, '_wp_page_template', $value === 'default' ? '' : $value);
                        //temporarily disable (can break preview page and content if not removed)
                        kses_remove_filters();
                        remove_filter('content_save_pre', 'balanceTags', 50);
                        wp_update_post($post);
                    }
                }
            }
        }

        return $response;
    }

    protected function setLayout(Request $requestHelper)
    {
        /** @var \WP_Post $post */
        $post = get_post();
        if ($post && $requestHelper->exists('vcv-be-editor')) {
            $editor = $requestHelper->input('vcv-be-editor');
            if ($editor === 'classic') {
                // We are in classic mode so we need to remove all meta
                delete_metadata('post', $post->ID, '_vcv-page-template');
                delete_metadata('post', $post->ID, '_vcv-page-template-type');
            }
        }
    }
}
