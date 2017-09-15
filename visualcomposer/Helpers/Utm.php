<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

class Utm implements Helper
{
    /**
     * @return array
     */
    public function all()
    {
        $utm = [
            'beNavbarLinkLogo' => 'https://visualcomposer.io/?utm_campaign=vcwb&utm_source=vc-wb-navbar&utm_medium=vc-wb-backend',
            'feNavbarLinkLogo' => 'https://visualcomposer.io/?utm_campaign=vcwb&utm_source=vc-wb-navbar&utm_medium=vc-wb-frontend',
        ];

        return $utm;
    }
}
