<?php

namespace VisualComposer\Modules\Elements\WpEditor;

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
            'vcv:ajax:elements:ajaxWpEditor:adminNonce',
            'getWpEditor'
        );
    }

    /**
     * @param \VisualComposer\Helpers\Request $request
     *
     * @return string
     */
    private function getWpEditor(Request $request)
    {
        $content = $request->input('vcv-content');
        $editorId = 'vcv-wpeditor-' . $request->input('vcv-field-key');
        ob_start();
        wp_editor(
            $content,
            $editorId,
            $settings = array (
                'media_buttons' => true,
                'wpautop' => false,
            )
        );
        wp_print_head_scripts();
        wp_print_footer_scripts();
        wp_print_styles();
        print_late_styles();
        $response = ob_get_clean();

        return $response;
    }
}
