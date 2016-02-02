<?php
/*
Plugin Name: Visual Composer V
Plugin URI: http://vc.wpbakery.com
Description: Drag and drop page builder for WordPress. Take full control over your WordPress site, build any layout you can imagine – no programming knowledge required.
Version: 5.0.0
Author: Michael M - WPBakery.com
Author URI: http://wpbakery.com
*/

// don't load directly
if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}
/**
 * Current visual composer version
 */
if ( ! defined( 'VC_VERSION' ) ) {
	/**
	 * Newhoo
	 */
	define( 'VC_VERSION', '5.0.0' );
}

require( 'wordpress/action_callbacks.php' );

if ( is_admin() ) {
	require( 'wordpress/VCV_AssetManager.php' );

	add_action( 'before_delete_post', [ 'VCV_AssetManager', 'deletePostAssets' ] );

	// meta box
	// add_action( 'add_meta_boxes', 'vcv_add_meta_box', 10 );

	// Sent data
	add_action( 'wp_ajax_vcv/getPostData', 'vcv_get_post_data' );

	// Save post content and used assets
	add_action( 'wp_ajax_vcv/setPostData', 'vcv_set_post_data' );

	// Save compiled less into one css bundle
	add_action( 'wp_ajax_vcv/saveCssBundle', 'vcv_save_css_bundle' );
} else {

	add_action( 'wp_head', function () {
		echo '<script src="' . plugins_url( 'node_modules/less/dist/less.js', __FILE__ ) . '" data-async="true"></script>';
	} );

	add_action( 'wp_enqueue_scripts', function () {
		wp_enqueue_script( 'jquery' );
	} );


	$jsScriptRendered = false;
	$rowActionControl = function ( $link ) use ( &$jsScriptRendered ) {

		$link .= ' <a href="#" onclick="vcvLoadInline(this, ' . get_the_ID() . ');">' . __( 'Edit with VC 5', 'vc5' ) . '</a>';
		if ( ! $jsScriptRendered ) {
			$link .= vcv_output_admin_scripts();
			$jsScriptRendered = true;
		}

		return $link;
	};
	add_filter( 'edit_post_link', $rowActionControl );
	// add button for frontend editor near edit
}
