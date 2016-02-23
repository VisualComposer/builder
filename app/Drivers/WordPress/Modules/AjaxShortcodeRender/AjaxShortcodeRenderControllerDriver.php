<?php

namespace App\Drivers\WordPress\Modules\AjaxShortcodeRender;

use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Http\Request;

class AjaxShortcodeRenderControllerDriver
{
    public function __construct(Dispatcher $event, Request $request)
    {
        $this->event = $event;
        add_action(
            'wp_ajax_vc:v:ajaxShortcodeRender',
            function () use ($request) {
                $content = do_shortcode($request->get('shortcodeString'));
                wp_print_head_scripts();
                wp_print_footer_scripts();
                die($content);
            }
        );
    }
}