<?php

namespace VisualComposer\Modules\Elements\AjaxShortcode;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\PostType;
use VisualComposer\Helpers\Request;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class Controller.
 */
class Controller extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    /**
     * Controller constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Elements\AjaxShortcode\Controller::render */
        $this->addFilter(
            'vcv:ajax:elements:ajaxShortcode:adminNonce',
            'render'
        );
    }

    /**
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\PostType $postTypeHelper
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserAccessHelper
     *
     * @return string
     */
    protected function render(Request $requestHelper, PostType $postTypeHelper, CurrentUser $currentUserAccessHelper)
    {
        $sourceId = (int)$requestHelper->input('vcv-source-id');
        $response = '';
        if ($sourceId && $currentUserAccessHelper->wpAll(['edit_posts', $sourceId])->get()) {
            $postTypeHelper->setupPost($sourceId);
            $this->wpAddFilter(
                'print_scripts_array',
                function ($list) {
                    return array_diff($list, ['jquery-core', 'jquery', 'jquery-migrate']);
                }
            );
            ob_start();
            do_action('template_redirect'); // This fixes visual composer shortcodes
            //wp_head();
            echo do_shortcode($requestHelper->input('vcv-shortcode-string'));
            wp_footer();
            //            wp_print_head_scripts();
            //            wp_print_footer_scripts();
            //            wp_print_styles();
            //            print_late_styles();
            $response = ob_get_clean();
        }

        return $response;
    }
}
