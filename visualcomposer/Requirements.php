<?php
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
        $exitMsgPhp = sprintf('Visual Composer requires PHP %s or newer.', VCV_REQUIRED_PHP_VERSION)
            . '<a href="https://wordpress.org/about/requirements/"> ' . 'Please update!' . '</a>';
        self::checkVersion(VCV_REQUIRED_PHP_VERSION, PHP_VERSION, $exitMsgPhp);

        $exitMsgWp = sprintf('Visual Composer requires WordPress %s or newer.', VCV_REQUIRED_BLOG_VERSION)
            . '<a href="https://codex.wordpress.org/Upgrading_WordPress"> ' . 'Please update!' . '</a>';
        self::checkVersion(VCV_REQUIRED_BLOG_VERSION, get_bloginfo('version'), $exitMsgWp);

        return true;
    }

    /**
     * @param string $mustHaveVersion
     * @param string $versionToCheck
     * @param string $errorMessage
     *
     * @return bool
     */
    public function checkVersion($mustHaveVersion, $versionToCheck, $errorMessage = '')
    {
        if (version_compare($mustHaveVersion, $versionToCheck, '>')) {
            require_once ABSPATH . '/wp-admin/includes/plugin.php';
            $this->deactivate(VCV_PLUGIN_FULL_PATH);
            wp_die($errorMessage);
        }

        return true;
    }

    public function deactivate($path)
    {
        deactivate_plugins($path);
    }
}
