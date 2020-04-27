<?php

$abspath = getenv('WP_TESTS_ABSPATH');
$pluginDir = dirname(dirname(dirname($_SERVER['SCRIPT_FILENAME'])));
$pluginBase = basename($pluginDir);
$wordpressDir = str_replace('wp-content/plugins/' . $pluginBase, '', $pluginDir);
var_dump(
    [
        'globals' => $GLOBALS,
        'server' => $_SERVER,
        'pluginDir' => $pluginDir,
        'pluginBase' => $pluginBase,
        'wordpressDir' => $wordpressDir,
        '$abspath' => $abspath,
        'file_exists' => file_exists(trim($wordpressDir, '\\/') . '/wp-config.php'),
    ]
);
if (empty($abspath)) {
    if (file_exists(trim($wordpressDir, '\\/') . '/wp-config.php')) {
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
    $files = glob(__DIR__ . '/actions/{,*/,*/*/,*/*/*/}*.php', GLOB_BRACE);
    if (is_array($files) && !empty($files)) {
        foreach ($files as $file) {
            require_once $file;
        }
    }

    // Add shortcodes on early init
    add_action(
        'init',
        function () {
            require_once 'shortcodes.php';
        },
        0
    );
    // Now load the WordPress
    require_once rtrim($abspath, '\\/') . '/wp-config.php';
} else {
    echo 'Please provide correct args';
    die;
}
