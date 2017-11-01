<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
require_once(ABSPATH . 'wp-admin/includes/admin.php');

// @codingStandardsIgnoreStart
global $title, $hook_suffix, $current_screen, $wp_locale, $pagenow, $wp_version,
       $update_title, $total_update_count, $parent_file, $typenow;

if (empty($current_screen)) {
    set_current_screen();
}
// @codingStandardsIgnoreEnd
$typenow = get_post_type();
/**
 * @var $editableLink - link to editable content
 */
/** @var \VisualComposer\Helpers\Url $urlHelper */
$urlHelper = vchelper('Url');
/** @var \VisualComposer\Helpers\Nonce $nonceHelper */
$nonceHelper = vchelper('Nonce');
$optionsHelper = vchelper('Options');
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" <?php language_attributes(); ?>>
<head>
    <link rel="profile" href="http://gmpg.org/xfn/11" />
    <meta http-equiv="Content-Type" content="<?php bloginfo('html_type'); ?>; charset=<?php bloginfo('charset'); ?>" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <title><?php echo sprintf(__('Frontend editor: %s', 'vcwb'), get_the_title()); ?></title>
    <link rel="stylesheet"
          href="//fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900,900italic&subset=latin,greek,greek-ext,cyrillic-ext,latin-ext,cyrillic">
    <?php
    // @codingStandardsIgnoreLine
    do_action('admin_enqueue_scripts', $hook_suffix);
    do_action('admin_print_scripts');
    do_action('admin_head');
    wp_print_head_scripts();
    $extraOutput = vcfilter('vcv:frontend:update:head:extraOutput', []);
    if (is_array($extraOutput)) {
        foreach ($extraOutput as $output) {
            echo $output;
        }
        unset($output);
    }
    ?>
</head>
<body class="vcv-wb-editor vcv-is-disabled-outline">
<script>
    window.vcvUpdateUrl = '<?php echo $urlHelper->ajax(['vcv-action' => 'bundle:update:adminNonce']); ?>';
    window.vcvNonce = '<?php echo $nonceHelper->admin(); ?>';
    window.vcvActionsUrl = '<?php echo vchelper('Url')->ajax(['vcv-action' => 'hub:action:adminNonce']); ?>';
    <?php
    if (vcvenv('VCV_ENV_EXTENSION_DOWNLOAD')) :
    ?>
    window.vcvVendorUrl = '<?php echo content_url() . '/' . VCV_PLUGIN_ASSETS_DIRNAME . '/editor/vendor.bundle.js'; ?>';
    <?php else : ?>
    window.vcvVendorUrl = '<?php echo vchelper('Url')->to('public/dist/vendor.bundle.js'); ?>';
    <?php endif; ?>
</script>
<div id="vcv-posts-update-wrapper"></div>
<div class="vcv-layout-container vcv-is-disabled-outline">
    <div class="vcv-layout" id="vcv-layout">
        <div class="vcv-layout-header" id="vcv-layout-header">
        </div>
        <div class="vcv-layout-content">
            <div class="vcv-layout-iframe-container">
                <div class="vcv-layout-iframe-overlay" id="vcv-editor-iframe-overlay"></div>
                <div class="vcv-layout-iframe-content" id="vcv-layout-iframe-content">
                    <div class="vcv-loading-overlay">
                        <div data-vcv-error-description
                             class="vcv-popup-content vcv-popup-error-description vcv-popup-error--active">
                            <div class="vcv-logo">
                                <svg width="36px" height="37px" viewBox="0 0 36 37" version="1.1"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <g id="01-Intro-Free" transform="translate(-683.000000, -185.000000)">
                                            <g id="VC-Logo" transform="translate(683.000000, 185.000000)">
                                                <polygon id="Fill-1" fill="#257CA0"
                                                         points="17.982 21.662 17.989 37 8.999 31.837 8.999 21.499"></polygon>
                                                <polyline id="Fill-5" fill="#74953D"
                                                          points="17.71 5.977 26.694 6.139 26.708 21.494 17.71 21.315 17.71 5.977"></polyline>
                                                <polyline id="Fill-4" fill="#2CA2CF"
                                                          points="26.708 21.494 17.982 26.656 8.999 21.498 17.72 16.315 26.708 21.494"></polyline>
                                                <polyline id="Fill-6" fill="#9AC753"
                                                          points="35.42 5.972 26.694 11.135 17.71 5.977 26.432 0.793 35.42 5.972"></polyline>
                                                <polygon id="Fill-8" fill="#A77E2D"
                                                         points="8.984 6.145 8.998 21.499 0 16.32 0 5.98"></polygon>
                                                <polyline id="Fill-9" fill="#F2AE3B"
                                                          points="17.71 5.977 8.984 11.139 0 5.98 8.722 0.799 17.71 5.977"></polyline>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                            <div class="vcv-popup-heading">
                                <?php echo __('Oops!', 'vcwb'); ?>
                            </div>
                            <span class="vcv-popup-loading-heading"><?php
                                echo __(
                                    'It seems you are trying to edit archive page which displays your post archive instead of content. Before edit, please make sure to convert it into a static page via your WordPress admin.',
                                    'vcwb'
                                );
                                ?></span>
                            <div class="vcv-button-container">
                                <button data-vcv-back="<?php echo esc_url($editableLink); ?>"
                                        class="vcv-popup-button vcv-popup-form-submit vcv-popup-form-update">
	                                <span><?php echo __(
                                            'Back to WordPress',
                                            'vcwb'
                                        ); ?></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
