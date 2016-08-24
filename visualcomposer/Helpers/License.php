<?php

namespace VisualComposer\Helpers;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Class License.
 */
class License extends Container implements Helper
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
     * @return string
     */
    public static function getKeyOptionName()
    {
        return self::$licenseKeyOption;
    }

    /**
     * @return string
     */
    public static function getTypeOptionName()
    {
        return self::$licenseTypeOption;
    }

    /**
     * @return string
     */
    public static function getKeyTokenOptionName()
    {
        return self::$licenseKeyTokenOption;
    }

    /**
     * Get license key.
     *
     * @param Options $options
     *
     * @return string
     */
    public function getKey(Options $options)
    {
        return $options->get(self::getKeyOptionName());
    }

    /**
     * Set license key.
     *
     * @param string $licenseKey
     * @param Options $options
     */
    public function setKey($licenseKey, Options $options)
    {
        $options->set(self::getKeyOptionName(), $licenseKey);
    }

    /**
     * Get license type.
     *
     * @param Options $options
     *
     * @return string
     */
    public function getType(Options $options)
    {
        return $options->get(self::getTypeOptionName());
    }

    /**
     * Set license type.
     *
     * @param string $licenseType
     * @param Options $options
     */
    public function setType($licenseType, Options $options)
    {
        $options->set(self::getTypeOptionName(), $licenseType);
    }

    /**
     * Get license key token.
     *
     * @param Options $options
     *
     * @return string
     */
    public function getKeyToken(Options $options)
    {
        return $options->get(self::getKeyTokenOptionName());
    }

    /**
     * Set license key token.
     *
     * @param string $token
     * @param Options $options
     */
    public function setKeyToken($token, Options $options)
    {
        $options->set(self::getKeyTokenOptionName(), $token);
    }

    /**
     * Check if specified license key is valid.
     *
     * @param string $licenseKey
     *
     * @return bool
     */
    public function isValid($licenseKey)
    {
        /** @see \VisualComposer\Helpers\License::getKey */
        return $licenseKey === $this->call('getKey');
    }

    /**
     * @return bool
     */
    public function isActivated()
    {
        /** @see \VisualComposer\Helpers\License::getKey */
        return (bool)$this->call('getKey');
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
     * @return string
     */
    public function generateKeyToken(Str $strHelper)
    {
        $token = time() . '|' . $strHelper->quickRandom(20);

        return $token;
    }

    /**
     * Generate and set new license key token.
     *
     * @return string
     */
    public function newKeyToken()
    {
        /** @see \VisualComposer\Helpers\License::generateKeyToken */
        $token = $this->call('generateKeyToken');

        /** @see \VisualComposer\Helpers\License::setKeyToken */
        $this->call('setKeyToken', [$token]);

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
        /** @see \VisualComposer\Helpers\License::getKeyToken */
        $token = $this->call('getKeyToken');

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
    public function isValidFormat($licenseKey)
    {
        $pattern = '/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i';

        return (bool)preg_match($pattern, $licenseKey);
    }
}
