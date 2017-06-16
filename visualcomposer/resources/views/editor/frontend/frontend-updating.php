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
    $extraOutput = vcfilter('vcv:frontend:head:extraOutput', []);
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
  window.vcvAccountUrl = '<?php echo $urlHelper->ajax(['vcv-action' => 'bundle:update:adminNonce']); ?>'
  window.vcvAdminNonce = '<?php echo $nonceHelper->admin(); ?>';
</script>
<div class="vcv-layout-container vcv-is-disabled-outline">
    <div class="vcv-layout" id="vcv-layout">
        <div class="vcv-layout-header" id="vcv-layout-header">
        </div>
        <div class="vcv-layout-content">
            <div class="vcv-layout-iframe-container">
                <iframe class="vcv-layout-iframe"
                    src="<?php echo $editableLink; ?>" id="vcv-editor-iframe"
                    frameborder="0" scrolling="auto"></iframe>
                <div class="vcv-layout-iframe-overlay" id="vcv-editor-iframe-overlay"></div>
                <div class="vcv-layout-iframe-content" id="vcv-layout-iframe-content">
                    <div class="vcv-loading-overlay">
                        <div class="vcv-loading-overlay-inner">
                            <div class="vcv-loading-dots-container">
                                <div class="vcv-loading-dot vcv-loading-dot-1"></div>
                                <div class="vcv-loading-dot vcv-loading-dot-2"></div>
                            </div>
                            <div class="vcv-loading-text">
                                <p class="vcv-loading-text-main">We are updating assets from the Visual Composer Cloud ... Please wait.</p>
                                <p class="vcv-loading-text-helper">Don’t close this window while update is in process.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
  webpackJsonp(0, [ function (a, b, c) {
    var j = c('./node_modules/jquery/dist/jquery.js');
    j.post(window.vcvAccountUrl, { 'vcv-nonce': window.vcvAdminNonce }, function () {window.location.reload()}).always(function () {window.location.reload()});
  } ]);
</script>
</body>
</html>
