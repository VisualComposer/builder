<?php

namespace VisualComposer\Modules\Disabled;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Settings\Traits\Page;
use VisualComposer\Modules\Settings\Traits\SubMenu;

/**
 * Class ActivationPage
 * @package VisualComposer\Modules\License\Pages
 */
class ActivationPage extends Container implements Module
{
    use Page;
    use SubMenu;
    use WpFiltersActions;
    use EventsFilters;

    /**
     * @var string
     */
    protected $slug = 'vcv-activation';

    /**
     * @var string
     */
    protected $templatePath = 'account/partials/activation-layout';

    /**
     * ActivationPage constructor.
     */
    public function __construct()
    {
        if (vcvenv('VCV_FT_ACTIVATION_REDESIGN')) {
            return;
        }
        $this->wpAddAction(
            'admin_menu',
            function (Token $tokenHelper, Request $requestHelper) {
                if (!$tokenHelper->isSiteAuthorized()) {
                    /** @see \VisualComposer\Modules\License\Pages\ActivationPage::addPage */
                    $this->call('addPage');
                } elseif ($requestHelper->input('page') === $this->getSlug()) {
                    wp_redirect(admin_url('admin.php?page=vcv-about'));
                    exit;
                }
            },
            1
        );
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

    /**
     *
     */
    protected function addPage()
    {
        $page = [
            'slug' => $this->getSlug(),
            'title' => __('Activation', 'vcwb'),
            'showTab' => false,
            'layout' => 'standalone',
            'controller' => $this,
            'type' => vcvenv('VCV_ENV_ADDONS_ID') !== 'account' ? 'standalone' : 'default', // TODO: check
            'capability' => 'manage_options',
        ];
        $this->addSubmenuPage($page);
    }

    /**
     * This method overrides by about page
     */
    public function getActivePage()
    {
        return vcfilter('vcv:account:activation:activePage', 'intro');
    }
}
