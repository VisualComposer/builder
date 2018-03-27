<?php

namespace VisualComposer\Modules\System\TextDomain;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Framework\Illuminate\Support\Module;

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
        /** @see \VisualComposer\Modules\System\TextDomain\Controller::setDomain */
        $this->addEvent(
            'vcv:inited',
            'setDomain'
        );
    }

    protected function setDomain()
    {
        load_plugin_textdomain('vcwb', false, VCV_PLUGIN_DIRNAME . '/languages');
    }
}
