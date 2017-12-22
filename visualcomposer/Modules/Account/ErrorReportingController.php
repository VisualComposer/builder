<?php

namespace VisualComposer\Modules\Account;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;

class ErrorReportingController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:ajax:account:error:report:adminNonce', 'sendReport');
        $this->addFilter('vcv:backend:settings:extraOutput', 'addReportDetails');
        $this->addFilter('vcv:frontend:update:head:extraOutput', 'addReportDetails');
    }

    protected function addReportDetails($response, $payload)
    {
        $data = $this->call('getDetails');
        $variable = 'window.vcvErrorReportDetails=' . json_encode($data);
        $response[] = sprintf('<script>%s</script>', $variable);

        return $response;
    }

    protected function sendReport(
        $response,
        $payload,
        CurrentUser $currentUserAccessHelper,
        Request $requestHelper
    ) {
        if ($currentUserAccessHelper->wpAll('manage_options')->get()) {
            $licenseHelper = vchelper('License');
            $optionsHelper = vchelper('Options');

            $data = $this->getDetails($licenseHelper, $optionsHelper);
            $data['request'] = $requestHelper->all();

            $request = wp_remote_post(
                VCV_API_URL . '/api/report/error',
                [
                    'timeout' => 30,
                    'body' => $data,
                ]
            );
            if (!vcIsBadResponse($request)) {
                $response = ['status' => true];
            } else {
                $message['#10076'] = is_wp_error($request) ?
                    implode(
                        ';',
                        $request->get_error_messages()
                    ) : '';

                $response = ['status' => false, 'messages' => $data];
            }
        }

        return $response;
    }

    /**
     * @param $licenseHelper
     * @param $optionsHelper
     *
     * @return mixed
     */
    protected function getDetails(License $licenseHelper, Options $optionsHelper)
    {
        $data = [];
        $data['isActivated'] = $licenseHelper->isActivated();
        $data['license-key'] = $licenseHelper->getKey();
        $data['site'] = get_site_url();
        $data['url'] = VCV_PLUGIN_URL;
        $data['version'] = VCV_VERSION;
        $data['multisite'] = is_multisite();
        $data['category'] = $optionsHelper->get('activation-category');
        $data['email'] = $optionsHelper->get('activation-email');
        $data['admin-email'] = get_option('admin_email');
        $data['agreement'] = $optionsHelper->get('activation-agreement');
        $data['siteAuthState'] = $optionsHelper->get('siteAuthState');
        $theme = wp_get_theme();
        $data['active-theme'] = [];
        $data['active-theme']['name'] = $theme->get('Name');
        $data['active-theme']['version'] = $theme->get('Version');
        $data['active-theme']['uri'] = $theme->get('ThemeURI');
        $data['wp-version'] = get_bloginfo('version');
        $data['platform'] = php_uname();
        $data['browser'] = $_SERVER['HTTP_USER_AGENT'];
        $data['host'] = $_SERVER['HTTP_HOST'];
        // plugins list
        $data['plugins'] = wp_get_active_and_valid_plugins();

        return $data;
    }
}
