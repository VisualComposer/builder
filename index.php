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
        echo $data = '';
        $id = isset($_POST['id']) ? $_POST['id'] : false;
        if ($id) {
            $data = get_post_meta($id, 'vc_page_content', true);
        }
        echo $data;
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
            ob_start();
            ?>
            <script>
                function vcvLoadInline(element, id) {
                    window.vcPostID = id;
                    window.vcAjaxUrl = '<?php echo admin_url( 'admin-ajax.php', 'relative' ) ?>';
                    window.vcPostUrl = '<?php echo admin_url( 'post.php', 'relative' ) ?>';
                    element.remove();
                    var g = document.createElement('script'),
                        s = document.getElementsByTagName('script')[0]; // find the first script tag in the document
                    g.src = '<?php echo preg_replace( '/\s/', '%20', plugins_url( 'public/wp.bundle.js?' . time(), __FILE__ ) ) ?>';
                    s.parentNode.insertBefore(g, s);
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