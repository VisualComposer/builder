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
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Settings\Traits\Page;
use VisualComposer\Modules\Settings\Traits\SubMenu;

/**
 * Class Premium.
 */
class PremiumRedesign extends Container implements Module
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
    protected $templatePath = 'license/activation/layout';

    /**
     * Premium constructor.
     *
     * @param \VisualComposer\Helpers\Token $tokenHelper
     * @param \VisualComposer\Helpers\License $licenseHelper
     * @param \VisualComposer\Helpers\Request $requestHelper
     */
    public function __construct(Token $tokenHelper, License $licenseHelper, Request $requestHelper)
    {
        if (!vcvenv('VCV_FT_ACTIVATION_REDESIGN')) {
            return;
        }
        /** @see \VisualComposer\Modules\License\Pages\Premium::addPage */
        if ($requestHelper->input('page') === 'vcv-upgrade') {
            $this->addEvent('vcv:inited', 'beforePageRender');
        }

        if (($tokenHelper->isSiteAuthorized() && !$licenseHelper->getKey())
            || ($licenseHelper->getKey() && $licenseHelper->getKeyToken())) {
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
        if (!$licenseHelper->getKey()) {
            /** @see \VisualComposer\Modules\License\Pages\Premium::activateInAccount */
            $this->call('activateInAccount');
            exit;
        } elseif (!$licenseHelper->getKeyToken()) {
            $this->redirectToAbout();
        }
    }

    /**
     *
     */
    protected function beforeRender()
    {
        $this->addFilter('vcv:license:variables', 'addActivationVariables');
    }

    protected function addActivationVariables($variables)
    {
        $variables[] = [
            'key' => 'VCV_CREATE_NEW_URL',
            'value' => admin_url('admin.php?page=vcv-about'),
            'type' => 'constant',
        ];

        return $variables;
    }

    protected function redirectToAbout()
    {
        wp_redirect(admin_url('admin.php?page=vcv-about'));
        exit;
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
