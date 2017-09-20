<?php

namespace VisualComposer\Modules\Settings\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Settings\Traits\Fields;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Token;

/**
 * Class GetPremium.
 */
class GetPremium extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;
    use Fields;

    public function getSlug()
    {
        /** @var Settings $settings */
        $settings = vcapp('SettingsPagesSettings');

        return $settings->getSlug();
    }

    public function __construct(License $licenseHelper, Token $tokenHelper, Request $requestHelper)
    {
        if ('account' === vcvenv('VCV_ENV_ADDONS_ID')) {
            $this->optionGroup = $this->getSlug();
            $this->optionSlug = 'vcv-go-premium';

            if (!$licenseHelper->isActivated()) {
                $this->wpAddAction(
                    'vcv:settings:initAdmin:page:' . $this->getSlug(),
                    'buildPage',
                    110
                );
            }

            if (!$tokenHelper->isSiteAuthorized()) {
                $this->wpAddAction(
                    'admin_menu',
                    'goPremium'
                );
                $this->wpAddAction(
                    'in_admin_footer',
                    'addJs'
                );
            }

            if (!$licenseHelper->isActivated() && $tokenHelper->isSiteAuthorized()) {
                $this->addFilter(
                    'vcv:settings:getPages',
                    'addPage',
                    70
                );
            }
        }
    }

    /**
     * @param array $pages
     *
     * @return array
     */
    protected function addPage($pages)
    {
        $pages[] = [
            'slug' => $this->getSlug(),
            'title' => $this->buttonTitle(),
            'layout' => 'standalone',
            'showTab' => false,
            'controller' => $this,
            'capability' => 'manage_options',
        ];

        return $pages;
    }

    protected function buttonTitle()
    {
        $icon = '<svg version="1.1" id="Star" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 20 20" style="enable-background:new 0 0 20 20;fill:#fff;width:20px;padding: 0 8px 0 0;vertical-align: -6px;" xml:space="preserve">
<path d="M10,1.3l2.388,6.722H18.8l-5.232,3.948l1.871,6.928L10,14.744l-5.438,4.154l1.87-6.928L1.199,8.022h6.412L10,1.3z"/>
</svg>';

        return $icon . '<strong style="color:#fff;vertical-align: middle;font-weight:700">' . __('Go Premium', 'vcwb')
            . '</strong>';
    }

    /**
     * Add external link
     */
    protected function goPremium()
    {
        global $submenu;
        $url = vchelper('Utm')->get('goPremiumWpMenuSiderbar');
        $submenu['vcv-activation']['vcv-settings'] = [$this->buttonTitle(), 'manage_options', $url];
    }

    protected function buildPage(CurrentUser $currentUserAccess)
    {
        if (!$currentUserAccess->wpAll('manage_options')->get()) {
            return;
        }
        $sectionCallback = function () {
            $goPremiumUrl = esc_url(
                admin_url('admin.php?page=' . rawurlencode(vcapp('SettingsPagesPremium')->getSlug()))
            );
            $getPremiumUrl = vchelper('Utm')->get('goPremiumWpMenuSiderbar');
            $goPremiumTitle = __('start upgrade process', 'vcwb');
            $getPremiumTitle = __('get premium licence now', 'vcwb');
            $goPremium = sprintf('<a href="%s">%s</a>', $goPremiumUrl, $goPremiumTitle);
            $getPremium = sprintf('<a href="%s" target="_blank">%s</a>', $getPremiumUrl, $getPremiumTitle);

            $sectionDescription = __('You can %s or if you have one already, you can %s.', 'vcwb');

            echo sprintf(
                '<p class="description">%s</p>',
                sprintf($sectionDescription, $getPremium, $goPremium)
            );
        };
        $this->addSection(
            [
                'title' => __('Go Premium', 'vcwb'),
                'page' => $this->getSlug(),
                'callback' => $sectionCallback,
            ]
        );
    }

    /**
     * Avoid render error
     */
    public function render()
    {
    }

    /**
     * Add target _blank to external "Go Premium" link in sidebar
     */
    protected function addJs()
    {
        echo "<script>
        jQuery(document).ready(function($) {
            $('#toplevel_page_vcv-activation .wp-submenu li:last a').attr('target','_blank');
        });
        </script>";
    }
}
