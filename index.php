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

if ( is_admin() ) {
	// meta box
	1 === 2 && add_action( 'add_meta_boxes', function () {
		add_meta_box( 'vc_v', __( 'Visual Composer V', 'js_composer' ), function () {
			$post = get_post();
			echo '<div id="vc_v-editor"></div>'
			     . '<input type="hidden" id="vc-v-data" name="vc_v_data" value="' . json_encode( get_post_meta( $post->ID, 'vc_v-post-data', true ) ) . '">'
			     . '<script src="'
			     . ( preg_replace( '/\s/', '%20', plugins_url( 'public/wp.bundle.js', __FILE__ ) ) )
			     . '"></script>';
		}, 'page', 'normal', 'high' );
	}, 10 );

	// Sent data
	add_action( 'wp_ajax_vcv/getPostData', function () {
		$data = '';
		$id = isset( $_POST['post_id'] ) ? $_POST['post_id'] : false;
		if ( $id ) {
			$data = get_post_meta( $id, 'vc_page_content', true );
		}
		echo $data;
		die();
	} );

	// Save post content and used assets
	add_action( 'wp_ajax_vcv/setPostData', function () {
		$data = isset( $_POST['data'] ) ? $_POST['data'] : false;
		$content = isset( $_POST['content'] ) ? $_POST['content'] : false;
		$id = isset( $_POST['post_id'] ) ? (int) $_POST['post_id'] : false;
		if ( $id ) {
			// TODO: save elements on page
			$post = get_post( $id );
			$post->post_content = stripslashes( $content );
			wp_update_post( $post );
			update_post_meta( $id, 'vc_page_content', $data );

			vcv_update_post_assets( $id, 'scripts', isset( $_POST['scripts'] ) ? $_POST['scripts'] : [ ] );
			vcv_update_post_assets( $id, 'styles', isset( $_POST['styles'] ) ? $_POST['styles'] : [ ] );

			vcv_generate_scripts_bundle();

			$style_bundles = vcv_get_style_bundles();
			wp_send_json_success( [ 'styleBundles' => $style_bundles ] );
		}
		wp_send_json_success();
	} );

	// Save compiled less into one css bundle
	add_action( 'wp_ajax_vcv/saveCssBundle', function () {
		$contents = isset( $_POST['contents'] ) ? $_POST['contents'] : null;

		$bundle_url = vcv_generate_styles_bundle( $contents );

		if ( $bundle_url === false ) {
			wp_send_json_error();
		}

		wp_send_json_success( [ 'filename' => $bundle_url ] );
	} );
} else {

	add_action( 'wp_enqueue_scripts', function () {
		wp_enqueue_script( 'jquery' );
	} );

	$jsScriptRendered = false;
	$rowActionControl = function ( $link ) use ( &$jsScriptRendered ) {

		$link .= '<a href="#" onClick="vcvLoadInline(this, ' . get_the_ID() . ');">' . __( 'Edit with VC 5', 'vc5' ) . '</a>';
		if ( ! $jsScriptRendered ) {
			$scripts_bundle = get_option( 'vcv_scripts_bundle' );
			$styles_bundle = get_option( 'vcv_styles_bundle' );

			ob_start();
			?>
			<script>

				function vcvLoadJsCssFile( filename, filetype ) {
					var fileRef;

					filename = filename.replace( /\s/g, '%20' );

					if ( 'js' === filetype ) {
						fileRef = document.createElement( 'script' );
						fileRef.setAttribute( 'type', 'text/javascript' );
						fileRef.setAttribute( 'src', filename );
					} else if ( 'css' === filetype ) {
						fileRef = document.createElement( 'link' );
						if ( filename.substr( - 5, 5 ) === '.less' ) {
							fileRef.setAttribute( 'rel', 'stylesheet/less' );
						} else {
							fileRef.setAttribute( 'rel', 'stylesheet' );
						}

						fileRef.setAttribute( 'type', 'text/css' );
						fileRef.setAttribute( 'href', filename );
					}
					if ( 'undefined' !== typeof fileRef ) {
						document.getElementsByTagName( 'head' )[ 0 ].appendChild( fileRef );
					}
				}

				function vcvLoadInline( element, id ) {
					window.vcPostID = id;
					window.vcAjaxUrl = '<?php echo admin_url( 'admin-ajax.php', 'relative' ) ?>';
					element.remove();

					vcvLoadJsCssFile( '<?php echo plugins_url( 'public/dist/wp.bundle.css?' . time(), __FILE__ )  ?>', 'css' );
					vcvLoadJsCssFile( '<?php echo plugins_url( 'public/dist/wp.bundle.js?' . time(), __FILE__ )  ?>', 'js' );
				}

				vcvLoadJsCssFile( 'https://cdnjs.cloudflare.com/ajax/libs/less.js/2.5.3/less.min.js', 'js' );

				<?php if ($scripts_bundle): ?>
				vcvLoadJsCssFile( '<?php echo $scripts_bundle  ?>', 'js' );
				<?php endif ?>
				<?php if ($styles_bundle): ?>
				vcvLoadJsCssFile( '<?php echo $styles_bundle  ?>', 'css' );
				<?php endif ?>

			</script>
			<?php
			$jsScriptRendered = true;
			$link .= ob_get_flush();
		}

		return $link;
	};
	add_filter( 'edit_post_link', $rowActionControl );
	// add button for frontend editor near edit
}

add_action( 'before_delete_post', 'vcv_before_delete_post' );
/**
 * Called every time post is permanently deleted
 *
 * Remove list of associated assets
 *
 * @param int $id Post ID
 */
function vcv_before_delete_post( $id ) {
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
function vcv_generate_scripts_bundle() {
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
				$filepath = plugin_dir_path( __FILE__ ) . 'public/sources/elements/' . $file;
				$contents .= file_get_contents( $filepath ) . "\n";
			}

			vcv_delete_asset_bundles( 'js' );
			if ( ! vcv_file_force_put_contents( $bundle, $contents ) ) {
				return false;
			}
		}
	} else {
		vcv_delete_asset_bundles( 'js' );
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
function vcv_generate_styles_bundle( $contents ) {
	if ( $contents ) {
		$upload_dir = wp_upload_dir();
		$destination_dir = $upload_dir['basedir'] . '/js_composer/asset-bundles';

		$concatenated_filename = md5( $contents ) . '.css';
		$bundle = $destination_dir . '/' . $concatenated_filename;
		$bundle_url = $upload_dir['baseurl'] . '/js_composer/asset-bundles' . '/' . $concatenated_filename;

		if ( ! is_file( $bundle ) ) {
			vcv_delete_asset_bundles( 'css' );
			if ( ! vcv_file_force_put_contents( $bundle, $contents ) ) {
				return false;
			}
		}
	} else {
		vcv_delete_asset_bundles( 'css' );
		$bundle_url = '';
	}

	update_option( 'vcv_styles_bundle', $bundle_url );

	return $bundle_url;
}

/**
 * @return array
 */
function vcv_get_style_bundles() {
	$assets = get_option( 'vcv_styles', [ ] );
	$bundles = [ ];

	$list = [ ];
	foreach ( $assets as $post_id => $elements ) {
		$list = array_merge( $list, (array) $elements );
	}

	foreach ( $list as $element => $files ) {
		$contents = '';
		foreach ( $files as $file ) {
			$filepath = plugin_dir_path( __FILE__ ) . 'public/sources/elements/' . $file;

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
function vcv_update_post_assets( $post_id, $asset_type, $post_assets ) {
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
 * Same as built-in file_put_contents(), but creates directory if it doesn't exist
 *
 *
 * @link http://php.net/manual/en/function.file-put-contents.php
 *
 * @param string $filename
 * @param mixed $data
 * @param int $flags
 * @param resource $context
 *
 * @return int|bool
 */
function vcv_file_force_put_contents( $filename, $data, $flags = 0, $context = null ) {
	$chunks = explode( '/', $filename );
	$file = array_pop( $chunks );
	$dir = '';
	foreach ( $chunks as $part ) {
		if ( ! is_dir( $dir .= '/' . $part ) ) {
			mkdir( $dir );
		}
	}

	return file_put_contents( $dir . '/' . $file, $data, $flags, $context );
}

/**
 * Remove all files by extension in asset-bundles directory
 *
 * @param string $extension
 */
function vcv_delete_asset_bundles( $extension = '' ) {
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