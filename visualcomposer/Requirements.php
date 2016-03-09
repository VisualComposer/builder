<?php
/**
 * PHP 5.1! No namespaces must be there!
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Plugin requirements in driver WordPress
 * Class VcVCore_Requirements
 */
abstract class VcVCoreRequirements
{
    /**
     * Perform system check for requirements
     */
    public static function coreChecks()
    {
        $exitMsgPhp = sprintf('Visual Composer requires PHP %s or newer.', VC_V_REQUIRED_PHP_VERSION)
            . '<a href="http://wordpress.org/about/requirements/"> ' . 'Please update!' . '</a>';
        self::checkVersion(VC_V_REQUIRED_PHP_VERSION, PHP_VERSION, $exitMsgPhp);

        $exitMsgWp = sprintf('Visual Composer requires WordPress %s or newer.', VC_V_REQUIRED_BLOG_VERSION)
            . '<a href="http://codex.wordpress.org/Upgrading_WordPress"> ' . 'Please update!' . '</a>';
        self::checkVersion(VC_V_REQUIRED_BLOG_VERSION, get_bloginfo('version'), $exitMsgWp);
    }

    /**
     * @param string $mustHaveVersion
     * @param string $versionToCheck
     * @param string $errorMessage
     */
    private static function checkVersion($mustHaveVersion, $versionToCheck, $errorMessage = '')
    {
        if (version_compare($mustHaveVersion, $versionToCheck, '>')) {
            require_once ABSPATH . '/wp-admin/includes/plugin.php';
            deactivate_plugins(VC_V_PLUGIN_FULL_PATH);
            wp_die($errorMessage);
        }
    }
}

if (!defined('DOING_AJAX') || !DOING_AJAX) {
    VcVCoreRequirements::coreChecks();
}
