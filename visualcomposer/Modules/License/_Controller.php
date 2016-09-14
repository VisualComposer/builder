<?php

namespace VisualComposer\Modules\License;

use VisualComposer\Framework\Container;
//use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\Core;
use VisualComposer\Helpers\Events;
use VisualComposer\Helpers\License as LicenseHelper;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Modules\Settings\Pages\License;

/**
 * Class Controller.
 */
class Controller extends Container/* implements Module*/
{
    /**
     * @var Events
     */
    private $events;

    /**
     * Controller constructor.
     *
     * @param Request $request
     * @param Events $events
     */
    public function __construct(Request $request, Events $events)
    {
        $this->events = $events;

        $events->listen('vcv:licenseController:deactivation', [$this, 'onDeactivation']);
        $events->listen('vcv:licenseController:activation', [$this, 'onActivation']);

        // TODO: Move to Loader.php ajax.
        add_action(
            'wp_ajax_vcv:getActivationUrl',
            function () {
                /** @see \VisualComposer\Modules\License\Controller::startActivationResponse */
                $this->call('startActivationResponse');
            }
        );

        // TODO: Move to Loader.php ajax.
        add_action(
            'wp_ajax_vcv:getDeactivationUrl',
            function () {
                /** @see \VisualComposer\Modules\License\Controller::startDeactivationResponse */
                $this->call('startDeactivationResponse');
            }
        );

        // TODO: This is not valid. We should use register_activation_callback.
        if ($request->exists('activate')) {
            /** @see \VisualComposer\Modules\License\Controller::finishActivation */
            $this->call('finishActivation', [$request->input('activate')]);
        } elseif ($request->exists('deactivate')) {
            /** @see \VisualComposer\Modules\License\Controller::finishDeactivation */
            $this->call('finishDeactivation', [$request->input('deactivate')]);
        }
    }

    /**
     * Get license page url.
     *
     * @param License $licensePage
     *
     * @return string
     */
    private function getLicensePage(License $licensePage)
    {
        return 'admin.php?page=' . $licensePage->getSlug();
    }

    /**
     * Output notice.
     *
     * @param string $message
     * @param bool $success
     */
    private function renderNotice($message, $success)
    {
        add_action(
            'admin_notices',
            function () use ($message, $success) {

                $args = ['message' => $message];

                $view = $success ? 'notice-success' : 'notice-error';

                echo vcview('settings/partials/' . $view, $args);
            }
        );
    }

    /**
     * Finish pending activation.
     *
     * 1) Make API call to Account.
     * 2) Receive success status and license key.
     * 3) Set new license key.
     *
     * @param LicenseHelper $licenseHelper
     * @param string $userToken
     *
     * @return bool
     */
    private function finishActivation(LicenseHelper $licenseHelper, $userToken)
    {
        /** @see \VisualComposer\Helpers\License::isValidToken */
        if (!$this->call([$licenseHelper, 'isValidToken'], [$userToken])) {
            /** @see \VisualComposer\Modules\License\Controller::renderNotice */
            $this->call(
                'renderNotice',
                [__('Token is not valid or has expired', 'vc5'), false]
            );

            return false;
        }

        $response = $this->sendActivationRequest($userToken);

        if (is_wp_error($response)) {
            /** @see \VisualComposer\Modules\License\Controller::renderNotice */
            $this->call(
                'renderNotice',
                [sprintf(__('%s. Please try again.', 'vc5'), $response->get_error_message()), false]
            );

            return false;
        }

        $status = $this->responseStatus($response);

        /** @see \VisualComposer\Helpers\License::setKeyToken */
        $this->call([$licenseHelper, 'setKeyToken'], ['']);
        $this->events->fire('vcv:licenseController:activation', [$status, $response]);

        return true;
    }

    /**
     * @param LicenseHelper $licenseHelper
     * @param bool $status
     * @param array $response
     *
     * @return bool
     */
    public function onActivation(LicenseHelper $licenseHelper, $status, $response)
    {
        if (!$status) {
            return false;
        }

        $json = json_decode($response['body'], true);

        foreach (['license_key', 'license_type'] as $key) {
            if (empty($json[ $key ])) {
                /** @see \VisualComposer\Modules\License\Controller::renderNotice */
                $this->call(
                    'renderNotice',
                    [__('Invalid response structure. Please contact us for support.', 'vc5'), false]
                );

                return false;
            }
        }

        if (!$this->call([$licenseHelper, 'isValidFormat'], [$json['license_key']])) {
            /** @see \VisualComposer\Modules\License\Controller::renderNotice */
            $this->call(
                'renderNotice',
                [__('Invalid license key format. Please contact us for support.', 'vc5'), false]
            );

            return false;
        }

        if (!in_array($json['license_type'], ['basic', 'premium'])) {
            /** @see \VisualComposer\Modules\License\Controller::renderNotice */
            $this->call(
                'renderNotice',
                [
                    sprintf(
                        __('Unexpected license type: %s. Please contact us for support.', 'vc5'),
                        $json['license_type']
                    ),
                    false,
                ]
            );

            return false;
        }

        /** @see \VisualComposer\Helpers\License::setKey */
        $this->call([$licenseHelper, 'setKey'], [$json['license_key']]);

        /** @see \VisualComposer\Helpers\License::setType */
        $this->call([$licenseHelper, 'setType'], [$json['license_type']]);

        /** @see \VisualComposer\Modules\License\Controller::renderNotice */
        $this->call('renderNotice', [__('Visual Composer successfully activated.', 'vc5'), true]);

        return true;
    }

    /**
     * Finish pending deactivation.
     *
     * 1) Make API call to Account.
     * 2) Receive success status.
     * 3) Unset license key.
     *
     * @param LicenseHelper $licenseHelper
     * @param string $userToken
     *
     * @return bool
     */
    private function finishDeactivation(LicenseHelper $licenseHelper, $userToken)
    {
        /** @see \VisualComposer\Helpers\License::isValidToken */
        if (!$this->call([$licenseHelper, 'isValidToken'], [$userToken])) {
            /** @see \VisualComposer\Modules\License\Controller::renderNotice */
            $this->call('renderNotice', [__('Token is not valid or has expired', 'vc5'), false]);

            return false;
        }

        $response = $this->sendDeactivationRequest($userToken);

        if (is_wp_error($response)) {
            /** @see \VisualComposer\Modules\License\Controller::renderNotice */
            $this->call(
                'renderNotice',
                [__(sprintf('%s. Please try again.', $response->get_error_message()), 'vc5'), false]
            );

            return false;
        }

        $status = $this->responseStatus($response);

        /** @see \VisualComposer\Helpers\License::setKeyToken */
        $this->call([$licenseHelper, 'setKeyToken'], ['']);
        $this->events->fire('vcv:licenseController:deactivation', $status);

        return true;
    }

    /**
     * @param LicenseHelper $licenseHelper
     * @param bool $status
     *
     * @return bool
     */
    public function onDeactivation(LicenseHelper $licenseHelper, $status)
    {
        if (!$status) {
            return false;
        }

        /** @see \VisualComposer\Helpers\License::setKey */
        $this->call([$licenseHelper, 'setKey'], ['']);

        /** @see \VisualComposer\Helpers\License::setType */
        $this->call([$licenseHelper, 'setType'], ['']);

        /** @see \VisualComposer\Modules\License\Controller::renderNotice */
        $this->call('renderNotice', [__('Visual Composer successfully deactivated.', 'vc5'), true]);

        return true;
    }

    /**
     * Check license key from remote.
     *
     * Function is used by Account to check if VC w/ specific license is still installed.
     *
     * @param Request $request
     * @param LicenseHelper $licenseHelper
     */
    private function checkLicenseKeyFromRemote(Request $request, LicenseHelper $licenseHelper)
    {
        $licenseKey = $request->input('license_key');

        if (!$this->call([$licenseHelper, 'isValid'], [$licenseKey])) {
            $response = ['status' => false, 'error' => __('Invalid license key', 'vc5')];
        } else {
            $response = ['status' => true];
        }

        wp_send_json($response);
    }

    /**
     * Generate action URL.
     *
     * @param LicenseHelper $licenseHelper
     *
     * @return string
     */
    private function generateActivationUrl(LicenseHelper $licenseHelper)
    {
        /** @see \VisualComposer\Helpers\License::newKeyToken */
        $token = sha1($this->call([$licenseHelper, 'newKeyToken']));

        $url = esc_url(site_url());

        /** @see \VisualComposer\Modules\License\Controller::getLicensePage */
        $licensePage = $this->call('getLicensePage');
        // TODO: Fix is_multisite() js_composer issue.
        $redirectUrl = esc_url(
            is_multisite() ? network_admin_url($licensePage) : admin_url($licensePage)
        );

        return sprintf(
            '%s/activate-license?token=%s&url=%s&redirect=%s&quiet=1',
            VCV_ACCOUNT_URL,
            $token,
            $url,
            $redirectUrl
        );
    }

    /**
     * Generate action URL.
     *
     * @param LicenseHelper $licenseHelper
     *
     * @return string
     */
    private function generateDeactivationUrl(LicenseHelper $licenseHelper)
    {
        /** @see \VisualComposer\Helpers\License::getKey */
        $licenseKey = $this->call([$licenseHelper, 'getKey']);

        /** @see \VisualComposer\Helpers\License::newKeyToken */
        $token = sha1($this->call([$licenseHelper, 'newKeyToken']));

        $url = esc_url(site_url());

        /** @see \VisualComposer\Modules\License\Controller::getLicensePage */
        $licensePage = $this->call('getLicensePage');
        // TODO: Fix is_multisite() js_composer issue.
        $redirectUrl = esc_url(
            is_multisite() ? network_admin_url($licensePage) : admin_url($licensePage)
        );

        return sprintf(
            '%s/deactivate-license?license_key=%s&token=%s&url=%s&redirect=%s&quiet=1',
            VCV_ACCOUNT_URL,
            $licenseKey,
            $token,
            $url,
            $redirectUrl
        );
    }

    /**
     * Start deactivation process and output redirect URL as JSON.
     *
     * @param CurrentUser $currentUserAccess
     *
     * @throws \Exception
     */
    private function startDeactivationResponse(CurrentUser $currentUserAccess)
    {
        // TODO: Fix permissions and then uncomment.
        //        $currentUserAccess
        //            ->checkAdminNonce()
        //            ->validateDie()
        //            ->wpAny('manage_options')
        //            ->validateDie()
        //            ->part('settings')
        //            ->can('vcv-license-tab')
        //            ->validateDie();

        /** @see \VisualComposer\Modules\License\Controller::generateDeactivationUrl */
        $response = [
            'status' => true,
            'url' => $this->call('generateDeactivationUrl'),
        ];

        wp_send_json($response);
    }

    /**
     * Start activation process and output redirect URL as JSON.
     *
     * @param CurrentUser $currentUserAccess
     *
     * @throws \Exception
     */
    private function startActivationResponse(CurrentUser $currentUserAccess)
    {
        // TODO: Fix permissions and then uncomment.
        //        $currentUserAccess
        //            ->reset()
        //            ->checkAdminNonce()
        //            ->validateDie()
        //            ->wpAny('manage_options')
        //            ->validateDie()
        //            ->part('settings')
        //            ->can('vcv-license-tab')
        //            ->validateDie();

        /** @see \VisualComposer\Modules\License\Controller::generateActivationUrl */
        $response = [
            'status' => true,
            'url' => $this->call('generateActivationUrl'),
        ];

        wp_send_json($response);
    }

    /**
     * Set up license activation notice if needed.
     *
     * Don't show notice on dev environment.
     *
     * @param LicenseHelper $licenseHelper
     * @param Core $core
     */
    private function setupReminder(LicenseHelper $licenseHelper, Core $core)
    {
        if ($this->isDevEnvironment()) {
            return;
        }

        // TODO: Fix cookie.
        $showActivationReminder = !$this->call([$licenseHelper, 'isActivated'])
            && empty($_COOKIE['vcvhideactivationmsg'])
            && !($core->isNetworkPlugin() && is_network_admin());

        if (!$showActivationReminder) {
            return;
        }

        add_action(
            'admin_notices',
            function () {
                /** @see \VisualComposer\Modules\License\Controller::renderLicenseActivationNotice */
                echo $this->call('renderLicenseActivationNotice');
            }
        );
    }

    /**
     * Check if current enviroment is dev.
     *
     * Environment is considered dev if host is:
     * - ip address.
     * - tld is local, dev, wp, test, example, localhost or invalid.
     * - no tld (localhost, custom hosts).
     *
     * @param string $host Hostname to check. If null, use HTTP_HOST.
     *
     * @return bool
     */
    private function isDevEnvironment($host = null)
    {
        if (!$host) {
            $host = $_SERVER['HTTP_HOST'];
        }

        $chunks = explode('.', $host);

        $domains = ['local', 'dev', 'wp', 'test', 'example', 'localhost', 'invalid'];

        if (1 === count($chunks) || in_array(end($chunks), $domains) || (preg_match('/^[0-9\.]+$/', $host))) {
            return true;
        }

        return false;
    }

    /**
     * Render license activation notice.
     *
     * @param Options $options
     */
    private function renderLicenseActivationNotice(Options $options)
    {
        // TODO: Fix key prefix.
        $options->set('vc5_license_activation_notified', 'yes');

        /** @see \VisualComposer\Modules\License\Controller::getLicensePage */
        $licensePage = $this->call('getLicensePage');

        // TODO: Fix \is_multisite() function call.
        $redirectUrl = is_multisite() ? network_admin_url($licensePage) : admin_url($licensePage);

        $redirectUrl = wp_nonce_url(esc_url(($redirectUrl)));

        vcview('settings/partials/activation-notice', ['redirectUrl' => $redirectUrl]);
    }

    /**
     * @param string $userToken
     *
     * @return array|WP_Error
     */
    private function sendActivationRequest($userToken)
    {
        $url = VCV_ACCOUNT_URL . '/finish-license-activation';

        $params = ['body' => ['token' => $userToken]];

        $response = wp_remote_post($url, $params);

        return $response;
    }

    /**
     * @param string $userToken
     *
     * @return array|WP_Error
     */
    private function sendDeactivationRequest($userToken)
    {
        $url = VCV_ACCOUNT_URL . '/finish-license-deactivation';

        $params = ['body' => ['token' => $userToken]];

        $response = wp_remote_post($url, $params);

        return $response;
    }

    /**
     * @param array|WP_Error $response
     *
     * @return bool
     */
    private function responseStatus($response)
    {
        $status = true;
        if (is_wp_error($response)) {
            /** @see \VisualComposer\Modules\License\Controller::renderNotice */
            $this->call(
                'renderNotice',
                [sprintf(__('%s. Please try again.', 'vc5'), $response->get_error_message()), false]
            );
            $status = false;
        } elseif ($response['response']['code'] !== 200) {
            /** @see \VisualComposer\Modules\License\Controller::renderNotice */
            $this->call(
                'renderNotice',
                [sprintf(__('Server did not respond with OK: %s', 'vc5'), $response['response']['code']), false]
            );
            $status = false;
        } else {
            $json = json_decode($response['body'], true);

            if (!$json || !isset($json['status'])) {
                /** @see \VisualComposer\Modules\License\Controller::renderNotice */
                $this->call(
                    'renderNotice',
                    [__('Invalid response structure. Please contact us for support.', 'vc5'), false]
                );
                $status = false;
            }

            if (!$json['status']) {
                /** @see \VisualComposer\Modules\License\Controller::renderNotice */
                $this->call(
                    'renderNotice',
                    [__('Something went wrong. Please contact us for support.', 'vc5'), false]
                );
                $status = false;
            }
        }

        return $status;
    }
}
