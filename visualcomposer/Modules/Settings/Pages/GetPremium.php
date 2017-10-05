<?php

namespace VisualComposer\Modules\Settings\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Token;

/**
 * Class GetPremium.
 */
class GetPremium extends About implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    /**
     * @var string
     */
    protected $slug = 'vcv-go-premium';

    public function __construct(License $licenseHelper, Token $tokenHelper, Request $requestHelper)
    {
        if ('account' === vcvenv('VCV_ENV_ADDONS_ID') && vcvenv('VCV_ENV_LICENSES')) {
            if (!$licenseHelper->isActivated()) {
                $this->wpAddAction(
                    'in_admin_footer',
                    'addJs'
                );
            }

            $this->addEvent(
                'vcv:inited',
                function (License $licenseHelper, Token $tokenHelper, Request $requestHelper) {
                    if (!$licenseHelper->isActivated()) {
                        /** @see \VisualComposer\Modules\Account\Pages\ActivationPage::addPage */
                        $this->addFilter(
                            'vcv:settings:getPages',
                            'addPage',
                            70
                        );

                        $this->wpAddAction('in_admin_header', 'addCss');
                    } elseif ($requestHelper->input('page') === $this->getSlug()) {
                        $aboutPage = vcapp('SettingsPagesAbout');
                        wp_redirect(admin_url('admin.php?page=' . rawurlencode($aboutPage->getSlug())));
                        exit;
                    }
                },
                70
            );

            if (!$tokenHelper->isSiteAuthorized()
                || ($tokenHelper->isSiteAuthorized()
                    && !$licenseHelper->isActivated())
            ) {
                $this->wpAddFilter(
                    'plugin_action_links_' . VCV_PLUGIN_BASE_NAME,
                    'pluginsPageLink'
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
        return '<strong style="vertical-align: middle;font-weight:500;">' . __('Go Premium', 'vcwb')
            . '</strong>';
    }


    /**
     * Add target _blank to external "Go Premium" link in sidebar
     */
    protected function addJs(License $licenseHelper)
    {
        if (!$licenseHelper->isActivated()) {
            echo "<script>
            jQuery(document).ready(function($) {
                $('#toplevel_page_vcv-activation, #toplevel_page_vcv-settings').addClass('vcv-go-premium');
            });
            var hoverColor = jQuery('#adminmenu li .wp-has-current-submenu, adminmenu li .current').css('background-color');
            var color = jQuery('#adminmenu li .wp-has-current-submenu, adminmenu li .current').css('color');
            jQuery( 'body' ).on( 'mouseenter', '#toplevel_page_vcv-activation.vcv-go-premium .wp-submenu li:last-child, #toplevel_page_vcv-settings.vcv-go-premium .wp-submenu li:last-child', function(){ 
              jQuery(this).css({'background-color': hoverColor})
              jQuery(this).find('a').css({'color': color})
            }); 
            jQuery( 'body' ).on( 'mouseleave', '#toplevel_page_vcv-activation.vcv-go-premium .wp-submenu li:last-child, #toplevel_page_vcv-settings.vcv-go-premium .wp-submenu li:last-child', function(){ 
              jQuery(this).css({'background-color': ''})
              jQuery(this).find('a').css({'color': ''})
            });
        </script>";
        }
    }

    /**
     * Add style to "Go Premium" link in sidebar
     */
    protected function addCss()
    {
        echo "<style>
            #toplevel_page_vcv-settings.vcv-go-premium .wp-submenu,
            #toplevel_page_vcv-activation.vcv-go-premium .wp-submenu {
                padding-bottom: 0px!important;
            }
            #toplevel_page_vcv-settings.vcv-go-premium .wp-submenu li:last-child, 
            #toplevel_page_vcv-activation.vcv-go-premium .wp-submenu li:last-child {
                padding-bottom: 7px;
            }
        </style>";
    }

    public function getActivePage()
    {
        return 'go-premium';
    }

    /**
     * Add go premium link in plugins page
     *
     * @param $links
     *
     * @return mixed
     */
    protected function pluginsPageLink($links)
    {
        $getPremiumPage = vcapp('SettingsPagesGetPremium');
        $licenseHelper = vchelper('License');

        if (!$licenseHelper->isActivated()) {
            $goPremiumLink = '<a href="' . esc_url(admin_url('admin.php?page=' . rawurlencode($getPremiumPage->getSlug()))) . '&vcv-ref=plugins-page">' . __('Go Premium', 'vcwb') . '</a>';
        }

        array_push($links, $goPremiumLink);

        return $links;
    }
}
