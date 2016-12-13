<?php

namespace VisualComposer\Modules\Elements\WpWidgets;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\EventsFilters;

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
     * Outputs widget script content
     */
    protected function script()
    {
        // This actually not a filter. we output header (application/javascript) and etc.
        header('Content-Type: application/javascript; charset=utf-8');
        echo vcview('elements/widgets/element.php');
        $this->terminate();
    }

    /**
     * Can be used in Mock to override
     */
    protected function terminate()
    {
        die();
    }
}
