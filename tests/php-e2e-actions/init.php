<?php

$abspath = getenv('WP_TESTS_ABSPATH');
$pluginDir = dirname(dirname(dirname($_SERVER['SCRIPT_FILENAME'])));
$pluginBase = basename($pluginDir);
$wordpressDir = str_replace('wp-content/plugins/' . $pluginBase, '', $pluginDir);

if (empty($abspath)) {
    if (file_exists(rtrim($wordpressDir, '\\/') . '/wp-config.php')) {
        $abspath = $wordpressDir;
    } else {
        die('Unable to run php-e2e because ENV: WP_TESTS_ABSPATH empty');
    }
}
if (isset($_GET['php-e2e'])) {
    define('VCV_E2E', true);
    require_once rtrim($abspath, '\\/') . '/wp-includes/plugin.php';
    require_once 'helpers.php';
    // ACTIONS goes here:
    $files = glob(__DIR__ . '/actions/*.php');

    if (is_array($files) && !empty($files)) {
        foreach ($files as $file) {
            require_once $file;
        }
    }
    $devElementsActions = glob(
        $pluginDir . '/devElements/tests/php-e2e-actions/actions/*.php'
    );
    if (is_array($devElementsActions) && !empty($devElementsActions)) {
        foreach ($devElementsActions as $file) {
            require_once $file;
        }
    }
    $devAddonsActions = glob(
        $pluginDir . '/devAddons/tests/php-e2e-actions/actions/*.php'
    );

    if (is_array($devAddonsActions) && !empty($devAddonsActions)) {
        foreach ($devAddonsActions as $file) {
            require_once $file;
        }
    }

    // Add shortcodes on early init
    add_action(
        'init',
        function () {
            require_once 'shortcodes.php';
            do_action('vcv:e2e:php:actions:init'); // allow 3rd party tests like elements
        },
        0
    );
    // Now load the WordPress
    require_once rtrim($abspath, '\\/') . '/wp-config.php';
} else {
    echo 'Please provide correct args';
    die;
}
