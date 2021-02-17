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
        $source = 'vcwb';
        if (defined('VCV_AUTHOR_API_KEY')) {
            $source = 'theme-author-vcwb';
        }

        $premiumLicenseUtmTemplate = 'https://visualcomposer.com/premium/?utm_source=' . $source . '&utm_medium={medium}&utm_campaign=gopremium&utm_content=go-premium-button';

        return str_replace('{medium}', esc_attr($medium), $premiumLicenseUtmTemplate);
    }

    /**
     * @return array
     */
    public function all()
    {
        $licenseHelper = vchelper('License');
        $myVc = vcvenv('VCV_HUB_PUBLIC_URL');

        $supportLinkSlug = 'no-account';
        if ($licenseHelper->isPremiumActivated()) {
            $supportLinkSlug = 'support';
        }

        $source = 'vcwb';
        if (defined('VCV_AUTHOR_API_KEY')) {
            $source = 'theme-author-vcwb';
        }

        $activeTheme = get_stylesheet();

        $utm = [
            // Dashboard News Feed Direct URLs
            'wpdashboard-news-logo' => 'https://visualcomposer.com/?utm_source=' . $source . '&utm_medium=wpdashboard&utm_campaign=info&utm_content=logo',
            'wpdashboard-news-blog' => 'https://visualcomposer.com/blog/?utm_source=' . $source . '&utm_medium=wpdashboard&utm_campaign=info&utm_content=blog-text',
            'wpdashboard-news-blog-post' => '?utm_source=' . $source . '&utm_medium=wpdashboard&utm_campaign=info&utm_content=post-title-text',
            'wpdashboard-news-gopremium' => 'https://visualcomposer.com/premium/?utm_source=' . $source . '&utm_medium=wpdashboard&utm_campaign=gopremium&utm_content=go-premium-text',

            // Getting Started
            'gettingstarted' => 'https://visualcomposer.com/premium/?utm_source=' . $source . '&utm_medium=gettingstarted&utm_campaign=gopremium&utm_content=go-premium-text',

            // VC Dashboard Direct URLs
            'vcdashboard-help' => 'https://visualcomposer.com/help/?utm_source=' . $source . '&utm_medium=vcdashboard&utm_campaign=info&utm_content=help-menu',
            'vcdashboard-myvc' => rtrim($myVc, '\//')
                . '/?utm_source=' . $source . '&utm_medium=vcdashboard&utm_campaign=info&utm_content=my-visual-composer-menu',
            'vcdashboard-go-premium' => 'https://visualcomposer.com/premium/?utm_source=' . $source . '&utm_medium=vcdashboard&utm_campaign=gopremium&utm_content=go-premium-menu',
            'vcdashboard-license-go-premium' => 'https://visualcomposer.com/premium/?utm_source=' . $source . '&utm_medium=license-vcdashboard&utm_campaign=gopremium&utm_content=go-premium-button',
            'vcdashboard-logo-url' => 'https://visualcomposer.com/premium/?utm_source=' . $source . '&utm_medium=vcdashboard&utm_campaign=gopremium&utm_content=logo',

            // wpplugins
            'wpplugins' => 'https://visualcomposer.com/premium/?utm_source=' . $source . '&utm_medium=wpplugins&utm_campaign=gopremium&utm_content=go-premium-text',
            // Plugin Row Meta (changelog/more details) Direct URLS
            'wpplugins-meta-help-center' => 'https://visualcomposer.com/help/?utm_source=' . $source . '&utm_medium=wpplugins&utm_campaign=info&utm_content=help-center-text',
            'wpplugins-meta-api' => 'https://visualcomposer.com/help/api/?utm_source=' . $source . '&utm_medium=wpplugins&utm_campaign=info&utm_content=api-text',
            'wpplugins-meta-premium-support' => rtrim($myVc, '\//') . '/' . $supportLinkSlug . '/?utm_source=' . $source . '&utm_medium=wpplugins&utm_campaign=info&utm_content=premium-support-text',

            // Premium Promo Popup direct URL
            'editor-gopremium-popup-button' => 'https://visualcomposer.com/premium/?utm_source=' . $source
                . '&utm_medium=editor&utm_campaign=gopremium&utm_content=go-premium-popup-button',

            // Review Popup Button direct URL
            'editor-feedback-review-popup-button' => 'https://my.visualcomposer.com/feedback/visualcomposer/?utm_source=' . $source . '&utm_medium=editor&utm_campaign=feedback&utm_content=leave-your-feedback-popup-button',

            // vcv-activate-license myVC licenses URL
            'activate-license-myvc-license-url' => rtrim($myVc, '\//')
                . '/licenses/?utm_source=' . $source . '&utm_medium={medium}&utm_campaign=info&utm_content=my-visual-composer-text',
            'editor-logo-url' => 'https://visualcomposer.com/premium/?utm_source=' . $source . '&utm_medium=navbar-editor&utm_campaign=gopremium&utm_content=logo',

            // Editor popup teasers
            'editor-hub-popup-teaser' => 'https://visualcomposer.com/premium/?utm_source=' . $source . '&utm_medium={medium}&utm_campaign=gopremium&utm_content=teaser-go-premium-button',

            // Editor popup teasers
            'editor-hub-go-premium' => 'https://visualcomposer.com/premium/?utm_source=' . $source . '&utm_medium={medium}&utm_campaign=gopremium&utm_content=go-premium-button',

            // Editor layout teasers
            'editor-layout-go-premium' => 'https://visualcomposer.com/premium/?utm_source=' . $source . '&utm_medium=pagesettings-settings-editor&utm_campaign=gopremium&utm_content=teaser-go-premium-button',

            // Hub element/template free activate
            'editor-hub-popup-activate-free' => rtrim(vcvenv('VCV_HUB_PUBLIC_URL'), '\//') . '/free-license/?utm_source=' . $source . '&utm_medium={medium}&utm_campaign=get-free-license&utm_content=teaser-activate-hub-button',

            // Editor Popup Builder addon settings teaser
            'editor-popup-settings-go-premium' => 'https://visualcomposer.com/premium/?utm_source=' . $source . '&utm_medium=popup-settings-editor&utm_campaign=gopremium&utm_content=teaser-go-premium-button',

            // Editor form page-settings Element Lock(Role Manager) addon settings teaser
            'editor-element-lock-settings-go-premium' => 'https://visualcomposer.com/premium/?utm_source=' . $source . '&utm_medium=elementlock-settings-editor&utm_campaign=gopremium&utm_content=teaser-go-premium-button',

            // Editor VC Navbar Dropdown
            'editor-navbar-go-premium' => 'https://visualcomposer.com/premium/?utm_source=' . $source . '&utm_medium=navbar-editor&utm_campaign=gopremium&utm_content=go-premium-menu',

            // Editor Addon Item Button
            'editor-available-in-premium' => 'https://visualcomposer.com/premium/?utm_source=' . $source . '&utm_medium={medium}&utm_campaign=gopremium&utm_content=available-in-premium-button',

            // Created with badge button
            'created-with-badge-button' => 'https://visualcomposer.com/?utm_source=' . $source . '&utm_medium=vcbadge&utm_campaign=info&utm_content=createdwith-text&utm_term="' . $activeTheme . '"',
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
