<?php

namespace VisualComposer\Modules\Elements\AjaxShortcodeRender;

use VisualComposer\Helpers\Generic\Request;
use VisualComposer\Framework\Container;

class Controller extends Container
{
    public function __construct()
    {
        add_action(
            'wp_ajax_vc:v:ajaxShortcodeRender',
            function () {
                $this->call('ajaxShortcodeRender');
            }
        );
    }

    private function ajaxShortcodeRender(Request $request)
    {
        // @todo add _nonce, check access
        $content = do_shortcode($request->input('shortcodeString'));
        wp_print_head_scripts();
        wp_print_footer_scripts();
        die($content);
    }
}
