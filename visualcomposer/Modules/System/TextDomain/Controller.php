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
        $locale = determine_locale();
        $locale = apply_filters('plugin_locale', $locale, 'visualcomposer');

        unload_textdomain('visualcomposer');
        load_textdomain('visualcomposer', WP_LANG_DIR . '/visualcomposer/visualcomposer-' . $locale . '.mo');
        load_plugin_textdomain('visualcomposer', false, VCV_PLUGIN_DIRNAME . '/languages');
    }
}
