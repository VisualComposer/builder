<?php

function vcv_add_meta_box() {
	add_meta_box( 'vc_v', __( 'Visual Composer V', 'js_composer' ), function () {
		$post = get_post();
		echo '<div id="vc_v-editor"></div>'
		     . '<input type="hidden" id="vc-v-data" name="vc_v_data" value="' . json_encode( get_post_meta( $post->ID, 'vc_v-post-data', true ) ) . '">'
		     . '<script src="'
		     . ( preg_replace( '/\s/', '%20', plugins_url( '../public/wp.bundle.js', __FILE__ ) ) )
		     . '"></script>';
	}, 'page', 'normal', 'high' );
}

/**
 * Get post content
 */
function vcv_get_post_data() {
	$data = '';
	$id = isset( $_POST['post_id'] ) ? $_POST['post_id'] : false;
	if ( $id ) {
		$data = get_post_meta( $id, 'vc_page_content', true );
	}
	echo $data;
	die();
}

/**
 * Save post content and used assets
 */
function vcv_set_post_data() {
	$data = isset( $_POST['data'] ) ? $_POST['data'] : false;
	$content = isset( $_POST['content'] ) ? $_POST['content'] : false;
	$id = isset( $_POST['post_id'] ) ? (int) $_POST['post_id'] : false;
	if ( $id ) {
		// TODO: save elements on page
		$post = get_post( $id );
		$post->post_content = stripslashes( $content );
		wp_update_post( $post );
		update_post_meta( $id, 'vc_page_content', $data );

		VCV_AssetManager::updatePostAssets( $id, 'scripts', isset( $_POST['scripts'] ) ? $_POST['scripts'] : [ ] );
		VCV_AssetManager::updatePostAssets( $id, 'styles', isset( $_POST['styles'] ) ? $_POST['styles'] : [ ] );
		VCV_AssetManager::generateScriptsBundle();
		$style_bundles = VCV_AssetManager::getStyleBundles();
		wp_send_json_success( [ 'styleBundles' => $style_bundles ] );
	}
	wp_send_json_success();
}

/**
 * Save compiled less into one css bundle
 */
function vcv_save_css_bundle() {
	$contents = isset( $_POST['contents'] ) ? $_POST['contents'] : null;

	$bundle_url = VCV_AssetManager::generateStylesBundle( $contents );
	if ( $bundle_url === false ) {
		wp_send_json_error();
	}

	wp_send_json_success( [ 'filename' => $bundle_url ] );
}

function vcv_output_admin_scripts() {
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

			vcvLoadJsCssFile( '<?php echo plugins_url( '../public/dist/wp.bundle.css?' . time(), __FILE__ )  ?>', 'css' );
			vcvLoadJsCssFile( '<?php echo plugins_url( '../public/dist/wp.bundle.js?' . time(), __FILE__ )  ?>', 'js' );
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
	return ob_get_clean();
}