<?php

namespace VisualComposer\Modules\Vendors;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class WpmlController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct()
    {
        $this->wpAddAction('plugins_loaded', 'initialize', 16);
    }

    protected function initialize()
    {
        if (defined('ICL_SITEPRESS_VERSION')) {
            $this->addFilter('vcv:frontend:pageEditable:url', 'addLangToLink');
            $this->addFilter('vcv:frontend:url', 'addLangToLink');
        }
    }

    protected function addLangToLink($url, $payload)
    {
        global $sitepress;
        if (is_object($sitepress) && strpos($url, 'lang') === false) {
            return add_query_arg(['lang' => $sitepress->get_current_language()], $url);
        }

        return $url;
    }
}
