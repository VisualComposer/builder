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
        $response['status'] = true;

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
        /** @see \VisualComposer\Modules\Elements\Traits\ShortcodesTrait::renderEditorShortcode */
        $shortcodeString = $this->call('renderEditorShortcode');
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
        $content = $request->input('vcv-content');

        /** @see \VisualComposer\Modules\Elements\Traits\ShortcodesTrait::getShortcodeString */
        return $this->call(
            'getShortcodeString',
            [
                'atts' => $atts,
                'content' => $content,
            ]
        );
    }

    /**
     * @param \VisualComposer\Helpers\Str $strHelper
     * @param $atts
     * @param string $content
     *
     * @return string
     */
    protected function getShortcodeString(Str $strHelper, $atts, $content = '')
    {
        $shortcodeString = sprintf(
            '[%s %s]%s[/%s]',
            $this->shortcodeTag,
            $strHelper->buildQueryString($atts),
            rawurlencode($content),
            $this->shortcodeTag
        );

        return $shortcodeString;
    }
}
