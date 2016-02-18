<?php
namespace App\Drivers\WordPress\Controllers;

use Illuminate\Contracts\Events\Dispatcher;

class AssetsControllerDriver {
	/** @var $app \Laravel\Lumen\Application */
	protected $app;

	/** @var $event \Illuminate\Events\Dispatcher */
	protected $event;

	public function __construct( Dispatcher $event ) {
		$this->app = app();
		$this->event = $event;

		add_action( 'before_delete_post', function ( $postId ) {
			$this->event->fire( 'driver:before_delete_post', [ $postId ] );
		} );

		// Save compiled less into one css bundle
		add_action( 'wp_ajax_vc:v:save_css_bundle', function () {
			$this->event->fire( 'driver:ajax:save_css_bundle' );
		} );

		$this->event->listen( 'vc:assets:set_post_data_hook:response', function ( $styleBundles ) {
			wp_send_json_success( [ 'styleBundles' => $styleBundles ] );
		} );

		$this->event->listen( 'vc:assets:save_css_bundle_hook:response', function ( $bundleUrl ) {
			if ( $bundleUrl === false ) {
				wp_send_json_error();
			}
			wp_send_json_success( [ 'filename' => $bundleUrl ] );
		} );

		$this->event->listen( 'vc:assets:generate_scripts_bundle:get_bundle_url', function ( $files ) {
			$uploadDir = wp_upload_dir();
			$concatenatedFilename = md5( implode( ',', $files ) ) . '.js';
			$bundleUrl = $uploadDir['baseurl'] . '/' . VC_V_PLUGIN_DIRNAME . '/asset-bundles' . '/' . $concatenatedFilename;

			return $bundleUrl;
		} );

		$this->event->listen( 'vc:assets:generate_scripts_bundle:get_bundle', function ( $files ) {
			$uploadDir = wp_upload_dir();
			$destinationDir = $uploadDir['basedir'] . '/' . VC_V_PLUGIN_DIRNAME . '/asset-bundles';

			$concatenatedFilename = md5( implode( ',', $files ) ) . '.js';
			$bundle = $destinationDir . '/' . $concatenatedFilename;

			return $bundle;
		} );

		$this->event->listen( 'vc:assets:generate_styles_bundle:get_bundle_url', function ( $contents ) {
			$uploadDir = wp_upload_dir();
			$concatenatedFilename = md5( $contents ) . '.css';
			$bundleUrl = $uploadDir['baseurl'] . '/' . VC_V_PLUGIN_DIRNAME . '/assets-bundles' . '/' . $concatenatedFilename;

			return $bundleUrl;
		} );

		$this->event->listen( 'vc:assets:generate_styles_bundle:get_bundle', function ( $contents ) {
			$uploadDir = wp_upload_dir();
			$destinationDir = $uploadDir['basedir'] . '/' . VC_V_PLUGIN_DIRNAME . '/assets-bundles';
			$concatenatedFilename = md5( $contents ) . '.css';
			$bundle = $destinationDir . '/' . $concatenatedFilename;

			return $bundle;
		} );

		$this->event->listen( 'vc:assets:delete_assets_bundles:get_destionation_dir', function () {
			$uploadDir = wp_upload_dir();
			$destinationDir = $uploadDir['basedir'] . '/' . VC_V_PLUGIN_DIRNAME . '/assets-bundles';

			return $destinationDir;
		} );

	}
}