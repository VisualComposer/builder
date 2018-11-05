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
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Settings\Traits\Page;
use VisualComposer\Modules\Settings\Traits\SubMenu;

/**
 * Class UpgradeRedesign.
 */
class UpgradeRedesign extends Container implements Module
{
    use Page;
    use SubMenu;
    use EventsFilters;
    use WpFiltersActions;

    /**
     * @var string
     */
    protected $slug = 'vcv-upgrade';

    /**
     * @var string
     */
    protected $templatePath = '';

    /**
     * UpgradeRedesign constructor.
     *
     * @param \VisualComposer\Helpers\License $licenseHelper
     */
    public function __construct(License $licenseHelper)
    {
        if (!vcvenv('VCV_FT_ACTIVATION_REDESIGN')) {
            return;
        }

        if (!$licenseHelper->getKey() || ($licenseHelper->getKey() && $licenseHelper->getKeyToken())) {
            $this->wpAddAction(
                'admin_menu',
                'addPage',
                70
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
            'title' => __('Go Premium', 'vcwb'),
            'layout' => 'standalone',
            'showTab' => false,
            'hidePage' => true,
            'controller' => $this,
            'capability' => 'manage_options',
            'type' => 'premium',
        ];
        $this->addSubmenuPage($page);
    }

    /**
     *
     * @throws \ReflectionException
     */
    protected function beforePageRender()
    {
        if (!vchelper('AccessCurrentUser')->wpAll('manage_options')->get()) {
            return;
        }
        $licenseHelper = vchelper('License');
        $optionsHelper = vchelper('Options');
        if (!$licenseHelper->getKey()) {
            /** @see \VisualComposer\Modules\License\Pages\Upgrade::activateInAccount */
            $this->call('activateInAccount');
            exit;
        } elseif (!$licenseHelper->getKeyToken() || !$optionsHelper->get('bundleUpdateRequired')) {
            wp_redirect(admin_url('admin.php?page=vcv-about'));
            exit;
        }
    }

    /**
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserHelper
     * @param \VisualComposer\Helpers\License $licenseHelper
     *
     * @return bool|void
     * @throws \ReflectionException
     */
    protected function activateInAccount(CurrentUser $currentUserHelper, License $licenseHelper)
    {
        if (!$currentUserHelper->wpAll('manage_options')->get()) {
            return;
        }
        $urlHelper = vchelper('Url');
        $nonceHelper = vchelper('Nonce');

        wp_redirect(
            VCV_LICENSE_ACTIVATE_URL .
            '/?redirect=' . rawurlencode(
                $urlHelper->adminAjax(
                    ['vcv-action' => 'license:activate:adminNonce', 'vcv-nonce' => $nonceHelper->admin()]
                )
            ) .
            '&token=' . rawurlencode($licenseHelper->newKeyToken()) .
            '&url=' . VCV_PLUGIN_URL .
            '&domain=' . get_site_url()
        );
        exit;
    }
}
