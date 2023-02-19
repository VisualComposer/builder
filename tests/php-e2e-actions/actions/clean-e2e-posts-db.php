<?php

if (!defined('VCV_E2E')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

if (isset($_GET['php-e2e-skip-clean'])) {
    // Allow to skip cleanup
    // In case if we need multiple pages
    return;
}

// This is executed before any php-e2e tests called, to keep database clean
add_action(
    'init',
    function () {
        if (function_exists('e2e_clean_posts')) {
            // Clean previously created posts
            e2e_clean_posts();
        }
        if (function_exists('e2e_clean_posts')) {
            // Clean previously created posts
            e2e_clean_terms();
        }
    },
    1
);

// This should be run after all php-e2e tests are done
if (isset($_GET['php-e2e-action']) && $_GET['php-e2e-action'] === 'clean-e2e-posts-db') {
    add_action(
        'init',
        function () {
            e2e_clean_posts();
            die('Done');
        },
        100
    );
}

if (isset($_GET['php-e2e-action']) && $_GET['php-e2e-action'] === 'clean-e2e-terms-db') {
    add_action(
        'init',
        function () {
            e2e_clean_terms();
            die('Done');
        },
        100
    );
}

if (isset($_GET['php-e2e-action']) && $_GET['php-e2e-action'] === 'clean-e2e-images') {
    add_action(
        'init',
        function () {
            e2e_clean_images();
            die('Done');
        },
        100
    );
}

