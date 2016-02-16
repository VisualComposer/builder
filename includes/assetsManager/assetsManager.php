<?php

namespace VcV\AssetsManager;

use VcV\Api\Helpers\Helpers;
use VcV\Api\Helpers\Request;
use VcV\Traits\Singleton;

class AssetsManager {

	use Singleton;

	private function initialize() {
		add_action( 'before_delete_post', [
			$this,
			'deletePostAssetsHook',
		] );

		// Save compiled less into one css bundle
		add_action( 'wp_ajax_vc:v:save_css_bundle', [
			$this,
			'saveCssBundleHook',
		] );

		add_action( 'vc:v:admin:set_post_data', [
			$this,
			'setPostDataHook',
		], 10, 2 );
	}

	public function setPostDataHook( $data, $id ) {
		$this->updatePostAssets( $id, 'scripts', Request::post( 'scripts' ) ? Request::post( 'scripts' ) : [ ] );
		$this->updatePostAssets( $id, 'styles', Request::post( 'styles' ) ? Request::post( 'styles' ) : [ ] );
		$this->generateScriptsBundle();
		$styleBundles = $this->getStyleBundles();
		wp_send_json_success( [ 'styleBundles' => $styleBundles ] );
	}

	/**
	 * Called every time post is permanently deleted
	 *
	 * Remove list of associated assets
	 *
	 * @param int $id Post ID
	 */
	public function deletePostAssetsHook( $id ) {
		foreach ( [ 'scripts', 'styles' ] as $assetType ) {
			$optionName = 'vc_v_' . $assetType;
			$assets = (array) get_option( $optionName, [ ] );

			if ( ! isset( $assets[ $id ] ) ) {
				continue;
			}

			unset( $assets[ $id ] );

			update_option( $optionName, $assets );
		}
	}

	/**
	 * Save compiled less into one css bundle
	 */
	public function saveCssBundleHook() {
		$contents = Request::post( 'contents' );

		$bundleUrl = $this->generateStylesBundle( $contents );
		if ( $bundleUrl === false ) {
			wp_send_json_error();
		}

		wp_send_json_success( [ 'filename' => $bundleUrl ] );
	}

	/**
	 * Generate (save to fs and update db) scripts bundle
	 *
	 * Old files are deleted
	 *
	 * @return bool|string URL to generated bundle
	 */
	private function generateScriptsBundle() {
		$assets = (array) get_option( 'vc_v_scripts', [ ] );

		$files = [ ];
		foreach ( $assets as $post_id => $elements ) {
			foreach ( $elements as $element => $elementAssets ) {
				$files = array_merge( $files, $elementAssets );
			}
		}
		$files = array_unique( $files );

		if ( $files ) {
			$uploadDir = wp_upload_dir();
			$destinationDir = $uploadDir['basedir'] . '/' . VC_V_PLUGIN_DIRNAME . '/asset-bundles';

			$concatenatedFilename = md5( implode( ',', $files ) ) . '.js';
			$bundle = $destinationDir . '/' . $concatenatedFilename;
			$bundleUrl = $uploadDir['baseurl'] . '/' . VC_V_PLUGIN_DIRNAME . '/asset-bundles' . '/' . $concatenatedFilename;

			if ( ! is_file( $bundle ) ) {
				$contents = '';
				foreach ( $files as $file ) {
					$filepath = VC_V_PLUGIN_DIR_PATH . 'public/sources/elements/' . $file;
					$contents .= file_get_contents( $filepath ) . "\n";
				}

				$this->deleteAssetsBundles( 'js' );
				if ( ! Helpers::filePutContents( $bundle, $contents ) ) {
					return false;
				}
			}
		} else {
			$this->deleteAssetsBundles( 'js' );
			$bundleUrl = '';
		}

		update_option( 'vc_v_scripts_bundle', $bundleUrl );

		return $bundleUrl;
	}

	/**
	 * Generate (save to fs and update db) scripts bundle
	 *
	 * Old files are deleted
	 *
	 * @param string $contents CSS contents to save
	 *
	 * @return bool|string URL to generated bundle
	 */
	private function generateStylesBundle( $contents ) {
		if ( $contents ) {
			$uploadDir = wp_upload_dir();
			$destinationDir = $uploadDir['basedir'] . '/' . VC_V_PLUGIN_DIRNAME . '/assets-bundles';

			$concatenatedFilename = md5( $contents ) . '.css';
			$bundle = $destinationDir . '/' . $concatenatedFilename;
			$bundleUrl = $uploadDir['baseurl'] . '/' . VC_V_PLUGIN_DIRNAME . '/assets-bundles' . '/' . $concatenatedFilename;

			if ( ! is_file( $bundle ) ) {
				$this->deleteAssetsBundles( 'css' );
				if ( ! Helpers::filePutContents( $bundle, $contents ) ) {
					return false;
				}
			}
		} else {
			$this->deleteAssetsBundles( 'css' );
			$bundleUrl = '';
		}

		update_option( 'vc_v_styles_bundle', $bundleUrl );

		return $bundleUrl;
	}

	/**
	 * @return array
	 */
	private function getStyleBundles() {
		$assets = (array) get_option( 'vc_v_styles', [ ] );
		$bundles = [ ];

		$list = [ ];
		foreach ( $assets as $postId => $elements ) {
			$list = array_merge( $list, (array) $elements );
		}

		foreach ( $list as $element => $files ) {
			$contents = '';
			foreach ( $files as $file ) {
				$filepath = VC_V_PLUGIN_DIR_PATH . 'public/sources/elements/' . $file;

				$contents .= file_get_contents( $filepath ) . "\n";
			}

			$bundles[] = [
				'filename' => $element . '.less',
				'contents' => $contents,
			];
		}

		return $bundles;
	}

	/**
	 * @param int $postId
	 * @param string $assetType scripts|styles
	 * @param string[] $postAssets
	 */
	private function updatePostAssets( $postId, $assetType, $postAssets ) {
		$optionName = 'vc_v_' . $assetType;
		$assets = (array) get_option( $optionName, [ ] );

		if ( $postAssets ) {
			$assets[ $postId ] = $postAssets;
		} else {
			unset( $assets[ $postId ] );
		}

		update_option( $optionName, $assets );
	}

	/**
	 * Remove all files by extension in asset-bundles directory
	 *
	 * @param string $extension
	 */
	private function deleteAssetsBundles( $extension = '' ) {
		$upload_dir = wp_upload_dir();
		$destination_dir = $upload_dir['basedir'] . '/' . VC_V_PLUGIN_DIRNAME . '/assets-bundles';

		if ( $extension ) {
			$extension = '.' . $extension;
		}

		$files = glob( $destination_dir . '/*' . $extension );
		foreach ( $files as $file ) {
			unlink( $file );
		}
	}

}
