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
if (!defined('ABSPATH')) {
    die('-1');
}
/**
 * Current visual composer version
 */
if (!defined('VC_VERSION')) {
    /**
     * Newhoo
     */
    define('VC_VERSION', '5.0.0');
}
if (is_admin()) {
    // meta box
    1 === 2 && add_action('add_meta_boxes', function () {
        add_meta_box('vc_v', __('Visual Composer V', 'js_composer'), function () {
            $post = get_post();
            echo '<div id="vc_v-editor"></div>'
                . '<input type="hidden" id="vc-v-data" name="vc_v_data" value="' . json_encode(get_post_meta($post->ID, 'vc_v-post-data', true)) . '">'
                . '<script src="'
                . (preg_replace('/\s/', '%20', plugins_url('public/wp.bundle.js', __FILE__)))
                . '"></script>';
        }, 'page', 'normal', 'high');
    }, 10);
    // Sent data
    add_action('wp_ajax_vcv/getPostData', function () {
        $data = '';
        $id = isset($_POST['post_id']) ? $_POST['post_id'] : false;
        if ($id) {
            $data = get_post_meta($id, 'vc_page_content', true);
        }
        echo $data;
        die();
    });
    add_action('wp_ajax_vcv/setPostData', function () {
	    $data = isset( $_POST['data'] ) ? $_POST['data'] : false;
	    $content = isset( $_POST['content'] ) ? $_POST['content'] : false;
	    $id = isset( $_POST['post_id'] ) ? (int) $_POST['post_id'] : false;
	    if ( $id ) {
		    // TODO: save elements on page
		    $post = get_post( $id );
		    $post->post_content = stripslashes( $content );
		    wp_update_post( $post );
		    update_post_meta( $id, 'vc_page_content', $data );

		    foreach ( [ 'scripts', 'styles' ] as $asset_type ) {
			    $option_name = 'vc_' . $asset_type;
			    $assets = (array) get_option( $option_name, [ ] );

			    $page_assets = isset( $_POST[ $asset_type ] ) ? $_POST[ $asset_type ] : false;

			    if ( $page_assets ) {
				    $assets[ $id ] = $page_assets;
			    } else {
				    unset( $assets[ $id ] );
			    }

			    update_option( $option_name, $assets );
		    }
	    }
	    die();
    });
} else {
    add_action('wp_enqueue_scripts', function () {
        wp_enqueue_script('jquery');
    });
    $jsScriptRendered = false;
    $rowActionControl = function ($link) use (&$jsScriptRendered) {

        $link .= '<a href="#" onClick="vcvLoadInline(this, ' . get_the_ID() . ');">' . __('Edit with VC 5', 'vc5') . '</a>';
        if (!$jsScriptRendered) {

	          // get list of all element assets from all posts
		        $final_element_assets = [ 'scripts' => [ ], 'styles' => [ ] ];
		        foreach ( $final_element_assets as $asset_type => $list ) {
			        $loaded = [ ];
			        $option_name = 'vc_' . $asset_type;
			        $assets = (array) get_option( $option_name, [ ] );
			        foreach ( $assets as $post_id => $elements ) {
				        foreach ( $elements as $element => $element_assets ) {
					        if ( in_array( $element, $loaded ) ) {
						        continue;
					        }
					        $list = array_merge( $list, $element_assets );
					        $loaded[] = $element;
				        }
			        }
			        $final_element_assets[ $asset_type ] = $list;
		        }

            ob_start();
            ?>
            <script>
                function vcvLoadJsCssFile(filename, filetype) {
                    var fileRef;
                    if ('js' === filetype) {
                        fileRef = document.createElement('script');
                        fileRef.setAttribute("type", "text/javascript");
                        fileRef.setAttribute("src", filename);
                    } else if ('css' === filetype) {
                        fileRef = document.createElement("link");
                        fileRef.setAttribute("rel", "stylesheet");
                        fileRef.setAttribute("type", "text/css");
                        fileRef.setAttribute("href", filename);
                    }
                    if ('undefined' !== typeof fileRef) {
                        document.getElementsByTagName("head")[0].appendChild(fileRef);
                    }
                }
                function vcvLoadInline(element, id) {
                    window.vcPostID = id;
                    window.vcAjaxUrl = '<?php echo admin_url( 'admin-ajax.php', 'relative' ) ?>';
                    element.remove();
                    // Load css
                    vcvLoadJsCssFile('<?php echo preg_replace( '/\s/', '%20', plugins_url( 'public/dist/wp.bundle.css?' . time(), __FILE__ ) ) ?>', 'css');
                    // Load js
                    vcvLoadJsCssFile('<?php echo preg_replace( '/\s/', '%20', plugins_url( 'public/dist/wp.bundle.js?' . time(), __FILE__ ) ) ?>', 'js');

		                <?php foreach ($final_element_assets['scripts'] as $file): ?>
		                  vcvLoadJsCssFile( '<?php echo preg_replace( '/\s/', '%20', plugins_url( 'public/sources/elements/' . $file, __FILE__ ) ) ?>', 'js' );
		                <?php endforeach ?>
		                <?php foreach ($final_element_assets['styles'] as $file): ?>
		                  vcvLoadJsCssFile( '<?php echo preg_replace( '/\s/', '%20', plugins_url( 'public/sources/elements/' . $file, __FILE__ ) ) ?>', 'css' );
		                <?php endforeach ?>
                }
                ;
            </script>
            <?php
            $jsScriptRendered = true;
            $link .= ob_get_flush();
        }
        return $link;
    };
    add_filter('edit_post_link', $rowActionControl);
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
		$option_name = 'vc_' . $asset_type;
		$assets = (array) get_option( $option_name, [ ] );

		if ( ! isset( $assets[ $id ] ) ) {
			continue;
		}

		unset( $assets[ $id ] );

		update_option( $option_name, $assets );
	}
}
