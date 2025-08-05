<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Class Plugin.
 */
class Plugin implements Helper
{
    /**
     * Check if plugin is used certain amount of days.
     *
     * @param int $days
     *
     * @return bool
     */
    public function isActivelyUsed($days = 5)
    {
        $optionsHelper = vchelper('Options');
        $pluginActivationDate = $optionsHelper->get('plugin-activation');
        if (!empty($pluginActivationDate) && ((int)$pluginActivationDate + ($days * DAY_IN_SECONDS)) < time()) {
            // More than 1 month used current license-type
            return true;
        }

        return false;
    }
}
