<?php

namespace VisualComposer\Modules\Vendors\Plugins;

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
 * Backward compatibility with "WPForms" plugin.
 *
 * @see https://wordpress.org/plugins/wpforms-lite
 */
class WpFormsController extends Container implements Module
{
    use WpFiltersActions;

    public function __construct(Request $requestHelper)
    {
        $this->wpAddAction('plugins_loaded', 'initialize');
    }

    /**
     * Plugin compatibility hooks initialization.
     */
    protected function initialize()
    {
        if (! defined( 'WPFORMS_VERSION' )) {
            return;
        }

        $requestHelper = vchelper('Request');
        if ($requestHelper->exists(VCV_ADMIN_AJAX_REQUEST) || $requestHelper->exists(VCV_AJAX_REQUEST)) {
            $this->wpAddFilter('wpforms_frontend_missing_assets_error_js_disable', '__return_true');
        }

        add_filter('wpforms_frontend_recaptcha_disable', [$this, 'disableReCaptcha'], 10, 1);
    }

    /**
     * Disable WPForms reCAPTCHA for specific plugin post types.
     *
     * @param bool $result
     *
     * @return bool
     */
    public function disableReCaptcha($result) {
        global $post;

        if (! $post) {
            return $result;
        }

        $postTypeHelper = vchelper('PostType');
        $editor_post_type = $postTypeHelper->getEditorTypeByPostTypeDependecy($post->post_type);

        if ($editor_post_type !== 'default') {
            return true;
        }

        return $result;
    }
}
