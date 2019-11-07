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
     * Get license key token.
     *
     * @return string
     */
    public function getKeyToken()
    {
        $optionsHelper = vchelper('Options');

        return $optionsHelper->get('license-key-token');
    }

    /**
     * Set license key token.
     *
     * @param string $token
     */
    public function setKeyToken($token)
    {
        $optionsHelper = vchelper('Options');
        $optionsHelper->set('license-key-token', trim($token));
    }

    /**
     * @return bool
     */
    public function isActivated()
    {
        return (bool)$this->getKey();
    }

    /**
     * Return new license key token.
     *
     * Token is used to change license key from remote location.
     *
     * Format is: timestamp|20-random-characters.
     *
     * @param Str $strHelper
     *
     * @param \VisualComposer\Helpers\Nonce $nonceHelper
     *
     * @return string
     */
    protected function generateKeyToken(Str $strHelper, Nonce $nonceHelper)
    {
        $token = $nonceHelper->admin() . '|' . time() . '|' . $strHelper->quickRandom(10);

        return $token;
    }

    /**
     * Generate and set new license key token.
     *
     * @return string
     * @throws \ReflectionException
     */
    public function newKeyToken()
    {
        /** @see \VisualComposer\Helpers\License::generateKeyToken */
        $token = $this->call('generateKeyToken');

        /** @see \VisualComposer\Helpers\License::setKeyToken */
        $this->setKeyToken($token);

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
    public function isValidToken($tokenToCheck, $ttlInSeconds = 1200)
    {
        $token = $this->getKeyToken();

        if (!$tokenToCheck || $tokenToCheck !== sha1($token)) {
            return false;
        }

        $chunks = explode('|', $token);
        $nonceHelper = vchelper('Nonce');

        $diff = time() - $ttlInSeconds;
        if (!$nonceHelper->verifyAdmin($chunks[0])) {
            return false;
        }
        if (intval($chunks[1]) < $diff) {
            return false;
        }

        return true;
    }

    /**
     * @param $errorCode
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
                $message = __('License key is missing, please enter a valid license key.', 'visualcomposer');
                break;
            case 5:
                $message = __('Url is missing, please try again.', 'visualcomposer');
                break;
            case 6:
                $message = __('Visual Composer Website Builder license is already activated.', 'visualcomposer');
                break;
            case 7:
                $message = __('Activation failed, please try again.', 'visualcomposer');
                break;
            case 'no_activations_left':
                $message = __('Your license key has reached its activation limit.', 'visualcomposer');
                break;
            default:
                $message = __('An error occurred, please try again.', 'visualcomposer');
                break;
        }

        // @codingStandardsIgnoreEnd
        return $message;
    }
}
