<?php

$abspath = getenv('WP_TESTS_ABSPATH');
if (empty($abspath)) {
    die('Unable to run php-e2e because ENV: WP_TESTS_ABSPATH empty');
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

    // Ad shortcodes on early init
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
