<?php

namespace VisualComposer\Modules\License;

use VisualComposer\Helpers\Generic\Request;
use VisualComposer\Helpers\Generic\Core;
use VisualComposer\Helpers\Generic\Data;
use VisualComposer\Helpers\Generic\Templates;
use VisualComposer\Helpers\WordPress\Options;
use VisualComposer\Modules\Access\CurrentUser\Access as CurrentUserAccess;
use VisualComposer\Modules\Settings\Pages\License;
use VisualComposer\Framework\Container;

class Controller extends Container
{
    /**
     * @var string
     */
    static protected $licenseKeyOption = 'license_key';
    /**
     * @var string
     */
    static protected $licenseKeyTokenOption = 'license_key_token';
    /**
     * @var string
     */
    static protected $activationHost = 'http://vc-account.dev';
    /**
     * @var string
     */
    private $error = null;

    /**
     * LicenseController constructor.
     *
     * @param Request $request
     */
    public function __construct(Request $request)
    {
        if ($request->exists('activate')) {
            $this->call('finishActivationDeactivation', [true, $request->input('activate')]);
        } elseif ($request->exists('deactivate')) {
            $this->call('finishActivationDeactivation', [false, $request->input('deactivate')]);
        }

        add_action(
            'wp_ajax_vc_get_activation_url',
            function () {
                $args = func_get_args();
                $this->call('startActivationResponse', $args);
            }
        );

        add_action(
            'wp_ajax_vc_get_deactivation_url',
            function () {
                $args = func_get_args();
                $this->call('startDeactivationResponse', $args);
            }
        );
    }

    /**
     * Get license page  url
     *
     * @return string
     */
    private function getLicensePage(License $licensePage)
    {
        return 'admin.php?page=' . $licensePage->getPageSlug();
    }

    /**
     * Output notice
     *
     * @param string $message
     * @param bool $success
     */
    private function renderNotice(Templates $templates, $message, $success = true)
    {
        $args = ['message' => $message];

        if ($success) {
            $templates->render('settings/partials/notice-success', $args);
        } else {
            $templates->render('settings/partials/notice-error', $args);
        }
    }

    /**
     * Show error
     *
     * @param string $error
     */
    private function renderError($error)
    {
        $this->error = $error;

        add_action(
            'admin_notices',
            function () {
                $args = func_get_args();
                $this->call('renderLastError', $args);
            }
        );
    }

    /**
     * Output last error
     */
    private function renderLastError()
    {
        $this->call('renderNotice', [$this->error, false]);
    }

    /**
     * Output successful activation message
     */
    private function renderActivatedSuccess()
    {
        $this->call('renderNotice', [__('Visual Composer successfully activated.', 'vc5'), true]);
    }

    /**
     * Output successful deactivation message
     */
    private function renderDeactivatedSuccess()
    {
        $this->call('renderNotice', [__('Visual Composer successfully deactivated.', 'vc5'), true]);
    }

    /**
     * Finish pending activation/deactivation
     *
     * 1) Make API call to support portal
     * 2) Receive success status and license key
     * 3) Set new license key
     *
     * @param bool $activation
     * @param string $userToken
     *
     * @return bool
     */
    private function finishActivationDeactivation($activation, $userToken)
    {
        if (!$this->isValidToken($userToken)) {
            $this->renderError(__('Token is not valid or has expired', 'vc5'));

            return false;
        }

        if ($activation) {
            $url = self::$activationHost . '/finish-license-activation';
        } else {
            $url = self::$activationHost . '/finish-license-deactivation';
        }

        $params = ['body' => ['token' => $userToken]];

        $response = wp_remote_post($url, $params);

        if (is_wp_error($response)) {
            $this->renderError(__(sprintf('%s. Please try again.', $response->get_error_message()), 'vc5'));

            return false;
        }

        if ($response['response']['code'] !== 200) {
            $this->renderError(__(sprintf('Server did not respond with OK: %s', $response['response']['code']), 'vc5'));

            return false;
        }

        $json = json_decode($response['body'], true);

        if (!$json || !isset($json['status'])) {
            $this->renderError(__('Invalid response structure. Please contact us for support.', 'vc5'));

            return false;
        }

        if (!$json['status']) {
            $this->renderError(__('Something went wrong. Please contact us for support.', 'vc5'));

            return false;
        }

        if ($activation) {
            if (!isset($json['license_key']) || !$this->isValidFormat($json['license_key'])) {
                $this->renderError(__('Invalid response structure. Please contact us for support.', 'vc5'));

                return false;
            }

            $this->setLicenseKey($json['license_key']);

            add_action(
                'admin_notices',
                function () {
                    $args = func_get_args();
                    $this->call('renderActivatedSuccess', $args);
                }
            );
        } else {
            $this->call('setLicenseKey', '');

            add_action(
                'admin_notices',
                function () {
                    $args = func_get_args();
                    $this->call('renderDeactivatedSuccess', $args);
                }
            );
        }

        $this->call('setLicenseKeyToken', '');

        return true;
    }

    /**
     * @return bool
     */
    public function isActivated()
    {
        return (bool)$this->call('getLicenseKey');
    }

    /**
     * Check license key from remote
     *
     * Function is used by support portal to check if VC w/ specific license is still installed
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
     * Generate action URL
     *
     * @return string
     */
    private function generateActivationUrl()
    {
        $token = sha1($this->newLicenseKeyToken());

        $url = esc_url(site_url());

        $redirectUrl = esc_url(
            is_multisite() ? network_admin_url($this->getLicensePage()) : admin_url($this->getLicensePage())
        );

        return sprintf(
            '%s/activate-license?token=%s&url=%s&redirect=%s',
            self::$activationHost,
            $token,
            $url,
            $redirectUrl
        );
    }

    /**
     * Generate action URL
     *
     * @return string
     */
    private function generateDeactivationUrl()
    {
        $licenseKey = $this->getLicenseKey();

        $token = sha1($this->newLicenseKeyToken());

        $url = esc_url(site_url());

        $redirectUrl = esc_url(
            is_multisite() ? network_admin_url($this->getLicensePage()) : admin_url($this->getLicensePage())
        );

        return sprintf(
            '%s/deactivate-license?license_key=%s&token=%s&url=%s&redirect=%s',
            self::$activationHost,
            $licenseKey,
            $token,
            $url,
            $redirectUrl
        );
    }

    /**
     * Start activation process and output redirect URL as JSON
     */
    private function startActivationResponse(CurrentUserAccess $currentUserAccess)
    {
        $currentUserAccess->reset()->checkAdminNonce()->validateDie()->wpAny('manage_options')->validateDie()->part(
            'settings'
        )->can('vc-v-license-tab')->validateDie();

        $response = [
            'status' => true,
            'url' => $this->generateActivationUrl(),
        ];

        wp_send_json($response);
    }

    /**
     * Start deactivation process and output redirect URL as JSON
     */
    private function startDeactivationResponse(CurrentUserAccess $currentUserAccess)
    {
        $currentUserAccess->checkAdminNonce()->validateDie()->wpAny('manage_options')->validateDie()->part('settings')
                          ->can('vc-v-license-tab')->validateDie();

        $response = [
            'status' => true,
            'url' => $this->generateDeactivationUrl(),
        ];

        wp_send_json($response);
    }

    /**
     * Set license key
     *
     * @param string $licenseKey
     */
    private function setLicenseKey($licenseKey, Options $options)
    {
        $options->set(self::$licenseKeyOption, $licenseKey);
    }

    /**
     * Get license key
     *
     * @return string
     */
    private function getLicenseKey(Options $options)
    {
        return $options->get(self::$licenseKeyOption);
    }

    /**
     * Check if specified license key is valid
     *
     * @param string $licenseKey
     *
     * @return bool
     */
    private function isValid($licenseKey)
    {
        return $licenseKey === $this->call('getLicenseKey');
    }

    /**
     * Set up license activation notice if needed
     *
     * Don't show notice on dev environment
     */
    private function setupReminder(Core $core)
    {
        if ($this->isDevEnvironment()) {
            return;
        }

        $showActivationReminder = !$this->isActivated()
            && empty($_COOKIE['vchideactivationmsg'])
            && !($core->isNetworkPlugin() && is_network_admin());

        if (!$showActivationReminder) {
            return;
        }

        add_action(
            'admin_notices',
            function () {
                $args = func_get_args();
                $this->call('renderLicenseActivationNotice', $args);
            }
        );
    }

    /**
     * Check if current enviroment is dev
     *
     * Environment is considered dev if host is:
     * - ip address
     * - tld is local, dev, wp, test, example, localhost or invalid
     * - no tld (localhost, custom hosts)
     *
     * @param string $host Hostname to check. If null, use HTTP_HOST
     *
     * @return bool
     */
    private function isDevEnvironment($host = null)
    {
        if (!$host) {
            $host = $_SERVER['HTTP_HOST'];
        }

        $chunks = explode('.', $host);

        if (1 === count($chunks)
            || in_array(end($chunks), ['local', 'dev', 'wp', 'test', 'example', 'localhost', 'invalid'])
            || (preg_match('/^[0-9\.]+$/', $host))
        ) {
            return true;
        }

        return false;
    }

    /**
     * Render license activation notice
     */
    private function renderLicenseActivationNotice(Options $options, Templates $templates)
    {
        $options->set('vc5_license_activation_notified', 'yes');

        $redirectUrl = is_multisite() ? network_admin_url($this->getLicensePage()) : admin_url($this->getLicensePage());

        $redirectUrl = wp_nonce_url(esc_url(($redirectUrl)));

        $templates->render('settings/partials/activation-notice', ['redirectUrl' => $redirectUrl]);
    }

    /**
     * Get license key token
     *
     * @return string
     */
    private function getLicenseKeyToken(Options $options)
    {
        return $options->get(self::$licenseKeyTokenOption);
    }

    /**
     * Set license key token
     *
     * @param string $token
     */
    private function setLicenseKeyToken($token, Options $options)
    {
        $options->set(self::$licenseKeyTokenOption, $token);
    }

    /**
     * Return new license key token
     *
     * Token is used to change license key from remote location
     *
     * Format is: timestamp|20-random-characters
     *
     * @return string
     */
    private function generateLicenseKeyToken(Data $data)
    {
        $token = time() . '|' . $data->randomString(20);

        return $token;
    }

    /**
     * Generate and set new license key token
     *
     * @return string
     */
    private function newLicenseKeyToken()
    {
        $token = $this->generateLicenseKeyToken();

        $this->setLicenseKeyToken($token);

        return $token;
    }

    /**
     * Check if specified license key token is valid
     *
     * @param string $tokenToCheck SHA1 hashed token
     * @param int $ttlInSeconds Time to live in seconds. Default = 20min
     *
     * @return bool
     */
    private function isValidToken($tokenToCheck, $ttlInSeconds = 1200)
    {
        $token = $this->getLicenseKeyToken();

        if (!$tokenToCheck || $tokenToCheck !== sha1($token)) {
            return false;
        }

        $chunks = explode('|', $token);

        if (intval($chunks[0]) < (time() - $ttlInSeconds)) {
            return false;
        }

        return true;
    }

    /**
     * Check if license key format is valid
     *
     * license key is version 4 UUID, that have form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
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
}
