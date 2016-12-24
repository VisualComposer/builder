<?php

namespace VisualComposer\Modules\Editors\WpEditor;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Views;
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
        /** @see \VisualComposer\Modules\Editors\WpEditor\Controller::getWpEditor */
        $this->addFilter(
            'vcv:adminAjax:editor:wpEditor:adminNonce',
            'getWpEditor'
        );
    }

    /**
     * @param \VisualComposer\Helpers\Views $templates
     *
     * @return string
     */
    private function getWpEditor(Views $templates)
    {
        return $templates->render(
            'elements/wpeditor/wpeditor.php',
            []
        );
    }
}
