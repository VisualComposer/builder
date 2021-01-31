<?php

namespace VisualComposer\Modules\License;

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
use VisualComposer\Helpers\Url;

/**
 * Class ErrorReportingController
 * @package VisualComposer\Modules\License
 */
class ErrorReportingController extends Container implements Module
{
    use EventsFilters;

    /**
     * ErrorReportingController constructor.
     */
    public function __construct()
    {
        $this->addFilter('vcv:editor:variables', 'addVariables');
        $this->addFilter('vcv:ajax:account:error:report:adminNonce', 'sendReport');
    }

    /**
     * @param $variables
     * @param $payload
     * @param \VisualComposer\Helpers\Url $urlHelper
     *
     * @return array
     */
    protected function addVariables($variables, $payload, Url $urlHelper)
    {
        $variables[] = [
            'key' => 'VCV_ERROR_REPORT_URL',
            'value' => $urlHelper->adminAjax(['vcv-action' => 'account:error:report:adminNonce']),
            'type' => 'constant',
        ];

        return $variables;
    }

    /**
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserAccessHelper
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @return array
     * @throws \ReflectionException
     */
    protected function sendReport(
        $response,
        $payload,
        CurrentUser $currentUserAccessHelper,
        Request $requestHelper
    ) {
        if ($currentUserAccessHelper->wpAll('manage_options')->get()) {
            $data = $this->call('getDetails');
            $data['request'] = $requestHelper->all();

            wp_remote_post(
                vcvenv('VCV_HUB_URL') . '/api/report/error',
                [
                    'timeout' => 30,
                    'body' => $data,
                ]
            );
        }

        return ['status' => true];
    }

    /**
     * @param $licenseHelper
     *
     * @return mixed
     */
    protected function getDetails(License $licenseHelper)
    {
        $data = [];
        $data['isPremiumActivated'] = $licenseHelper->isPremiumActivated();
        $data['license-key'] = $licenseHelper->getKey();
        $data['license-type'] = $licenseHelper->getType();
        $data['site'] = get_site_url();
        $data['url'] = VCV_PLUGIN_URL;
        $data['version'] = VCV_VERSION;
        $data['multisite'] = is_multisite();
        $data['admin-email'] = get_option('admin_email');
        $currentUser = wp_get_current_user();
        // @codingStandardsIgnoreLine
        $data['current-email'] = $currentUser->user_email;
        $theme = wp_get_theme();
        $data['active-theme'] = [];
        $data['active-theme']['name'] = $theme->get('Name');
        $data['active-theme']['version'] = $theme->get('Version');
        $data['active-theme']['uri'] = $theme->get('ThemeURI');
        $data['wp-version'] = get_bloginfo('version');
        $data['platform'] = (defined('PHP_OS') ? PHP_OS : '') . ' php-' . PHP_VERSION;
        $data['browser'] = $_SERVER['HTTP_USER_AGENT'];
        $data['host'] = $_SERVER['HTTP_HOST'];

        return $data;
    }
}
