<?php

namespace VisualComposer\Modules\Editors\Settings\WordPressSettings;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\PostType;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class ExcerptController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter(
            'vcv:dataAjax:setData',
            'setData'
        );
        $this->addFilter(
            'vcv:frontend:head:extraOutput',
            'outputExcerpt'
        );
    }

    /**
     * @param $response
     * @param $payload
     *
     * @param \VisualComposer\Helpers\PostType $postTypeHelper
     *
     * @return mixed
     */
    protected function outputExcerpt(
        $response,
        $payload,
        PostType $postTypeHelper
    ) {
        $currentPost = $postTypeHelper->get();
        // @codingStandardsIgnoreLine
        if (isset($currentPost->post_type) && post_type_supports($currentPost->post_type, 'excerpt')) {
            $response = array_merge(
                $response,
                [
                    vcview(
                        'partials/variableTypes/variable',
                        [
                            'key' => 'VCV_EXCERPT',
                            // @codingStandardsIgnoreLine
                            'value' => $currentPost->post_excerpt,
                        ]
                    ),
                ]
            );
        }
        return $response;
    }

    /**
     * Set excerpt
     *
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @return mixed
     */
    protected function setData($response, $payload, Request $requestHelper)
    {
        $currentPageId = $payload['sourceId'];
        if ($requestHelper->exists('vcv-settings-excerpt')) {
            $postExcerpt = $requestHelper->input('vcv-settings-excerpt', '');
            wp_update_post(['ID' => $currentPageId, 'post_excerpt' => $postExcerpt]);
        }

        return $response;
    }
}
