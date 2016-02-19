<?php
if ( ! defined( 'VC_V_DRIVER' ) ) {
	exit;
}
define( 'VC_V_START', microtime( true ) );
/*
|--------------------------------------------------------------------------
| Register The Composer Auto Loader
|--------------------------------------------------------------------------
|
| Composer provides a convenient, automatically generated class loader
| for our application. We just need to utilize it! We'll require it
| into the script here so that we do not have to worry about the
| loading of any our classes "manually". Feels great to relax.
|
*/
require __DIR__ . '/../vendor/autoload.php';
/**
 * Load .env file for APP_DEBUG and other keys
 */
Dotenv::load( __DIR__ . '/../' );

/** @var \Laravel\Lumen\Application $app */
$app = require_once __DIR__ . '/app.php';

/**
 * Initialize used system Driver
 */
require __DIR__ . '/../app/Drivers/' . VC_V_DRIVER . '/driver.php';

