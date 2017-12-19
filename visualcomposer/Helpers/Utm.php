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
            'beNavbarLinkLogo' => 'https://visualcomposer.io/premium/?utm_medium=backend-editor&utm_source=vcwb-navbar&utm_campaign=vcwb&utm_content=logo',
            'feNavbarLinkLogo' => 'https://visualcomposer.io/premium/?utm_medium=frontend-editor&utm_source=vcwb-navbar&utm_campaign=vcwb&utm_content=logo',
            'updatesChangelogAuthorLink' => 'https://visualcomposer.io/?utm_medium=wp-dashboard&utm_source=plugins-page&utm_campaign=vcwb&utm_content=changelog-author',
            'updatesChangelogHomepageLink' => 'https://visualcomposer.io/?utm_medium=wp-dashboard&utm_source=plugins-page&utm_campaign=vcwb&utm_content=changelog',
            'goPremiumWpMenuSidebar' => 'https://visualcomposer.io/premium/?utm_medium=wp-dashboard&utm_source=wp-menu&utm_campaign=gopremium',
            'goPremiumNavBar' => 'https://visualcomposer.io/premium/?utm_medium=frontend-editor&utm_source=vcwb-navbar&utm_campaign=gopremium',
            'goPremiumPluginsPage' => 'https://visualcomposer.io/premium/?utm_medium=wp-dashboard&utm_source=plugins-page&utm_campaign=gopremium',
            'goPremiumDashboard' => 'https://visualcomposer.io/premium/?utm_medium=wp-dashboard&utm_source=plugin-activation&utm_campaign=gopremium',
            'goPremiumLostRef' => 'https://visualcomposer.io/',
            'feBlankPagePremiumTemplates' => 'https://visualcomposer.io/premium/?utm_medium=frontend-editor&utm_source=blank-page-wizard&utm_campaign=gopremium',
            'feAddTemplateSearchPremiumTemplates' => 'https://visualcomposer.io/premium/?utm_medium=frontend-editor&utm_source=add-template&utm_campaign=gopremium&utm_content=search',
            'feAddElementSearchPremiumVersion' => 'https://visualcomposer.io/premium/?utm_medium=frontend-editor&utm_source=add-element&utm_campaign=gopremium&utm_content=search',
            'feHubTeaserPremiumVersion' => 'https://visualcomposer.io/premium/?utm_medium=frontend-editor&utm_source=hub&utm_campaign=gopremium',
            'beBlankPagePremiumTemplates' => 'https://visualcomposer.io/premium/?utm_medium=backend-editor&utm_source=blank-page-wizard&utm_campaign=gopremium',
            'beAddTemplateSearchPremiumTemplates' => 'https://visualcomposer.io/premium/?utm_medium=backend-editor&utm_source=add-template&utm_campaign=gopremium&utm_content=search',
            'beAddElementSearchPremiumVersion' => 'https://visualcomposer.io/premium/?utm_medium=backend-editor&utm_source=add-element&utm_campaign=gopremium&utm_content=search',
            'beHubTeaserPremiumVersion' => 'https://visualcomposer.io/premium/?utm_medium=backend-editor&utm_source=hub&utm_campaign=gopremium',
        ];

        return $utm;
    }

    public function get($key)
    {
        $all = $this->all();

        return isset($all[ $key ]) ? $all[ $key ] : '';
    }
}
