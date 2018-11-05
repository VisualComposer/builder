<?php

namespace VisualComposer\Modules\Disabled;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Token;
use VisualComposer\Modules\Settings\Traits\Page;
use VisualComposer\Modules\Settings\Traits\SubMenu;

/**
 * Class GetPremium.
 */
class GetPremium extends Container implements Module
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
    protected $templatePath = 'account/partials/activation-layout';

    public function __construct(License $licenseHelper, Token $tokenHelper, Request $request)
    {
        if (vcvenv('VCV_FT_ACTIVATION_REDESIGN')) {
            return;
        }

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
                if (!$licenseHelper->isActivated()) {
                    /** @see \VisualComposer\Modules\License\Pages\GetPremium::addPage */
                    $this->call('addPage');
                } elseif ($requestHelper->input('page') === $this->getSlug()) {
                    wp_redirect(admin_url('admin.php?page=vcv-about'));
                    exit;
                }
            },
            70
        );

        if (!$tokenHelper->isSiteAuthorized() || ($tokenHelper->isSiteAuthorized() && !$licenseHelper->isActivated())) {
            $this->wpAddFilter(
                'plugin_action_links_' . VCV_PLUGIN_BASE_NAME,
                'pluginsPageLink'
            );
        }
    }

    /**
     *
     */
    protected function beforeRender()
    {
        $urlHelper = vchelper('Url');
        wp_register_script(
            'vcv:settings:script',
            $urlHelper->assetUrl('dist/wpsettings.bundle.js'),
            [],
            VCV_VERSION
        );
        wp_register_style(
            'vcv:settings:style',
            $urlHelper->assetUrl('dist/wpsettings.bundle.css'),
            [],
            VCV_VERSION
        );
        wp_enqueue_script('vcv:settings:script');
        wp_enqueue_style('vcv:settings:style');
    }

    protected function getPremiumUrl(License $licenseHelper)
    {
        $urlHelper = vchelper('Url');
        $nonceHelper = vchelper('Nonce');

        $url =
                VCV_LICENSE_ACTIVATE_URL .
                '/?redirect=' . rawurlencode(
                    $urlHelper->adminAjax(
                        ['vcv-action' => 'license:activate:adminNonce', 'vcv-nonce' => $nonceHelper->admin()]
                    )
                ) .
                '&token=' . rawurlencode($licenseHelper->newKeyToken()) .
                '&url=' . VCV_PLUGIN_URL .
                '&domain=' . get_site_url() .
                '&vcv-version=' . VCV_VERSION;
        return $url;
    }

    /**
     *
     */
    protected function addPage()
    {
        $page = [
            'slug' => $this->getSlug(),
            'title' => $this->buttonTitle(),
            'layout' => 'standalone',
            'showTab' => false,
            'controller' => $this,
            'capability' => 'manage_options'
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
     * Add target _blank to external "Go Premium" link in sidebar
     */
    protected function addJs()
    {
        evcview('premium/partials/get-premium-js');
    }

    /**
     * Add style to "Go Premium" link in sidebar
     */
    protected function addCss()
    {
        evcview('premium/partials/get-premium-css');
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
        $goPremiumLink = sprintf(
            '<a href="%s">%s</a>',
            esc_url(admin_url('admin.php?page=vcv-go-premium')) . '&vcv-ref=plugins-page',
            __('Go Premium', 'vcwb')
        );

        array_push($links, $goPremiumLink);

        return $links;
    }
}
