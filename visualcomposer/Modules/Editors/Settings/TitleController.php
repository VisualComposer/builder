<?php

namespace VisualComposer\Modules\Editors\Settings;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/**
 * Class TitleController
 * @package VisualComposer\Modules\Editors\Settings
 */
class TitleController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public $titleRemoveClosure;
    public $removeTitleFilterClosure;
    public $addTitleFilterClosure;

    public function __construct()
    {
        $this->titleRemoveClosure = $this->wpAddFilter(
            'the_title',
            'titleRemove'
        );

        //remove the filer before menu title render
        $this->removeTitleFilterClosure = $this->wpAddFilter(
            'wp_nav_menu_args',
            'removeTitleFilter'
        );

        //add the filter back after the menu title is rendered
        $this->addTitleFilterClosure = $this->wpAddFilter(
            'wp_nav_menu_items',
            'addTitleFilter'
        );
        $this->addFilter('vcv:dataAjax:getData', 'outputTitle');
        $this->addFilter('vcv:dataAjax:setData', 'setPageTitle');
    }

    protected function removeTitleFilter($args)
    {
        $this->wpRemoveFilter('the_title', $this->titleRemoveClosure);

        return $args;
    }

    protected function addTitleFilter($item)
    {
        // callback must be same as defined in constructor in wpAddFilter
        add_filter(
            'the_title',
            $this->titleRemoveClosure,
            10,
            2
        );

        return $item;
    }

    protected function setPageTitle($response, $payload, Request $requestHelper, Frontend $frontendHelper)
    {
        $sourceId = $payload['sourceId'];
        $post = get_post($sourceId);
        if (is_object($post)) {
            $post = vchelper('Preview')->updateSourcePostWithAutosavePost($post);
            $sourceId = vchelper('Preview')->updateSourceIdWithAutosaveId($sourceId);

            $pageTitle = esc_html($requestHelper->input('vcv-page-title'));
            $pageTitleDisabled = $requestHelper->input('vcv-page-title-disabled', false);
            if ($requestHelper->exists('vcv-page-title') && !$pageTitle) {
                $pageTitleDisabled = true;
            }
            if ($post && $requestHelper->exists('vcv-page-title')) {
                // @codingStandardsIgnoreLine
                $post->post_title = $pageTitle;
                update_metadata('post', $sourceId, '_' . VCV_PREFIX . 'pageTitleDisabled', $pageTitleDisabled);
                //temporarily disable (can break preview page and content if not removed)
                kses_remove_filters();
                remove_filter('content_save_pre', 'balanceTags', 50);
                wp_update_post($post);
            }
        }

        return $response;
    }

    protected function outputTitle($response, $payload)
    {
        global $post;
        $pageTitleDisabled = get_post_meta($post->ID, '_' . VCV_PREFIX . 'pageTitleDisabled', true);

        $response['pageTitle'] = [
            // @codingStandardsIgnoreLine
            'current' => $post ? $post->post_title : '',
            'disabled' => $pageTitleDisabled || false,
        ];

        return $response;
    }

    /**
     * @param $title
     * @param $postId integer - id of the page/post
     *
     * @return string
     */
    protected function titleRemove($title, $postId)
    {
        if (!is_admin()) {
            $frontendHelper = vchelper('Frontend');
            $requestHelper = vchelper('Request');
            $post = vchelper('Preview')->updateSourcePostWithAutosavePost(get_post($postId));

            if ($post) {
                $disableMeta = get_post_meta($post->ID, '_' . VCV_PREFIX . 'pageTitleDisabled', true);
                // Add entry title only for correct Page Editable
                if ($frontendHelper->isPageEditable() && intval($requestHelper->input('vcv-source-id')) === $postId) {
                    $title = '<vcvtitle>' . $title . '</vcvtitle>';
                } else {
                    if ($disableMeta) {
                        $title = '';
                    }
                }
            }
        }

        return $title;
    }
}
