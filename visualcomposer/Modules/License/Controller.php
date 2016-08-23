<?php

namespace VisualComposer\Modules\License;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\Core;
use VisualComposer\Helpers\Events;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Str;
use VisualComposer\Modules\Settings\Pages\License;

/**
 * Class Controller.
 */
class Controller extends Container implements Module
{
    /**
     * @var string
     */
    static protected $licenseKeyOption = 'license-key';

    /**
     * @var string
     */
    static protected $licenseTypeOption = 'license-type';

    /**
     * @var string
     */
    static protected $licenseKeyTokenOption = 'license-key-token';

    /**
     * @var Events
     */
    private $events;

    /**
     * Controller constructor.
     *
     * @param Request $request
     * @param \VisualComposer\Helpers\Events $events
     */
    public function __construct(Request $request, Events $events)
    {
        $this->events = $events;
        // TODO: This is not valid. We should use register_activation_callback.
        if ($request->exists('activate')) {
            /** @see \VisualComposer\Modules\License\Controller::finishActivation */
            $this->call('finishActivation', [$request->input('activate')]);
        } elseif ($request->exists('deactivate')) {
            /** @see \VisualComposer\Modules\License\Controller::finishDeactivation */
            $this->call('finishDeactivation', [$request->input('deactivate')]);
        }

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

        $events->listen('vcv:licenseController:deactivation', [$this, 'onDeactivation']);
        $events->listen('vcv:licenseController:activation', [$this, 'onActivation']);
    }

    /**
     * @return string
     */
    public static function getLicenseKeyOption()
    {
        return self::$licenseKeyOption;
    }

    /**
     * @return string
     */
    public static function getLicenseTypeOption()
    {
        return self::$licenseTypeOption;
    }

    /**
     * @return string
     */
    public static function getLicenseKeyTokenOption()
    {
        return self::$licenseKeyTokenOption;
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
     *
     * @return void
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
     * @param string $userToken
     *
     * @return bool
     */
    private function finishActivation($userToken)
    {
        /** @see \VisualComposer\Modules\License\Controller::isValidToken */
        if (!$this->call('isValidToken', [$userToken])) {
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

        /** @see \VisualComposer\Modules\License\Controller::setLicenseKeyToken */
        $this->call('setLicenseKeyToken', ['']);
        $this->events->fire('vcv:licenseController:activation', ['response' => $response, 'status' => $status]);
    }

    public function onActivation($response, $status)
    {
        if ($status) {
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

            if (!$this->isValidFormat($json['license_key'])) {
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

            /** @see \VisualComposer\Modules\License\Controller::setLicenseKey */
            $this->call('setLicenseKey', [$json['license_key']]);

            /** @see \VisualComposer\Modules\License\Controller::setLicenseType */
            $this->call('setLicenseType', [$json['license_type']]);

            /** @see \VisualComposer\Modules\License\Controller::renderNotice */
            $this->call('renderNotice', [__('Visual Composer successfully activated.', 'vc5'), true]);

            return true;
        }

        return false;
    }

    /**
     * Finish pending deactivation.
     *
     * 1) Make API call to Account.
     * 2) Receive success status.
     * 3) Unset license key.
     *
     * @param string $userToken
     *
     * @return bool
     */
    private function finishDeactivation($userToken)
    {
        /** @see \VisualComposer\Modules\License\Controller::isValidToken */
        if (!$this->call('isValidToken', [$userToken])) {
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

        /** @see \VisualComposer\Modules\License\Controller::setLicenseKeyToken */
        $this->call('setLicenseKeyToken', ['']);
        $this->events->fire('vcv:licenseController:deactivation', $status);

    }

    public function onDeactivation($status)
    {
        if ($status) {
            /** @see \VisualComposer\Modules\License\Controller::setLicenseKey */
            $this->call('setLicenseKey', ['']);

            /** @see \VisualComposer\Modules\License\Controller::setLicenseType */
            $this->call('setLicenseType', ['']);

            /** @see \VisualComposer\Modules\License\Controller::renderNotice */
            $this->call('renderNotice', [__('Visual Composer successfully deactivated.', 'vc5'), true]);
        }

        return true;
    }

    /**
     * @return bool
     */
    public function isActivated()
    {
        /** @see \VisualComposer\Modules\License\Controller::getLicenseKey */
        return (bool)$this->call('getLicenseKey');
    }

    /**
     * Check license key from remote.
     *
     * Function is used by Account to check if VC w/ specific license is still installed.
     *
     * @param Request $request
     */
    private function checkLicenseKeyFromRemote(Request $request)
    {
        $licenseKey = $request->input('license_key');

        if (!$this->isValid($licenseKey)) {
            $response = ['status' => false, 'error' => __('Invalid license key', 'vc5')];
        } else {
            $response = ['status' => true];
        }

        wp_send_json($response);
    }

    /**
     * Generate action URL.
     *
     * @return string
     */
    private function generateActivationUrl()
    {
        /** @see \VisualComposer\Modules\License\Controller::newLicenseKeyToken */
        $token = sha1($this->call('newLicenseKeyToken'));

        $url = esc_url(site_url());

        /** @see \VisualComposer\Modules\License\Controller::getLicensePage */
        $licensePage = $this->call('getLicensePage');
        // TODO: Fix is_multisite() js_composer issue.
        $redirectUrl = esc_url(
            is_multisite() ? network_admin_url($licensePage) : admin_url($licensePage)
        );

        return sprintf(
            '%s/activate-license?token=%s&url=%s&redirect=%s&quiet=0',
            VCV_ACCOUNT_URL,
            $token,
            $url,
            $redirectUrl
        );
    }

    /**
     * Generate action URL.
     *
     * @return string
     */
    private function generateDeactivationUrl()
    {
        /** @see \VisualComposer\Modules\License\Controller::getLicenseKey */
        $licenseKey = $this->call('getLicenseKey');

        /** @see \VisualComposer\Modules\License\Controller::newLicenseKeyToken */
        $token = sha1($this->call('newLicenseKeyToken'));

        $url = esc_url(site_url());

        /** @see \VisualComposer\Modules\License\Controller::getLicensePage */
        $licensePage = $this->call('getLicensePage');
        // TODO: Fix is_multisite() js_composer issue.
        $redirectUrl = esc_url(
            is_multisite() ? network_admin_url($licensePage) : admin_url($licensePage)
        );

        return sprintf(
            '%s/deactivate-license?license_key=%s&token=%s&url=%s&redirect=%s&quiet=0',
            VCV_ACCOUNT_URL,
            $licenseKey,
            $token,
            $url,
            $redirectUrl
        );
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
     * Set license key.
     *
     * @param string $licenseKey
     * @param Options $options
     */
    private function setLicenseKey($licenseKey, Options $options)
    {
        $options->set(self::getLicenseKeyOption(), $licenseKey);
    }

    /**
     * Get license key.
     *
     * @param Options $options
     *
     * @return string
     */
    private function getLicenseKey(Options $options)
    {
        return $options->get(self::getLicenseKeyOption());
    }

    /**
     * Set license type.
     *
     * @param string $licenseType
     * @param Options $options
     */
    private function setLicenseType($licenseType, Options $options)
    {
        $options->set(self::getLicenseTypeOption(), $licenseType);
    }

    /**
     * Get license type.
     *
     * @param Options $options
     *
     * @return string
     */
    private function getLicenseType(Options $options)
    {
        return $options->get(self::getLicenseTypeOption());
    }

    /**
     * Check if specified license key is valid.
     *
     * @param string $licenseKey
     *
     * @return bool
     */
    private function isValid($licenseKey)
    {
        /** @see \VisualComposer\Modules\License\Controller::getLicenseKey */
        return $licenseKey === $this->call('getLicenseKey');
    }

    /**
     * Set up license activation notice if needed.
     *
     * Don't show notice on dev environment.
     *
     * @param Core $core
     */
    private function setupReminder(Core $core)
    {
        if ($this->isDevEnvironment()) {
            return;
        }

        // TODO: Fix cookie.
        $showActivationReminder = !$this->isActivated()
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
     * Get license key token.
     *
     * @param Options $options
     *
     * @return string
     */
    private function getLicenseKeyToken(Options $options)
    {
        return $options->get(self::getLicenseKeyTokenOption());
    }

    /**
     * Set license key token.
     *
     * @param string $token
     * @param Options $options
     */
    private function setLicenseKeyToken($token, Options $options)
    {
        $options->set(self::getLicenseKeyTokenOption(), $token);
    }

    /**
     * Return new license key token.
     *
     * Token is used to change license key from remote location.
     *
     * Format is: timestamp|20-random-characters.
     *
     * @param StrCore $strHelper
     *
     * @return string
     */
    private function generateLicenseKeyToken(Str $strHelper)
    {
        $token = time() . '|' . $strHelper->quickRandom(20);

        return $token;
    }

    /**
     * Generate and set new license key token.
     *
     * @return string
     */
    private function newLicenseKeyToken()
    {
        /** @see \VisualComposer\Modules\License\Controller::generateLicenseKeyToken */
        $token = $this->call('generateLicenseKeyToken');

        /** @see \VisualComposer\Modules\License\Controller::setLicenseKeyToken */
        $this->call('setLicenseKeyToken', [$token]);

        return $token;
    }

    /**
     * Check if specified license key token is valid.
     *
     * @param string $tokenToCheck SHA1 hashed token.
     * @param int $ttlInSeconds Time to live in seconds. Default = 20min.
     *
     * @return bool
     */
    private function isValidToken($tokenToCheck, $ttlInSeconds = 1200)
    {
        /** @see \VisualComposer\Modules\License\Controller::getLicenseKeyToken */
        $token = $this->call('getLicenseKeyToken');

        if (!$tokenToCheck || $tokenToCheck !== sha1($token)) {
            return false;
        }

        $chunks = explode('|', $token);

        $diff = time() - $ttlInSeconds;
        if (intval($chunks[0]) < $diff) {
            return false;
        }

        return true;
    }

    /**
     * Check if license key format is valid.
     *
     * license key is version 4 UUID, that have form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx.
     * where x is any hexadecimal digit and y is one of 8, 9, A, or B.
     *
     * @param string $licenseKey
     *
     * @return bool
     */
    private function isValidFormat($licenseKey)
    {
        $pattern = '/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i';

        return (bool)preg_match($pattern, $licenseKey);
    }

    /**
     * @param string $userToken
     *
     * @return mixed
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
     * @return mixed
     */
    private function sendDeactivationRequest($userToken)
    {
        $url = VCV_ACCOUNT_URL . '/finish-license-deactivation';

        $params = ['body' => ['token' => $userToken]];

        $response = wp_remote_post($url, $params);

        return $response;
    }

    /**
     * @param $response
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
