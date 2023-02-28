<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/**
 * PHP 5.1! No namespaces must be there!
 */

/**
 * Plugin requirements in driver WordPress.
 * Class VcvCoreRequirements.
 */
class VcvCoreRequirements
{
    /**
     * Perform system check for requirements
     * And return user-friendly error message if it's fails.
     *
     * @return false|string
     */
    public function getCoreRequirementsErrorMessages()
    {
        $errorList = $this->getCoreChecksMessage();

        if (!$errorList) {
            return false;
        }

        $messages = '';
        foreach ($errorList as $message) {
            $messages .= '<li>' . esc_html($message) . '</li>';
        }

        return sprintf(
            '%s%sTo run Visual Composer Website Builder your server needs to have:%s %s%s%s',
            '<div class="notice notice-error is-dismissible">',
            '<p>',
            '</p>',
            '<ul>',
            $messages,
            '</ul></div>'
        );
    }

    /**
     * Get error messages for requirements.
     *
     * @return array
     */
    public function getCoreChecksMessage()
    {
        $messages = [];

        //TODO: Return VCV_REQUIRED_PHP_VERSION after few releases
        if (!self::checkVersion(7.4, PHP_VERSION)) {
            $messages[] = sprintf('PHP version %s or greater is required', 7.4);
        }

        if (!self::checkVersion(VCV_REQUIRED_BLOG_VERSION, get_bloginfo('version'))) {
            $messages[] = sprintf('WordPress version %s or greater', VCV_REQUIRED_BLOG_VERSION);
        }

        if (!function_exists('curl_exec') || !function_exists('curl_init')) {
            $messages[] = 'The cURL extension must be loaded';
        }
        if (!self::checkEncoding()) {
            $messages[] = 'The base64/json functions must be loaded';
        }
        if (!function_exists('zlib_decode')) {
            $messages[] = 'The zip extension must be loaded zlib_decode() is not defined';
        }

        return $messages;
    }

    /**
     * Check required encoding functions.
     *
     * @return bool
     */
    public function checkEncoding()
    {
        return function_exists('base64_decode')
            || function_exists('base64_encode')
            || function_exists('json_decode')
            || function_exists('json_encode');
    }

    /**
     * Version compare helper.
     *
     * @param string $mustHaveVersion
     * @param string $versionToCheck
     *
     * @return bool
     */
    public function checkVersion($mustHaveVersion, $versionToCheck)
    {
        if (version_compare($mustHaveVersion, $versionToCheck, '>')) {
            return false;
        }

        return true;
    }
}
