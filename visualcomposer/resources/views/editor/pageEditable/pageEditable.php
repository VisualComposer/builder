<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

// Include TinyMCE scripts in pageEditable
ob_start();
wp_editor(
    '%%content%%',
    '__VCVID__',
    $settings = [
        'media_buttons' => true,
        'tinymce' => [
            'wordpress_adv_hidden' => false,
        ],
    ]
);
ob_get_clean();
?>
<div id="vcv-editor"><?php echo esc_html__('Loading...', 'vcwb'); ?></div>