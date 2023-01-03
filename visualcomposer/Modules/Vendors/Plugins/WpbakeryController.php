<?php

namespace VisualComposer\Modules\Vendors\Plugins;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Backward compatibility with "WPbakery" plugin.
 *
 * @see https://wpbakery.com/
 */
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
        /** @see \VisualComposer\Modules\Vendors\Plugins\WpbakeryController::disableWpbakery */
        $this->wpAddFilter(
            'vc_is_valid_post_type_be',
            'disableWpbakery'
        );
        /** @see \VisualComposer\Modules\Vendors\Plugins\WpbakeryController::hideWpbakeryActions */
        $this->wpAddFilter(
            'page_row_actions',
            'hideWpbakeryActions'
        );
        /** @see \VisualComposer\Modules\Vendors\Plugins\WpbakeryController::hideWpbakeryActions */
        $this->wpAddFilter(
            'post_row_actions',
            'hideWpbakeryActions'
        );
        /** @see \VisualComposer\Modules\Vendors\Plugins\WpbakeryController::hideWpbakeryAdminBarLink */
        $this->wpAddFilter(
            'admin_bar_menu',
            'hideWpbakeryAdminBarLink',
            1001
        );
    }
    protected function disableWpbakery($isValid)
    {
        $sourceId = get_the_ID();
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

    protected function hideWpbakeryAdminBarLink($wpAdminBar)
    {
        if (!is_object($wpAdminBar)) {
            // @codingStandardsIgnoreStart
            global $wp_admin_bar;
            $wpAdminBar = $wp_admin_bar;
            // @codingStandardsIgnoreEnd
        }

        if (is_singular()) {
            $sourceId = get_the_ID();
            $postContent = get_post_meta($sourceId, VCV_PREFIX . 'pageContent', true);
            if (!empty($postContent)) {
                $id = 'vc_inline-admin-bar-link';
                /** @var $wpAdminBar \WP_Admin_Bar */
                $wpAdminBar->remove_node($id);
            }
        }
    }
}
