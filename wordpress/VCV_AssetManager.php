<?php

require_once( 'VCV_Helpers.php' );

class VCV_AssetManager {

	/**
	 * Called every time post is permanently deleted
	 *
	 * Remove list of associated assets
	 *
	 * @param int $id Post ID
	 */
	public static function deletePostAssets( $id ) {
		foreach ( [ 'scripts', 'styles' ] as $asset_type ) {
			$option_name = 'vcv_' . $asset_type;
			$assets = (array) get_option( $option_name, [ ] );

			if ( ! isset( $assets[ $id ] ) ) {
				continue;
			}

			unset( $assets[ $id ] );

			update_option( $option_name, $assets );
		}
	}

	/**
	 * Generate (save to fs and update db) scripts bundle
	 *
	 * Old files are deleted
	 *
	 * @return bool|string URL to generated bundle
	 */
	public static function generateScriptsBundle() {
		$assets = (array) get_option( 'vcv_scripts', [ ] );

		$files = [ ];
		foreach ( $assets as $post_id => $elements ) {
			foreach ( $elements as $element => $element_assets ) {
				$files = array_merge( $files, $element_assets );
			}
		}
		$files = array_unique( $files );

		if ( $files ) {
			$upload_dir = wp_upload_dir();
			$destination_dir = $upload_dir['basedir'] . '/js_composer/asset-bundles';

			$concatenated_filename = md5( implode( ',', $files ) ) . '.js';
			$bundle = $destination_dir . '/' . $concatenated_filename;
			$bundle_url = $upload_dir['baseurl'] . '/js_composer/asset-bundles' . '/' . $concatenated_filename;

			if ( ! is_file( $bundle ) ) {
				$contents = '';
				foreach ( $files as $file ) {
					$filepath = plugin_dir_path( __FILE__ ) . '../public/sources/elements/' . $file;
					$contents .= file_get_contents( $filepath ) . "\n";
				}

				self::deleteAssetBundles( 'js' );
				if ( ! VCV_helpers::filePutContents( $bundle, $contents ) ) {
					return false;
				}
			}
		} else {
			self::deleteAssetBundles( 'js' );
			$bundle_url = '';
		}

		update_option( 'vcv_scripts_bundle', $bundle_url );

		return $bundle_url;
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
	public static function generateStylesBundle( $contents ) {
		if ( $contents ) {
			$upload_dir = wp_upload_dir();
			$destination_dir = $upload_dir['basedir'] . '/js_composer/asset-bundles';

			$concatenated_filename = md5( $contents ) . '.css';
			$bundle = $destination_dir . '/' . $concatenated_filename;
			$bundle_url = $upload_dir['baseurl'] . '/js_composer/asset-bundles' . '/' . $concatenated_filename;

			if ( ! is_file( $bundle ) ) {
				self::deleteAssetBundles( 'css' );
				if ( ! VCV_helpers::filePutContents( $bundle, $contents ) ) {
					return false;
				}
			}
		} else {
			self::deleteAssetBundles( 'css' );
			$bundle_url = '';
		}

		update_option( 'vcv_styles_bundle', $bundle_url );

		return $bundle_url;
	}

	/**
	 * @return array
	 */
	public static function getStyleBundles() {
		$assets = get_option( 'vcv_styles', [ ] );
		$bundles = [ ];

		$list = [ ];
		foreach ( $assets as $post_id => $elements ) {
			$list = array_merge( $list, (array) $elements );
		}

		foreach ( $list as $element => $files ) {
			$contents = '';
			foreach ( $files as $file ) {
				$filepath = plugin_dir_path( __FILE__ ) . '../public/sources/elements/' . $file;

				$contents .= file_get_contents( $filepath ) . "\n";
			}

			$bundles[] = [
				'filename' => $element . '.less',
				'contents' => $contents
			];
		}

		return $bundles;
	}

	/**
	 * @param int $post_id
	 * @param string $asset_type scripts|styles
	 * @param string[] $post_assets
	 */
	public static function updatePostAssets( $post_id, $asset_type, $post_assets ) {
		$option_name = 'vcv_' . $asset_type;
		$assets = get_option( $option_name, [ ] );

		if ( $post_assets ) {
			$assets[ $post_id ] = $post_assets;
		} else {
			unset( $assets[ $post_id ] );
		}

		update_option( $option_name, $assets );
	}

	/**
	 * Remove all files by extension in asset-bundles directory
	 *
	 * @param string $extension
	 */
	public static function deleteAssetBundles( $extension = '' ) {
		$upload_dir = wp_upload_dir();
		$destination_dir = $upload_dir['basedir'] . '/js_composer/asset-bundles';

		if ( $extension ) {
			$extension = '.' . $extension;
		}

		$files = glob( $destination_dir . '/*' . $extension );
		foreach ( $files as $file ) {
			unlink( $file );
		}
	}

}
