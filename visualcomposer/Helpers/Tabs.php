<?php

namespace VisualComposer\Helpers;

use VisualComposer\Framework\Illuminate\Support\Helper;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

class Tabs implements Helper
{
    public function getTabs()
    {
        $tabs = [
            'vcv-settings' => ['name' => 'General'],
        ];
        $tabs = vcfilter('vcv:settings:tabs', $tabs);

        return $tabs;
    }
}
