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
            'vcv:ajax:elements:' . $this->shortcodeNs . $this->shortcodeTag,
            'renderEditor'
        );
        /** @see ShortcodesFactory::renderShortcode */
        $this->addFilter(
            'vcv:ajax:elements:' . $this->shortcodeNs . $this->shortcodeTag . ':clean',
            'renderShortcode'
        );
    }

    protected function renderEditor(Request $request, Str $strHelper)
    {
        ob_start();
        $atts = $request->input('vcv-atts');
        echo do_shortcode(
            sprintf(
                '[%s %s]',
                $this->shortcodeTag,
                $strHelper->buildQueryString($atts)
            )
        );
        wp_print_styles();
        print_late_styles();
        wp_print_head_scripts();
        wp_print_footer_scripts();
        $response = ob_get_clean();

        return $response;
    }

    protected function renderShortcode(Request $request, Str $strHelper)
    {
        $atts = $request->input('vcv-atts');

        return sprintf('[%s %s]', $this->shortcodeTag, $strHelper->buildQueryString($atts));
    }
}
