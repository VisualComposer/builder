<?php
/**
 * Plugin Name: Visual Composer V
 * Plugin URI: http://vc.wpbakery.com
 * Description: Drag and drop page builder for WordPress. Take full control over your WordPress site,
 * build any layout you can imagine – no programming knowledge required.
 *
 * Version: 5.0.0
 * Author: WPBakery
 * Author URI: http://wpbakery.com
 * Requires at least: 4.1
 * Tested up to: 4.5
 */

/**
 * Check for direct call file
 */
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/**
 * Skip loading when installing
 *
 * @see wp_installing
 */
if (defined('WP_INSTALLING') && WP_INSTALLING) {
    return;
}

/**
 * Check for plugin conflict
 */
if (defined('VC_V_VERSION')) {
    wp_die('It seems that other version of Visual Composer is active. Please deactivate it before use this version');
}

// Plugin constants
define('VC_V_VERSION', '5.0');
define('VC_V_PLUGIN_URL', plugin_dir_url(__FILE__)); // http://web/wp-content/plugins/plugin_dir/
define('VC_V_PLUGIN_DIR_PATH', plugin_dir_path(__FILE__)); // /server/web/wp-content/plugins/plugin_dir/
define('VC_V_PLUGIN_BASE_NAME', plugin_basename(__FILE__)); // plugin_dir/plugin.php
define('VC_V_PLUGIN_FULL_PATH', __FILE__); // /server/web/wp-content/plugins/plugin_dir/plugin.php
define('VC_V_PLUGIN_DIRNAME', dirname(VC_V_PLUGIN_BASE_NAME)); // plugin_dir
define('VC_V_PREFIX', 'vc-v-');

// Used in requirements.php
define('VC_V_REQUIRED_PHP_VERSION', '5.4');
define('VC_V_REQUIRED_BLOG_VERSION', '4.1');

/**
 * Check PHP version
 * Check WordPress version
 * PHP 5.1 parse-able (no parse error)
 */
require_once __DIR__ . '/visualcomposer/Requirements.php';

// !! PHP 5.4 Required under this line (parse error otherwise)

// Bootstrap the system
require __DIR__ . '/bootstrap/autoload.php';
