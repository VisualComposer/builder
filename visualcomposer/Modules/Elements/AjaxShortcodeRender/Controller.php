<?php

namespace VisualComposer\Modules\Elements\AjaxShortcodeRender;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Framework\Container;

/**
 * Class Controller
 */
class Controller extends Container implements Module
{
    /**
     * Controller constructor
     */
    public function __construct()
    {
        add_action(
            'vcv:ajax:loader:elements:ajaxShortcodeRender',
            function () {
                /** @see \VisualComposer\Modules\Elements\AjaxShortcodeRender\Controller::ajaxShortcodeRender */
                $this->call('ajaxShortcodeRender');
            }
        );
    }

    /**
     * @param \VisualComposer\Helpers\Request $request
     */
    public function ajaxShortcodeRender(Request $request)
    {
        // TODO: add _nonce, check access
        $content = do_shortcode($request->input('vcv-shortcode-string'));
        wp_print_head_scripts();
        wp_print_footer_scripts();
        $this->terminate($content);
    }
}
