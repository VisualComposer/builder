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
use VisualComposer\Helpers\Logger;
use VisualComposer\Helpers\Notice;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Request;
use VisualComposer\Modules\Settings\Traits\Page;
use VisualComposer\Modules\Settings\Traits\SubMenu;
use VisualComposer\Helpers\Utm;

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
        $this->addFilter('vcv:ajax:activateLicense:adminNonce', 'activateLicense');

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

        $this->addEvent('vcv:system:factory:reset', 'unsetOptions');
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
            __('Go Premium', 'visualcomposer')
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
            __('Go Premium', 'visualcomposer')
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
        if (!$currentUserHelper->wpAll('manage_options')->get()
            || !$requestHelper->exists('vcv-ref')
            || $requestHelper->input('vcv-ref') !== 'getting-started') {
            return;
        }
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
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Logger $loggerHelper
     * @param \VisualComposer\Helpers\Notice $noticeHelper
     * @param \VisualComposer\Helpers\License $licenseHelper
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @param \VisualComposer\Helpers\Token $tokenHelper
     *
     * @return array|mixed|object
     */
    public function activateLicense(
        Request $requestHelper,
        Logger $loggerHelper,
        Notice $noticeHelper,
        License $licenseHelper,
        Options $optionsHelper,
        Token $tokenHelper
    ) {
        $body = [
            'url' => VCV_PLUGIN_URL,
            'activation-type' => $requestHelper->input('vcv-activation-type'),
            'license-key' => $requestHelper->input('vcv-license-key'),
        ];

        $url = vchelper('Url')->query(vcvenv('VCV_ACTIVATE_LICENSE_URL'), $body);
        $result = wp_remote_get(
            $url,
            [
                'timeout' => 30,
            ]
        );

        $resultBody = [];
        if (is_array($result) && isset($result['body'])) {
            $resultBody = json_decode($result['body'], true);
        }

        if ($resultBody && isset($resultBody['error'], $resultBody['error']['type'], $resultBody['error']['code'])) {
            $code = $resultBody['error']['code'];
            $message = $licenseHelper->licenseErrorCodes($code);
            $loggerHelper->log(
                $message,
                [
                    'result' => $body,
                ]
            );
            $noticeHelper->addNotice(
                'license:activation',
                $message
            );

            return ['status' => false, 'response' => $resultBody];
        }

        if (!vcIsBadResponse($resultBody)) {
            $licenseHelper->setKey($requestHelper->input('vcv-license-key'));
            $optionsHelper->deleteTransient('lastBundleUpdate');
            $tokenHelper->setSiteAuthorized();
            $noticeHelper->removeNotice('premium:deactivated');

            return ['status' => true];
        }

        return $resultBody;
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

    /**
     * @param \VisualComposer\Helpers\Options $optionsHelper
     */
    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper
            ->delete('siteRegistered')
            ->delete('license-key');
    }
}
