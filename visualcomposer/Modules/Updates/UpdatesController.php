<?php

namespace VisualComposer\Modules\Updates;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Wp;

class UpdatesController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    /**
     * Update path
     *
     * @var string
     */


    public function __construct()
    {
        $this->addFilter('vcv:editor:variables', 'addPluginUpdateNoticeVariable');
        $this->wpAddAction('upgrader_process_complete', 'resetUpdateMessageCookies');
    }

    protected function addPluginUpdateNoticeVariable($variables, Wp $wpHelper)
    {
        $key = 'VCV_PLUGIN_UPDATE';
        $value = $wpHelper->getUpdateVersionFromWordpressOrg();
        $variables[] = [
            'key' => $key,
            'value' => !!$value,
            'type' => 'constant',
        ];

        return $variables;
    }

    protected function resetUpdateMessageCookies($upgraderObject, $options)
    {
        // Delete message cookie from editor on update of any Wp plugins
        unset($_COOKIE['vcv-update-notice']);
        if (!headers_sent()) {
            setcookie('vcv-update-notice', '', time() - (15 * 60));
        }
    }
}
