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
        $hubUrl = vcvenv('VCV_HUB_PUBLIC_URL');
        $utm = [
            'goPremiumElementDownload' => 'https://visualcomposer.com/premium?utm_medium=frontend-editor&utm_source=hub&utm_campaign=gopremium&utm_content=locked-item',
            'getting-started' => 'https://visualcomposer.com/premium?utm_medium=wp-dashboard&utm_source=getting-started&utm_campaign=gopremium',
            'nav-bar' => 'https://visualcomposer.com/premium?utm_medium=frontend-editor&utm_source=vcwb-navbar&utm_campaign=gopremium',
            'activation-page' => 'https://visualcomposer.com/premium?utm_medium=wp-dashboard&utm_source=activation-page&utm_campaign=gopremium',
            'logoFrontend' => 'https://visualcomposer.com/premium?utm_medium=frontend-editor&utm_source=vcv-logo&utm_campaign=gopremium',
            'hub-banner' => 'https://visualcomposer.com/premium?utm_medium=frontend-editor&utm_source=hub&utm_campaign=hub-banner',
            'plugins-page' => 'https://visualcomposer.com/premium?utm_medium=wp-dashboard&utm_source=plugin-activation&utm_campaign=gopremium',
            'unsplash' => 'https://visualcomposer.com/premium?utm_medium=wp-dashboard&utm_source=unsplash&utm_campaign=gopremium',
            'dashboardNewsBlog' => 'https://visualcomposer.com/blog/?utm_medium=wp-dashboard&utm_source=dashboard-news&utm_campaign=blog',
            'dashboardNewsGoPremium' => 'https://visualcomposer.com/premium/?utm_medium=wp-dashboard&utm_source=dashboard-news&utm_campaign=gopremium',
            'dashboardNewsLogo' => 'https://visualcomposer.com/?utm_medium=wp-dashboard&utm_source=dashboard-news&utm_campaign=logo',
            'dashboardNewsBlogPost' => '?utm_medium=wp-dashboard&utm_source=dashboard-news&utm_campaign=blog',
            'upgradeToPremium' => 'https://my.visualcomposer.com/licenses/?utm_medium=wp-dashboard&utm_source=activation&utm_campaign=upgrade',

            // TODO: Change free hub element download urls (in js)
            // 'free-goPremiumElementDownload' => 'https://my.visualcomposer.com/free-license?utm_medium=frontend-editor&utm_source=hub&utm_campaign=get-free-license&utm_content=locked-item',
            'free-getting-started' => rtrim($hubUrl, '\//')
                . '/free-license?utm_medium=wp-dashboard&utm_source=getting-started&utm_campaign=get-free-license',
            'free-activation-page' => rtrim($hubUrl, '\//')
                . '/free-license?utm_medium=wp-dashboard&utm_source=activation-page&utm_campaign=get-free-license',
            'free-logoFrontend' => rtrim($hubUrl, '\//')
                . '/free-license?utm_medium=frontend-editor&utm_source=vcv-logo&utm_campaign=get-free-license',
            'free-hub-banner' => rtrim($hubUrl, '\//')
                . '/free-license?utm_medium=frontend-editor&utm_source=hub&utm_campaign=get-free-license&utm_content=hub-banner',
            'free-unsplash' => rtrim($hubUrl, '\//')
                . '/free-license?utm_medium=frontend-editor&utm_source=unsplash&utm_campaign=get-free-license',
        ];

        return $utm;
    }

    public function get($key, $type = 'premium')
    {
        $all = $this->all();

        $keyToSearch = $type === 'free' ? 'free-' . $key : $key;

        if (array_key_exists($keyToSearch, $all)) {
            return $all[ $keyToSearch ];
        }

        if ($type === 'free') {
            return $all['free-getting-started'];
        }

        return $all['getting-started'];
    }
}
