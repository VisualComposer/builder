<?php

namespace VisualComposer\Modules\License\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Utm;
use VisualComposer\Modules\Settings\Traits\Page;
use VisualComposer\Modules\Settings\Traits\SubMenu;

class GoPremium extends Container implements Module
{
    use Page;
    use SubMenu;
    use EventsFilters;
    use WpFiltersActions;

    /**
     * @var string
     */
    protected $slug = 'vcv-go-premium';

    /**
     * @var string
     */
    protected $templatePath = '';

    public function __construct(License $licenseHelper)
    {
        if (!$licenseHelper->isActivated()) {
            $this->wpAddAction(
                'in_admin_footer',
                'addJs'
            );
            $this->wpAddAction(
                'in_admin_header',
                'addCss'
            );
        }

        $this->wpAddAction(
            'admin_menu',
            function (License $licenseHelper, Request $requestHelper) {
                if (!vchelper('AccessCurrentUser')->wpAll('manage_options')->get()) {
                    return;
                }

                if (!$licenseHelper->isActivated()) {
                    $this->call('addPage');
                }
                if ($requestHelper->input('page') === $this->getSlug()) {
                    if (!$licenseHelper->isActivated()) {
                        $this->call('activateInAccount');
                    } else {
                        wp_redirect(admin_url('admin.php?page=vcv-about'));
                        exit;
                    }
                }
            },
            70
        );

        if (!$licenseHelper->isActivated()) {
            $this->wpAddFilter(
                'plugin_action_links_' . VCV_PLUGIN_BASE_NAME,
                'pluginsPageLink'
            );
        }
    }

    /**
     * @throws \Exception
     */
    protected function addPage()
    {
        $page = [
            'slug' => $this->getSlug(),
            'title' => $this->buttonTitle(),
            'layout' => 'standalone',
            'showTab' => false,
            'controller' => $this,
            'capability' => 'manage_options',
        ];
        $this->addSubmenuPage($page);
    }

    protected function buttonTitle()
    {
        return sprintf(
            '<strong style="vertical-align: middle;font-weight:500;">%s</strong>',
            __('Go Premium', 'vcwb')
        );
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
        /** @noinspection HtmlUnknownTarget */
        $goPremiumLink = sprintf(
            '<a href="%s">%s</a>',
            esc_url(admin_url('admin.php?page=vcv-go-premium&vcv-ref=plugins-page')),
            __('Go Premium', 'vcwb')
        );

        array_push($links, $goPremiumLink);

        return $links;
    }

    /**
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserHelper
     * @param \VisualComposer\Helpers\License $licenseHelper
     * @param \VisualComposer\Helpers\Token $tokenHelper
     *
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @param \VisualComposer\Helpers\Utm $utmHelper
     *
     * @return bool|void
     * @throws \ReflectionException
     */
    protected function activateInAccount(
        CurrentUser $currentUserHelper,
        License $licenseHelper,
        Token $tokenHelper,
        Request $requestHelper,
        Utm $utmHelper
    ) {
        if (!$currentUserHelper->wpAll('manage_options')->get()) {
            return;
        }
        $urlHelper = vchelper('Url');
        $nonceHelper = vchelper('Nonce');

        $vcvRef = $requestHelper->input('vcv-ref');
        $utm = $utmHelper->get($vcvRef);

        if (!$utm) {
            $utm = '&utm_medium=wp-dashboard&utm_source=wp-menu&utm_campaign=gopremium';
        }

        wp_redirect(
            vcvenv('VCV_LICENSE_ACTIVATE_URL') .
            '/?redirect=' . rawurlencode(
                $urlHelper->adminAjax(
                    [
                        'vcv-action' => 'license:activate:adminNonce',
                        'vcv-nonce' => $nonceHelper->admin(),
                    ]
                )
            ) .
            '&token=' . rawurlencode($licenseHelper->newKeyToken()) .
            '&url=' . VCV_PLUGIN_URL .
            '&siteAuthorized=' . $tokenHelper->isSiteAuthorized() .
            '&domain=' . get_site_url() .
            $utm
        );
        exit;
    }

    /**
     * Add target _blank to external "Go Premium" link in sidebar
     */
    protected function addJs()
    {
        evcview('license/get-premium-js');
    }

    /**
     * Add style to "Go Premium" link in sidebar
     */
    protected function addCss()
    {
        evcview('license/get-premium-css');
    }
}
