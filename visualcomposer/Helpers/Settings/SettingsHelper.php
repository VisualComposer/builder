<?php

namespace VisualComposer\Helpers\Settings;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

class SettingsHelper implements Helper
{
    public function getAll()
    {
        $optionsHelper = vchelper('Options');
        $settings = $optionsHelper->get('settings', []);

        return empty($settings) ? [] : (array)$settings;
    }
}
