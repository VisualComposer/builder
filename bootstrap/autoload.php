<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/**
 * Register The Composer Auto Loader.
 *
 * Composer provides a convenient, automatically generated class loader
 * for our application. We just need to utilize it! We'll require it
 * into the script here so that we do not have to worry about the
 * loading of any our classes "manually".
 *
 **/
$dir = dirname(__FILE__);
require_once $dir . '/../vendor/autoload.php';
require_once $dir . '/../visualcomposer/Framework/helpers.php';

if (VCV_LAZY_LOAD) {
    add_action('vcv:bootstrap:lazyload', 'vcvboot');
} else {
    vcvboot();
}

/**
 * Add action for init state.
 */
add_action('init', 'vcvinit', 21); // 20 used in tablepress
add_action('admin_init', 'vcvadmininit', 21);
