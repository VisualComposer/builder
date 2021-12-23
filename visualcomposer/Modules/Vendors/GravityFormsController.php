<?php

namespace VisualComposer\Modules\Vendors;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Plugin compatibility
 *
 * @see https://www.gravityforms.com/
 */
class GravityFormsController extends Container implements Module
{
    use WpFiltersActions;

    public function __construct(Request $requestHelper)
    {
        if (!class_exists('GFAPI')) {
            return;
        }

        $this->wpAddAction('after_wp_tiny_mce', 'addInlineScripts');

        if (
            (defined('DOING_AJAX') && DOING_AJAX)
            || !is_admin()
            || $requestHelper->isAjax()
            || $requestHelper->exists(VCV_ADMIN_AJAX_REQUEST)
        ) {
            // fix for Gravity Forms 2.5+
            add_filter('gform_init_scripts_footer', '__return_false');
        }
    }

    /**
     * Add additional inline scripts.
     */
    protected function addInlineScripts()
    {
        echo '<script>window.gform && window.gform.initializeOnLoaded( function() { jQuery(document).trigger("gform_post_render", [1,1]) } );</script>';
    }
}
