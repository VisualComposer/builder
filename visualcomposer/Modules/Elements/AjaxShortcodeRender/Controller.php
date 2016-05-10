<?php

namespace VisualComposer\Modules\Elements\AjaxShortcodeRender;

use VisualComposer\Helpers\Filters;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Framework\Container;

/**
 * Class Controller.
 */
class Controller extends Container /*implements Module*/
{
    /**
     * Controller constructor.
     *
     * @param \VisualComposer\Helpers\Filters $filterHelper
     */
    public function __construct(Filters $filterHelper)
    {
        $filterHelper->listen(
            'vcv:ajax:elements:ajaxShortcodeRender',
            function () {
                /** @see \VisualComposer\Modules\Elements\AjaxShortcodeRender\Controller::ajaxShortcodeRender */
                return $this->call('ajaxShortcodeRender');
            }
        );
    }

    /**
     * @param \VisualComposer\Helpers\Request $request
     */
    private function ajaxShortcodeRender(Request $request)
    {
        ob_start();
        echo do_shortcode($request->input('vcv-shortcode-string'));
        wp_print_head_scripts();
        wp_print_footer_scripts();
        $response = ob_get_clean();

        return $response;
    }
}
