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
    public function premiumBtnUtm($medium)
    {
        $premiumLicenseUtmTemplate = 'https://visualcomposer.com/premium/?utm_source=vcwb&utm_medium={medium}&utm_campaign=gopremium&utm_content=button';

        return str_replace('{medium}', esc_attr($medium), $premiumLicenseUtmTemplate);
    }

    public function freeBtnUtm($medium)
    {
        $myVc = vcvenv('VCV_HUB_PUBLIC_URL');
        $freeLicenseUtmTemplate = sprintf(
            '%s/free-license/?utm_source=vcwb&utm_medium={medium}&utm_campaign=get-free-license&utm_content=button',
            rtrim($myVc, '\//')
        );

        return str_replace('{medium}', esc_attr($medium), $freeLicenseUtmTemplate);
    }

    /**
     * @return array
     */
    public function all()
    {
        $myVc = vcvenv('VCV_HUB_PUBLIC_URL');

        $utm = [
            // Dashboard News Feed Direct URLs
            'wp-dashboard-news-logo' => 'https://visualcomposer.com/?utm_source=vcwb&utm_medium=wp-dashboard&utm_campaign=info&utm_content=logo',
            'wp-dashboard-news-blog' => 'https://visualcomposer.com/blog/?utm_source=vcwb&utm_medium=wp-dashboard&utm_campaign=info&utm_content=text',
            'wp-dashboard-news-blog-post' => '?utm_source=vcwb&utm_medium=wp-dashboard&utm_campaign=info&utm_content=text-post',
            'wp-dashboard-news-gopremium' => 'https://visualcomposer.com/premium/?utm_source=vcwb&utm_medium=wp-dashboard&utm_campaign=gopremium&utm_content=text',

            // VC Dashboard Direct URLs
            'vc-dashboard-help' => 'https://visualcomposer.com/help/?utm_source=vcwb&utm_medium=vc-dashboard&utm_campaign=info&utm_content=menu',
            'vc-dashboard-myvc' => rtrim($myVc, '\//')
                . '/?utm_source=vcwb&utm_medium=vc-dashboard&utm_campaign=info&utm_content=menu',

            // Plugin Row Meta (changelog/more details) Direct URLS
            'wp-plugins-meta-help-center' => 'https://visualcomposer.com/help/?utm_source=vcwb&utm_medium=wp-plugins&utm_campaign=info&utm_content=text',
            'wp-plugins-meta-api' => 'https://visualcomposer.com/help/api/?utm_source=vcwb&utm_medium=wp-plugins&utm_campaign=info&utm_content=text',
            'wp-plugins-meta-premium-support' => rtrim($myVc, '\//')
                . '/support/?utm_source=vcwb&utm_medium=wp-plugins&utm_campaign=info&utm_content=text',

            // Premium Promo Popup direct URL
            'editor-gopremium-popup-button' => 'https://visualcomposer.com/premium/?utm_source=vcwb&utm_medium=editor&utm_campaign=gopremium&utm_content=popup-button',

            // Review Popup Button direct URL
            'editor-feedback-review-popup-button' => 'https://my.visualcomposer.com/feedback/visualcomposer/?utm_source=vcwb&utm_medium=editor&utm_campaign=feedback&utm_content=button',

            // vcv-activate-license myVC licenses URL
            'activate-license-myvc-license-url' => rtrim($myVc, '\//')
                . '/licenses/?utm_source=vcwb&utm_media={media}&utm_campaign=info&utm_content=text',
        ];

        return $utm;
    }

    public function get($key)
    {
        $all = $this->all();

        if (array_key_exists($key, $all)) {
            return $all[ $key ];
        }

        // Default fallback (note: it is error-state)
        return $all['editor-gopremium-popup-button'];
    }
}
