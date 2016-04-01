<?php

namespace VisualComposer\Modules\License;

use VisualComposer\Helpers\Generic\Request;
use VisualComposer\Helpers\Generic\Core;
use VisualComposer\Helpers\Generic\Data;
use VisualComposer\Helpers\WordPress\Options;
use VisualComposer\Helpers\Generic\Access\CurrentUser\Access as CurrentUserAccess;
use VisualComposer\Modules\Settings\Pages\License;
use VisualComposer\Framework\Container;

/**
 * Class Controller
 * @package VisualComposer\Modules\License
 */
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
        // @todo this is not valid. we should use register_activation_callback..
        if ($request->exists('activate')) {
            /** @see \VisualComposer\Modules\License\Controller::finishActivationDeactivation */
            $this->call('finishActivationDeactivation', [true, $request->input('activate')]);
        } elseif ($request->exists('deactivate')) {
            /** @see \VisualComposer\Modules\License\Controller::finishActivationDeactivation */
            $this->call('finishActivationDeactivation', [false, $request->input('deactivate')]);
        }

        add_action(
            'wp_ajax_vcv:getActivationUrl',
            function () {
                /** @see \VisualComposer\Modules\License\Controller::startActivationResponse */
                $this->call('startActivationResponse');
            }
        );

        add_action(
            'wp_ajax_vcv:getDeactivationUrl',
            function () {
                /** @see \VisualComposer\Modules\License\Controller::startDeactivationResponse */
                $this->call('startDeactivationResponse');
            }
        );
    }

    /**
     * Get license page  url
     *
     * @param \VisualComposer\Modules\Settings\Pages\License $licensePage
     *
     * @return string
     */
    private function getLicensePage(License $licensePage)
    {
        return 'admin.php?page=' . $licensePage->getSlug();
    }

    /**
     * Output notice
     *
     * @param string $message
     * @param bool $success
     */
    private function renderNotice($message, $success = true)
    {
        $args = ['message' => $message];

        if ($success) {
            vcview('settings/partials/notice-success', $args);
        } else {
            vcview('settings/partials/notice-error', $args);
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
                /** @see \VisualComposer\Modules\License\Controller::renderLastError */
                $this->call('renderLastError');
            }
        );
    }

    /**
     * Output last error
     */
    private function renderLastError()
    {
        /** @see \VisualComposer\Modules\License\Controller::renderNotice */
        $this->call('renderNotice', [$this->error, false]);
    }

    /**
     * Output successful activation message
     */
    private function renderActivatedSuccess()
    {
        /** @see \VisualComposer\Modules\License\Controller::renderNotice */
        $this->call('renderNotice', [__('Visual Composer successfully activated.', 'vc5'), true]);
    }

    /**
     * Output successful deactivation message
     */
    private function renderDeactivatedSuccess()
    {
        /** @see \VisualComposer\Modules\License\Controller::renderNotice */
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
        /** @see \VisualComposer\Modules\License\Controller::isValidToken */
        if (!$this->call('isValidToken', [$userToken])) {
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
            /** @var $response \WP_Error */
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
            /** @see \VisualComposer\Modules\License\Controller::setLicenseKey */
            $this->call('setLicenseKey', [$json['license_key']]);

            add_action(
                'admin_notices',
                function () {
                    /** @see \VisualComposer\Modules\License\Controller::renderActivatedSuccess */
                    $this->call('renderActivatedSuccess');
                }
            );
        } else {
            /** @see \VisualComposer\Modules\License\Controller::setLicenseKey */
            $this->call('setLicenseKey', ['']);

            add_action(
                'admin_notices',
                function () {
                    /** @see \VisualComposer\Modules\License\Controller::renderDeactivatedSuccess */
                    $this->call('renderDeactivatedSuccess');
                }
            );
        }
        /** @see \VisualComposer\Modules\License\Controller::setLicenseKeyToken */
        $this->call('setLicenseKeyToken', ['']);

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
        /** @see \VisualComposer\Modules\License\Controller::newLicenseKeyToken */
        $token = sha1($this->call('newLicenseKeyToken'));

        $url = esc_url(site_url());

        /** @see \VisualComposer\Modules\License\Controller::getLicensePage */
        $licensePage = $this->call('getLicensePage');
        $redirectUrl = esc_url(
            is_multisite() ? network_admin_url($licensePage) : admin_url($licensePage)
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
        /** @see \VisualComposer\Modules\License\Controller::getLicenseKey */
        $licenseKey = $this->call('getLicenseKey');

        /** @see \VisualComposer\Modules\License\Controller::newLicenseKeyToken */
        $token = sha1($this->call('newLicenseKeyToken'));

        $url = esc_url(site_url());

        /** @see \VisualComposer\Modules\License\Controller::getLicensePage */
        $licensePage = $this->call('getLicensePage');
        $redirectUrl = esc_url(
            is_multisite() ? network_admin_url($licensePage) : admin_url($licensePage)
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
     *
     * @param \VisualComposer\Helpers\Generic\Access\CurrentUser\Access $currentUserAccess
     *
     * @throws \Exception
     */
    private function startActivationResponse(CurrentUserAccess $currentUserAccess)
    {
        $currentUserAccess->reset()->checkAdminNonce()->validateDie()->wpAny('manage_options')->validateDie()->part(
            'settings'
        )->can('vcv-license-tab')->validateDie();

        /** @see \VisualComposer\Modules\License\Controller::generateActivationUrl */
        $response = [
            'status' => true,
            'url' => $this->call('generateActivationUrl'),
        ];

        wp_send_json($response);
    }

    /**
     * Start deactivation process and output redirect URL as JSON
     *
     * @param \VisualComposer\Helpers\Generic\Access\CurrentUser\Access $currentUserAccess
     *
     * @throws \Exception
     */
    private function startDeactivationResponse(CurrentUserAccess $currentUserAccess)
    {
        $currentUserAccess->checkAdminNonce()->validateDie()->wpAny('manage_options')->validateDie()->part('settings')
                          ->can('vcv-license-tab')->validateDie();

        /** @see \VisualComposer\Modules\License\Controller::generateDeactivationUrl */
        $response = [
            'status' => true,
            'url' => $this->call('generateDeactivationUrl'),
        ];

        wp_send_json($response);
    }

    /**
     * Set license key
     *
     * @param string $licenseKey
     * @param \VisualComposer\Helpers\WordPress\Options $options
     */
    private function setLicenseKey($licenseKey, Options $options)
    {
        $options->set(self::$licenseKeyOption, $licenseKey);
    }

    /**
     * Get license key
     *
     * @param \VisualComposer\Helpers\WordPress\Options $options
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
        /** @see \VisualComposer\Modules\License\Controller::getLicenseKey */
        return $licenseKey === $this->call('getLicenseKey');
    }

    /**
     * Set up license activation notice if needed
     *
     * Don't show notice on dev environment
     *
     * @param \VisualComposer\Helpers\Generic\Core $core
     */
    private function setupReminder(Core $core)
    {
        if ($this->isDevEnvironment()) {
            return;
        }

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
                $this->call('renderLicenseActivationNotice');
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
     *
     * @param \VisualComposer\Helpers\WordPress\Options $options
     */
    private function renderLicenseActivationNotice(Options $options)
    {
        $options->set('vc5_license_activation_notified', 'yes');

        /** @see \VisualComposer\Modules\License\Controller::getLicensePage */
        $licensePage = $this->call('getLicensePage');
        $redirectUrl = is_multisite() ? network_admin_url($licensePage) : admin_url($licensePage);

        $redirectUrl = wp_nonce_url(esc_url(($redirectUrl)));

        vcview('settings/partials/activation-notice', ['redirectUrl' => $redirectUrl]);
    }

    /**
     * Get license key token
     *
     * @param \VisualComposer\Helpers\WordPress\Options $options
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
     * @param \VisualComposer\Helpers\WordPress\Options $options
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
     * @param \VisualComposer\Helpers\Generic\Data $data
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
        /** @see \VisualComposer\Modules\License\Controller::generateLicenseKeyToken */
        $token = $this->call('generateLicenseKeyToken');

        /** @see \VisualComposer\Modules\License\Controller::setLicenseKeyToken */
        $this->call('setLicenseKeyToken', [$token]);

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
        /** @see \VisualComposer\Modules\License\Controller::getLicenseKeyToken */
        $token = $this->call('getLicenseKeyToken');

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
