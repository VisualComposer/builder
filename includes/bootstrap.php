<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
/**
 * Composer Class loader
 */
$loader = require_once "composer/loader.php";
/** @var $loader \VcV\Composer\LoaderHelper */
$loader->setPsr4( 'VcV\\', VC_V_PLUGIN_DIR_PATH . 'includes' );

/**
 * File must contain action registration for system/core events that should be hooked by any other library
 */
add_action( 'vc:v:plugin:load', [ 'VcV\\Core\\Core', 'getInstance' ] );
add_action( 'vc:v:core:admin_init', [ 'VcV\\Admin\\Admin', 'getInstance' ] );
add_action( 'vc:v:core:admin_init', [ 'VcV\\AssetsManager\\AssetsManager', 'getInstance' ] );
add_action( 'vc:v:core:init', [ 'VcV\\Front\\Front', 'getInstance' ] );

// DO NOT MODIFY
/**
 * Action for components that have immediate impact on system
 * Should not be used in common
 * It is recommend to find more compatible action for components (inner components API)
 * Mostly used in core components like Core/Updater/etc..
 * @core
 */
do_action( 'vc:v:plugin:load' );
