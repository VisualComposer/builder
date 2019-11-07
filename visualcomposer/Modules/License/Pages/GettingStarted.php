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

class GettingStarted extends Container implements Module
{
    use Page;
    use SubMenu;
    use EventsFilters;
    use WpFiltersActions;

    /**
     * @var string
     */
    protected $slug = 'vcv-getting-started';

    /**
     * @var string
     */
    protected $templatePath = 'license/layout';

    public function __construct()
    {
        $this->wpAddAction(
            'admin_menu',
            function (License $licenseHelper, Request $requestHelper) {
                if (!vchelper('AccessCurrentUser')->wpAll('edit_posts')->get()) {
                    return;
                }

                if (!$licenseHelper->isActivated()) {
                    $this->call('addPage');
                } elseif ($requestHelper->input('page') === $this->getSlug()) {
                    wp_redirect(admin_url('admin.php?page=vcv-about'));
                    exit;
                }

                if ($requestHelper->input('page') === 'vcv-activate-free') {
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
    }

    /**
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserHelper
     * @param \VisualComposer\Helpers\License $licenseHelper
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Utm $utmHelper
     *
     * @return bool|void
     * @throws \ReflectionException
     */
    protected function activateInAccount(
        CurrentUser $currentUserHelper,
        License $licenseHelper,
        Request $requestHelper,
        Utm $utmHelper
    ) {
        $urlHelper = vchelper('Url');
        $nonceHelper = vchelper('Nonce');
        $utm = $utmHelper->get('getting-started');
        wp_redirect(
            vcvenv('VCV_FREE_ACTIVATE_URL') .
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
            '&siteAuthorized=0' .
            '&vcv-version=' . VCV_VERSION .
            '&domain=' . get_site_url() .
            $utm
        );
        exit;
    }

    /**
     *
     */
    protected function beforeRender()
    {
        $urlHelper = vchelper('Url');
        wp_register_script(
            'vcv:wpUpdate:script',
            $urlHelper->to('public/dist/wpUpdate.bundle.js'),
            ['vcv:assets:vendor:script'],
            VCV_VERSION
        );
        wp_register_style(
            'vcv:wpUpdate:style',
            $urlHelper->to('public/dist/wpUpdate.bundle.css'),
            [],
            VCV_VERSION
        );
        wp_enqueue_script('vcv:wpUpdate:script');
        wp_enqueue_style('vcv:wpUpdate:style');
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
            'capability' => 'edit_posts',
        ];
        $this->addSubmenuPage($page);
    }

    protected function buttonTitle()
    {
        return sprintf(
            '<strong style="vertical-align: middle;font-weight:500;">%s</strong>',
            __('Getting Started', 'visualcomposer')
        );
    }
}
