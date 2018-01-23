<?php

namespace VisualComposer\Helpers\Hub;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

class Addons implements Helper
{
    public function getAddons()
    {
        $optionHelper = vchelper('Options');

        return $optionHelper->get('hubAddons', []);
    }

    public function setAddons($elements = [])
    {
        $optionHelper = vchelper('Options');

        return $optionHelper->set('hubAddons', $elements);
    }
}
