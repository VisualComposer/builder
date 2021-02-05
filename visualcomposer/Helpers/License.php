<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Class License.
 */
class License extends Container implements Helper
{
    /**
     * Get license key.
     *
     * @return string
     */
    public function getKey()
    {
        $optionsHelper = vchelper('Options');

        return $optionsHelper->get('license-key');
    }

    /**
     * Set license key.
     *
     * @param string $licenseKey
     */
    public function setKey($licenseKey)
    {
        $optionsHelper = vchelper('Options');
        $optionsHelper->set('license-key', trim($licenseKey));
    }

    /**
     * Get hidden license key.
     *
     * @return string
     */
    public function getHiddenKey()
    {
        $optionsHelper = vchelper('Options');
        $licenseKey = $optionsHelper->get('license-key');
        $licenseKey = substr($licenseKey, 0, strpos($licenseKey, '-'));

        return $licenseKey . '-****-****-****-************';
    }

    /**
     * @param $type
     */
    public function setType($type)
    {
        $optionsHelper = vchelper('Options');
        $optionsHelper->set('license-type', $type);
    }

    /**
     * @return mixed
     */
    public function getType()
    {
        $optionsHelper = vchelper('Options');

        return $optionsHelper->get('license-type');
    }

    /**
     * @param $expiration
     */
    public function setExpirationDate($expiration)
    {
        $optionsHelper = vchelper('Options');
        $optionsHelper->set('license-expiration', $expiration);
    }

    public function updateUsageDate($refresh = false)
    {
        $optionsHelper = vchelper('Options');
        $usage = $optionsHelper->get('license-usage');
        if (empty($usage) || $refresh) {
            $optionsHelper->set('license-usage', time());
        }
    }

    /**
     * @return mixed
     */
    public function getExpirationDate()
    {
        $optionsHelper = vchelper('Options');

        return $optionsHelper->get('license-expiration');
    }

    /**
     * @param string $redirectTo
     */
    public function refresh($redirectTo = 'vcv-update')
    {
        $token = vchelper('Token')->getToken();
        $optionsHelper = vchelper('Options');

        if ($token !== 'free-token') {
            // License is upgraded: fire check for update
            $optionsHelper->deleteTransient('lastBundleUpdate');
            vcevent('vcv:hub:checkForUpdate', ['token' => $token]);
            wp_redirect(admin_url('admin.php?page=' . $redirectTo));
            exit;
        }
    }

    /**
     * @return bool
     */
    public function isPremiumActivated()
    {
        return (bool)$this->getKey() && $this->getType() !== 'free';
    }

    /**
     * @return bool
     */
    public function isThemeActivated()
    {
        return $this->getType() === 'theme';
    }

    /**
     * @param $errorCode
     *
     * @codingStandardsIgnoreStart
     * @return string|void
     */
    public function licenseErrorCodes($errorCode)
    {
        $message = '';
        switch ($errorCode) {
            case 'expired':
            case 1:
                $message = __('Visual Composer Website Builder license has expired.', 'visualcomposer');
                break;
            case 'missing':
            case 'item_name_mismatch':
            case 2:
                $message = __('Couldn\'t find a valid Visual Composer Website Builder license.', 'visualcomposer');
                break;
            case 'invalid':
            case 'site_inactive':
            case 'disabled':
            case 'revoked':
            case 3:
                $message = __('Visual Composer Website Builder license has been deactivated.', 'visualcomposer');
                break;
            case 4:
                $message = __('The license key is missing, enter a valid license key.', 'visualcomposer');
                break;
            case 5:
                $message = __('URL is missing, try again.', 'visualcomposer');
                break;
            case 6:
                $message = __('Visual Composer Website Builder license is already activated.', 'visualcomposer');
                break;
            case 7:
                $message = __('Activation failed, try again.', 'visualcomposer');
                break;
            case 'no_activations_left':
                $message = __('The license key has reached the activation limit.', 'visualcomposer');
                break;
            case 'purchase_key_already_exist':
                $message = __(
                    'The purchase code is already used, deactivate the previous site, and try again.',
                    'visualcomposer'
                ); // theme activation
                break;
            default:
                $message = __('An error occurred, try again.', 'visualcomposer');
                break;
        }

        // @codingStandardsIgnoreEnd
        return $message;
    }

    /**
     * Hub terms agreement for free users
     *
     * @return string|void
     */
    public function agreeHubTerms()
    {
        $optionHelper = vchelper('Options');

        $agreeHubTerms = $optionHelper->get('agreeHubTerms', false);

        return $agreeHubTerms || $this->getType() === 'free';
    }
}
