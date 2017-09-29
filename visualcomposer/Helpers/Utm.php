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
            'beNavbarLinkLogo' => 'https://visualcomposer.io/?utm_medium=backend-editor&utm_source=vcwb-navbar&utm_campaign=vcwb&utm_content=logo',
            'feNavbarLinkLogo' => 'https://visualcomposer.io/?utm_medium=frontend-editor&utm_source=vcwb-navbar&utm_campaign=vcwb&utm_content=logo',
            'updatesChangelogAuthorLink' => 'https://visualcomposer.io/?utm_medium=wp-dashboard&utm_source=plugins-page&utm_campaign=vcwb&utm_content=changelog-author',
            'updatesChangelogHomepageLink' => 'https://visualcomposer.io/?utm_medium=wp-dashboard&utm_source=plugins-page&utm_campaign=vcwb&utm_content=changelog',
            'goPremiumWpMenuSidebar' => 'https://visualcomposer.io/premium/?utm_medium=wp-dashboard&utm_source=wp-menu&utm_campaign=gopremium',
            'goPremiumNavBar' => 'https://visualcomposer.io/premium/?utm_medium=frontend-editor&utm_source=vcwb-navbar&utm_campaign=gopremium',
            'goPremiumPluginsPage' => 'https://visualcomposer.io/premium/?utm_medium=wp-dashboard&utm_source=plugins-page&utm_campaign=gopremium',
            'feBlankPagePremiumTemplates' => 'http://google.com/fe',
            'feAddTemplateSearchPremiumTemplates' => 'http://google.com/fe',
            'feAddElementSearchPremiumVersion' => 'http://google.com/fe',
            'feHubTeaserPremiumVersion' => 'http://google.com/fe',
            'beBlankPagePremiumTemplates' => 'http://google.com/fe',
            'beAddTemplateSearchPremiumTemplates' => 'http://google.com/fe',
            'beAddElementSearchPremiumVersion' => 'http://google.com/fe',
            'beHubTeaserPremiumVersion' => 'http://google.com/fe',
        ];

        return $utm;
    }

    public function get($key)
    {
        $all = $this->all();

        return isset($all[ $key ]) ? $all[ $key ] : '';
    }
}
