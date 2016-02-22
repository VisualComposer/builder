<?php
/**
 * Start the application
 */
$app = new Laravel\Lumen\Application( realpath( __DIR__ . '/../' ) );
if ( ! env( 'APP_DEBUG' ) ) {
	error_reporting(0);
	restore_error_handler();
	restore_exception_handler();
}
return $app;