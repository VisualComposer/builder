<?php

namespace VisualComposer\Modules\Editors\Settings;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

class TitleController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct()
    {
        if (vcvenv('VCV_PAGE_TITLE_FE')) {
            $this->wpAddFilter(
                'the_title',
                'titleDisabler'
            );
            $this->addFilter('vcv:frontend:head:extraOutput', 'outputTitle');
            $this->addFilter('vcv:dataAjax:setData', 'setPageTitle');
        }
    }

    protected function setPageTitle($response, $payload, Request $requestHelper)
    {
        $sourceId = $payload['sourceId'];
        $pageTitle = $requestHelper->input('vcv-page-title');
        $pageTitleDisabled = $requestHelper->input('vcv-page-title-disabled');
        $post = get_post($sourceId);
        if ($post && $pageTitle) {
            // @codingStandardsIgnoreLine
            $post->post_title = $pageTitle;
            if (isset($pageTitleDisabled)) {
                update_post_meta($sourceId, '_' . VCV_PREFIX . 'pageTitleDisabled', $pageTitleDisabled);
            }
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

    protected function outputTitle($response, $payload)
    {
        global $post;
        $postMeta = get_post_meta($post->ID, '_' . VCV_PREFIX . 'pageTitleDisabled', true);

        return array_merge(
            $response,
            [
                vcview(
                    'partials/constant-script',
                    [
                        'key' => 'VCV_PAGE_TITLE',
                        'value' => [
                            // @codingStandardsIgnoreLine
                            'current' => $post ? $post->post_title : '',
                            'disabled' => $postMeta || false,
                        ],
                    ]
                ),
            ]
        );
    }

    protected function titleDisabler($title)
    {
        global $post;
        $disableMeta = get_post_meta($post->ID, '_' . VCV_PREFIX . 'pageTitleDisabled', true);

        if ($disableMeta) {
            $title = '';
        }

        return $title;
    }
}
