<?php

namespace VisualComposer\Modules\Elements\WpWidgets;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\WpWidgets;

/**
 * Class WpWidgetsScript
 * @package VisualComposer\Modules\Elements\WpWidgets
 */
class WpWidgetsScript extends Container implements Module
{
    use EventsFilters;

    /**
     * WpWidgetsScript constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Elements\WpWidgets\WpWidgetsScript::script */
        $this->addFilter('vcv:ajax:elements:widget:script:adminNonce', 'script');
    }

    /**
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\WpWidgets $widgets
     */
    protected function script(Request $requestHelper, WpWidgets $widgets)
    {
        // This actually not a filter. we output header (application/javascript) and etc.
        header('Content-Type: application/javascript; charset=utf-8');
        $key = $requestHelper->input('vcv-widget-key');
        $widget = $widgets->get($key);
        if ($widget) {
            echo vcview(
                'elements/widgets/element.php',
                [
                    'title' => $widget->name,
                    'key' => $key,
                ]
            );
        }
        die;
    }
}
