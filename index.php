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
	 *
	 */
	define( 'VC_VERSION', '5.0.0' );
}

if ( is_admin() ) {
	// meta box
	add_action( 'add_meta_boxes', function () {
		add_meta_box( 'vc_v', __( 'Visual Composer V', 'js_composer' ), function () {
			$post = get_post();
			echo '<div id="vc_v-editor"></div>'
				.'<script> var vcVPostData = '.json_encode( get_post_meta($post->ID, 'vc_v-post-data', true) ) .';</script>'
				.'<script src="'
			. ( preg_replace( '/\s/', '%20', plugins_url( 'public/bundle.js', __FILE__ ) ) )
			. '"></script>';
		}, 'page', 'normal', 'high' );
	}, 10 );
	// 1. add menu for settings
	// 2. add control in page list
	// 3. load page
} else {
	// add button for frontend editor near edit
}
add_action( 'wp_ajax_vc_v/load_frontend_editor', function () {
	// Here we return require JS
} );
