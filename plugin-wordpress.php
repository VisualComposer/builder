<?php
/**
 * Plugin Name: Visual Composer Web Site builder
 * Plugin URI: http://visualcomposer.io
 * Description: WEB Site builder
 *
 * Version: 1.0.0-dev-2
 * Author: WPBakery
 * Author URI: http://wpbakery.com
 * Requires at least: 4.1
 * Tested up to: 4.5
 */

/**
 * Check for direct call file.
 */
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/**
 * Skip loading when installing.
 *
 * @see wp_installing
 */
if (defined('WP_INSTALLING') && WP_INSTALLING) {
    return;
}

/**
 * Check for plugin conflict.
 */
if (defined('VCV_VERSION')) {
    wp_die('It seems that other version of Visual Composer is active. Please deactivate it before use this version');
}

/**
 * Plugin version constant: '1.0.0-dev-2'
 */
define('VCV_VERSION', '1.0.0-dev-2');
/**
 * Plugin url: 'http://web/wp-content/plugins/plugin_dir/'
 */
define('VCV_PLUGIN_URL', plugin_dir_url(__FILE__));
/**
 * Plugin directory full path: 'server/web/wp-content/plugins/plugin_dir/'
 * @internal - please try to use vcapp()->path() instead
 */
define('VCV_PLUGIN_DIR_PATH', plugin_dir_path(__FILE__));
/**
 * Plugin "basename" - directoryName/PluginFileName.php: 'vc-five/plugin-wordpress.php'
 */
define('VCV_PLUGIN_BASE_NAME', plugin_basename(__FILE__));
/**
 * Plugin core file full path: '/server/web/wp-content/plugins/vc-five/plugin-wordpress.php'
 */
define('VCV_PLUGIN_FULL_PATH', __FILE__);
/**
 * Plugin directory name: 'vc-five'
 */
define('VCV_PLUGIN_DIRNAME', basename(dirname(VCV_PLUGIN_BASE_NAME)));
/**
 * Plugin core prefix for options/meta and etc.
 */
define('VCV_PREFIX', 'vcv-');
if (!defined('VCV_DEBUG')) {
    define('VCV_DEBUG', false);
}

// Used in requirements.php
/**
 * Minimal required PHP version.
 */
define('VCV_REQUIRED_PHP_VERSION', '5.4');
/**
 * Minimal required WordPress version.
 */
define('VCV_REQUIRED_BLOG_VERSION', '4.1');
if (!defined('VCV_AJAX_REQUEST')) {
    define('VCV_AJAX_REQUEST', 'vcv-ajax');
}
if (!defined('VCV_LAZY_LOAD')) {
    define('VCV_LAZY_LOAD', false);
}

define('VCV_ACCOUNT_URL', 'http://test.account.visualcomposer.io');

/**
 * Check PHP version.
 * Check WordPress version.
 * PHP 5.1 parse-able (no parse error).
 */
require_once __DIR__ . '/visualcomposer/Requirements.php';

// !! PHP 5.4 Required under this line (parse error otherwise).

// Bootstrap the system.
require __DIR__ . '/bootstrap/autoload.php';
