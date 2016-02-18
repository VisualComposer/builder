<?php

namespace App\Drivers\WordPress;

/** @var $app \Laravel\Lumen\Application */
$app->singleton( 'CoreControllerDriver', '\App\Drivers\WordPress\Controllers\CoreControllerDriver' );
$app->make( 'CoreControllerDriver' );

$app->singleton( 'PostAjaxControllerDriver', '\App\Drivers\WordPress\Controllers\PostAjaxControllerDriver' );
$app->make( 'PostAjaxControllerDriver' );

$app->singleton( 'AssetsControllerDriver', '\App\Drivers\WordPress\Controllers\AssetsControllerDriver' );
$app->make( 'PostAjaxControllerDriver' );

$app->singleton( 'PageFrontControllerDriver', '\App\Drivers\WordPress\Controllers\PageFrontControllerDriver' );
$app->make( 'PageFrontControllerDriver' );

// Connectors
$app->singleton( 'Options', '\App\Drivers\WordPress\Connectors\Options' );
$app->make( 'Options' );

$app->singleton( 'File', '\App\Drivers\WordPress\Connectors\File' );
$app->make( 'File' );

// Locale
$app->singleton( 'Locale', '\App\Drivers\WordPress\Locale\Locale' );
$app->make( 'Locale' );

// Application Initialization
$app->singleton( 'CoreController', '\App\Controllers\CoreController' );
$app->make( 'CoreController' );

$app->singleton( 'PostAjaxController', '\App\Controllers\PostAjaxController' );
$app->make( 'PostAjaxController' );

$app->singleton( 'AssetsController', '\App\Controllers\AssetsController' );
$app->make( 'AssetsController' );

$app->singleton( 'PageFrontController', '\App\Controllers\PageFrontController' );
$app->make( 'PageFrontController' );

