<?php

namespace VisualComposer\Modules\Elements\AjaxShortcodeRender;

use VisualComposer\Helpers\Generic\Request;
use VisualComposer\Framework\Container;

/**
 * Class Controller
 * @package VisualComposer\Modules\Elements\AjaxShortcodeRender
 */
class Controller extends Container
{
    /**
     * Controller constructor.
     */
    public function __construct()
    {
        add_action(
            'wp_ajax_vc:v:ajaxShortcodeRender',
            function () {
                $this->call('ajaxShortcodeRender');
            }
        );
    }

    /**
     * @param \VisualComposer\Helpers\Generic\Request $request
     */
    private function ajaxShortcodeRender(Request $request)
    {
        // @todo add _nonce, check access
        $content = do_shortcode($request->input('shortcodeString'));
        wp_print_head_scripts();
        wp_print_footer_scripts();
        die($content);
    }
}
