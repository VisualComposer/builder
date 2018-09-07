<?php

namespace VisualComposer\Modules\Vendors;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class WpbakeryController extends Container implements Module
{
    use WpFiltersActions;

    public function __construct()
    {
        $this->wpAddAction('init', 'initialize');
    }

    protected function initialize()
    {
        if (!defined('WPB_VC_VERSION')) {
            return;
        }

        $this->wpAddFilter(
            'vc_is_valid_post_type_be',
            'disableWpbakery'
        );

        $this->wpAddFilter(
            'hideWpbakeryActions',
            'page_row_actions'
        );

        $this->wpAddFilter(
            'post_row_actions',
            'hideWpbakeryActions'
        );

        $this->wpAddFilter(
            'admin_bar_menu',
            'hideWpbakeryAdminBarLink',
            1001
        );
    }

    protected function disableWpbakery($isValid)
    {
        $sourceId = get_the_id();
        $postContent = get_post_meta($sourceId, VCV_PREFIX . 'pageContent', true);
        if (!empty($postContent)) {
            return false;
        }

        return $isValid;
    }

    protected function hideWpbakeryActions($actions)
    {
        $post = get_post();
        $sourceId = $post->ID;
        $postContent = get_post_meta($sourceId, VCV_PREFIX . 'pageContent', true);
        if (!empty($postContent)) {
            unset($actions['edit_vc']);
        }

        return $actions;
    }

    // @codingStandardsIgnoreStart
    protected function hideWpbakeryAdminBarLink($wp_admin_bar)
    {
        if (!is_object($wp_admin_bar)) {
            global $wp_admin_bar;
        }
        // @codingStandardsIgnoreEnd
        if (is_singular()) {
            $sourceId = get_the_ID();
            $postContent = get_post_meta($sourceId, VCV_PREFIX . 'pageContent', true);
            if (!empty($postContent)) {
                $id = 'vc_inline-admin-bar-link';
                // @codingStandardsIgnoreStart
                $wp_admin_bar->remove_node( $id );
                // @codingStandardsIgnoreEnd
            }
        }
    }
}
