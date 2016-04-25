<?php

/**
 * Just a time constant can be used for performance metrics and other Randoms
 */
define('VCV_START', microtime(true));
/**
 * Register The Composer Auto Loader
 *
 * Composer provides a convenient, automatically generated class loader
 * for our application. We just need to utilize it! We'll require it
 * into the script here so that we do not have to worry about the
 * loading of any our classes "manually"
 *
 **/
require __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../visualcomposer/Framework/helpers.php';
require_once __DIR__ . '/app.php';
