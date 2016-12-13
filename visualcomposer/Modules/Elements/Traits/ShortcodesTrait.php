<?php

namespace VisualComposer\Modules\Elements\Traits;

use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Str;
use VisualComposer\Helpers\Traits\EventsFilters;

trait ShortcodesTrait
{
    use EventsFilters;

    /**
     * Controller constructor.
     */
    public function __construct()
    {
        /** @see ShortcodesFactory::renderEditor */
        $this->addFilter(
            'vcv:ajax:elements:' . $this->shortcodeNs . $this->shortcodeTag . ':adminNonce',
            'renderEditor'
        );
    }

    protected function renderEditor($response, Request $request, Str $strHelper)
    {
        if (!is_array($response)) {
            $response = [];
        }

        /** @see  \VisualComposer\Modules\Elements\Traits\ShortcodesTrait::renderEditorContent */
        $response['shortcodeContent'] = $this->call('renderEditorContent');
        $response['shortcode'] = $this->call('renderEditorShortcode');

        return $response;
    }

    private function renderEditorContent(Request $request, Str $strHelper)
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

    protected function renderEditorShortcode(Request $request, Str $strHelper)
    {
        $atts = $request->input('vcv-atts');

        /** @see \VisualComposer\Modules\Elements\Traits\ShortcodesTrait::getShortcodeString */
        return $this->call('getShortcodeString', [$atts]);
    }

    private function getShortcodeString($atts, Str $strHelper)
    {
        $shortcodeString = sprintf(
            '[%s %s]',
            $this->shortcodeTag,
            $strHelper->buildQueryString($atts)
        );

        return $shortcodeString;
    }
}
