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

/**
 * Class UpdatesController
 * @package VisualComposer\Modules\Updates
 */
class UpdatesController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    /**
     * @var string
     */
    protected $requiredVersion = '34.0';

    /**
     * @var int
     */
    protected $versionDifference = 4;

    /**
     * UpdatesController constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Updates\UpdatesController::addPluginUpdateNoticeVariable */
        $this->addFilter('vcv:editor:variables', 'addPluginUpdateNoticeVariable');
        /** @see \VisualComposer\Modules\Updates\UpdatesController::resetUpdateMessageCookies */
        $this->wpAddAction('upgrader_process_complete', 'resetUpdateMessageCookies');
    }

    /**
     * @param $variables
     * @param \VisualComposer\Helpers\Wp $wpHelper
     *
     * @return array
     */
    protected function addPluginUpdateNoticeVariable($variables, Wp $wpHelper)
    {
        $key = 'VCV_PLUGIN_UPDATE';
        $variables[] = [
            'key' => $key,
            'value' => $wpHelper->isNeedUpdate(),
            'type' => 'constant',
        ];

        return $variables;
    }

    /**
     * @param $upgraderObject
     * @param $options
     */
    protected function resetUpdateMessageCookies($upgraderObject, $options)
    {
        // Delete message cookie from editor on update of any Wp plugins
        unset($_COOKIE['vcv-update-notice']);
        if (!headers_sent()) {
            setcookie('vcv-update-notice', '', time() - (15 * 60));
        }
    }

    /**
     * Checking version differences
     * @return bool
     */
    protected function pluginCompareVersion($currentVersion)
    {
        return ((int)$currentVersion - (int)$this->requiredVersion) <= 4;
    }
}
