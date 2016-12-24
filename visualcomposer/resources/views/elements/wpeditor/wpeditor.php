<?php
// require_once( ABSPATH . '/wp-admin/admin.php' );
global $title, $hook_suffix, $current_screen, $wp_locale, $pagenow, $wp_version,
       $update_title, $total_update_count, $parent_file;
do_action( 'admin_enqueue_scripts', $hook_suffix );
do_action( "admin_print_styles-{$hook_suffix}" );
do_action( 'admin_print_styles' );
do_action( "admin_print_scripts-{$hook_suffix}" );
do_action( 'admin_print_scripts' );
do_action( "admin_head-$hook_suffix" );
do_action( 'admin_head' );
?>
<script type="text/html" id="vcv-wpeditor-template"><?php
    wp_editor(
        '%%content%%',
        '__VCVID__',
        $settings = [
            'media_buttons' => true,
            'wpautop' => false,
        ]
    );
 ?></script>
<?php
do_action( 'admin_footer', '' );
do_action( "admin_print_footer_scripts-{$hook_suffix}" );
do_action( 'admin_print_footer_scripts' );
do_action( "admin_footer-{$hook_suffix}" );
