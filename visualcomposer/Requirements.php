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
     * Perform system check for requirements.
     */
    public function coreChecks()
    {
        $messages = [];
        $die = false;

        //TODO: Return VCV_REQUIRED_PHP_VERSION after few releases
        if (!self::checkVersion(7.4, PHP_VERSION)) {
            $die = true;
            $messages[] = sprintf('PHP version %s or greater is required', 7.4);
        }

        if (!self::checkVersion(VCV_REQUIRED_BLOG_VERSION, get_bloginfo('version'))) {
            $die = true;
            $messages[] = sprintf('WordPress version %s or greater', VCV_REQUIRED_BLOG_VERSION);
        }

        if (!function_exists('curl_exec') || !function_exists('curl_init')) {
            $die = true;
            $messages[] = 'The cURL extension must be loaded';
        }
        if (
            !function_exists('base64_decode')
            || !function_exists('base64_encode')
            || !function_exists('json_decode')
            || !function_exists('json_encode')
        ) {
            $die = true;
            $messages[] = 'The base64/json functions must be loaded';
        }
        if (!function_exists('zlib_decode')) {
            $die = true;
            $messages[] = 'The zip extension must be loaded zlib_decode() is not defined';
        }

        if ($die) {
            $this->deactivate(VCV_PLUGIN_FULL_PATH);
            echo 'To run Visual Composer Website Builder your server needs to have:<ul>';
            echo '<ul>';
            foreach ($messages as $message) {
                echo '<li>' . esc_html($message) . '</li>';
            }
            echo '</ul>';
            echo '<a href="' . esc_url(admin_url('plugins.php')) . '">Go back to dashboard</a>';
            exit;
        }

        return true;
    }

    /**
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

    /**
     * @param $path
     */
    public function deactivate($path)
    {
        require_once ABSPATH . '/wp-admin/includes/plugin.php';
        if (!defined('VCV_PHPUNIT') || !VCV_PHPUNIT) {
            deactivate_plugins($path);
        }
    }
}
