<?php

namespace VisualComposer\Modules\Elements\Traits;

use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Str;

/**
 * Class ShortcodesTrait
 * @package VisualComposer\Modules\Elements\Traits
 */
trait ShortcodesTrait
{
    /**
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Request $request
     * @param \VisualComposer\Helpers\Str $strHelper
     *
     * @return array
     */
    protected function renderEditor($response, $payload, Request $request, Str $strHelper)
    {
        if (!is_array($response)) {
            $response = [];
        }

        /** @see  \VisualComposer\Modules\Elements\Traits\ShortcodesTrait::renderEditorContent */
        $response['shortcodeContent'] = $this->call('renderEditorContent');
        /** @see \VisualComposer\Modules\Elements\Traits\ShortcodesTrait::renderEditorShortcode */
        $response['shortcode'] = $this->call('renderEditorShortcode');

        return $response;
    }

    /**
     * @param \VisualComposer\Helpers\Request $request
     * @param \VisualComposer\Helpers\Str $strHelper
     *
     * @return string
     */
    protected function renderEditorContent(Request $request, Str $strHelper)
    {
        ob_start();
        $atts = $request->input('vcv-atts');
        /** @see \VisualComposer\Modules\Elements\Traits\ShortcodesTrait::getShortcodeString */
        $shortcodeString = $this->call('getShortcodeString', [$atts]);
        do_action('wp_loaded'); // Fix for WooCommerce
        echo apply_filters(
            'the_content',
            $shortcodeString
        );
        wp_print_styles();
        print_late_styles();
        wp_print_head_scripts();
        wp_print_footer_scripts();
        $content = ob_get_clean();

        return $content;
    }

    /**
     * @param \VisualComposer\Helpers\Request $request
     * @param \VisualComposer\Helpers\Str $strHelper
     *
     * @return mixed
     */
    protected function renderEditorShortcode(Request $request, Str $strHelper)
    {
        $atts = $request->input('vcv-atts');

        /** @see \VisualComposer\Modules\Elements\Traits\ShortcodesTrait::getShortcodeString */
        return $this->call('getShortcodeString', [$atts]);
    }

    /**
     * @param $atts
     * @param \VisualComposer\Helpers\Str $strHelper
     *
     * @return string
     */
    protected function getShortcodeString($atts, Str $strHelper)
    {
        $shortcodeString = sprintf(
            '[%s %s]',
            $this->shortcodeTag,
            $strHelper->buildQueryString($atts)
        );

        return $shortcodeString;
    }
}
