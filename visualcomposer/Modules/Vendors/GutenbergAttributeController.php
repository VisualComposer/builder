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
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class GutenbergAttributeController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    public function __construct()
    {
        $this->wpAddAction('plugins_loaded', 'initialize', 16);
    }

    protected function initialize(Request $requestHelper)
    {
        if (function_exists('gutenberg_pre_init')) {
            $this->addFilter(
                'vcv:ajax:attributes:ajaxGutenberg:adminNonce',
                'getGutenberg',
                1
            );
        }
    }

    protected function getGutenberg($response)
    {
        add_action('admin_enqueue_scripts', 'gutenberg_editor_scripts_and_styles');
        add_filter('screen_options_show_screen', '__return_false');
        add_filter('admin_body_class', 'gutenberg_add_admin_body_class');
        ob_start();
        wp_head();
        $headContents = ob_get_clean();
        ob_start();
        gutenberg_intercept_post_new();
        the_gutenberg_project();
        $editorContents = ob_get_clean();
        ob_start();
        wp_footer();
        $footerContents = ob_get_clean();
        $response = [
            'headerContent' => $headContents,
            'editorContent' => $editorContents,
            'footerContent' => $footerContents,
        ];
        return $response;
    }
}
