<?php

namespace VisualComposer\Modules\Elements\AjaxShortcodeRender;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class Controller.
 */
class Controller extends Container implements Module
{
    use EventsFilters;

    /**
     * Controller constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Elements\AjaxShortcodeRender\Controller::ajaxShortcodeRender */
        $this->addFilter(
            'vcv:ajax:elements:ajaxShortcodeRender:adminNonce',
            'ajaxShortcodeRender'
        );
    }

    /**
     * @param \VisualComposer\Helpers\Request $request
     *
     * @return string
     */
    private function ajaxShortcodeRender(Request $request)
    {
        ob_start();
        echo do_shortcode($request->input('vcv-shortcode-string'));
        // wp_print_head_scripts();
        // wp_print_footer_scripts();
        wp_print_styles();
        print_late_styles();
        $response = ob_get_clean();

        return $response;
    }
}
