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
wp_enqueue_style('wp-admin');
wp_enqueue_media();
$postTypeHelper = vchelper('PostType');
if (vcvenv('VCV_ENV_LICENSES') && 'account' === vcvenv('VCV_ENV_ADDONS_ID')) {
    $licenseHelper = vchelper('License');
    $getPremiumPage = vcapp('PremiumPagesGetPremium');
}
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
    do_action('admin_print_styles');
    do_action('admin_print_scripts');
    do_action('admin_head');
    do_action('embed_head');
    wp_print_head_scripts();
    $extraOutput = vcfilter('vcv:frontend:head:extraOutput', []);
    if (is_array($extraOutput)) {
        foreach ($extraOutput as $output) {
            echo $output;
        }
        unset($output);
    }
    $variables = vcfilter('vcv:editor:variables', []);
    if (is_array($variables)) {
        foreach ($variables as $variable) {
            if (is_array($variable) && isset($variable['key'], $variable['value'])) {
                $type = isset($variable['type']) ? $variable['type'] : 'variable';
                echo vcview('partials/variableTypes/' . $type, $variable);
            }
        }
        unset($variable);
    }
    ?>
</head>
<body class="vcv-wb-editor vcv-is-disabled-outline">
<script>
  window.ajaxurl = '<?php echo admin_url('admin-ajax.php', 'relative'); ?>';
  window.vcvSourceID = <?php echo get_the_ID(); ?>;
  window.vcvAjaxUrl = '<?php echo $urlHelper->ajax(); ?>';
  window.vcvAdminAjaxUrl = '<?php echo $urlHelper->adminAjax(); ?>';
  window.vcvNonce = '<?php echo $nonceHelper->admin(); ?>';
  window.vcvPluginUrl = '<?php echo VCV_PLUGIN_URL; ?>';
  window.vcvPluginSourceUrl = '<?php echo VCV_PLUGIN_URL; ?>' + 'public/sources/';
  window.vcvPostData = <?php echo json_encode($postTypeHelper->getPostData()); ?>;
  window.vcvPostPermanentLink = '<?php echo get_permalink(get_the_ID()) ?>';
	<?php if (vcvenv('VCV_ENV_LICENSES') && 'account' === vcvenv('VCV_ENV_ADDONS_ID')) { ?>
	window.vcvIsPremium = Boolean(<?php echo $licenseHelper->isActivated() ?>);
    window.vcvGoPremiumUrl = '<?php echo esc_url(admin_url('admin.php?page=' . rawurlencode($getPremiumPage->getSlug()))); ?>&vcv-ref=nav-bar';
    window.vcvGoPremiumUrlLogo = '<?php echo esc_url(admin_url('admin.php?page=' . rawurlencode($getPremiumPage->getSlug()))); ?>';
	<?php } ?>
    <?php if (isset($feError) && $feError) { ?>
      window.vcvFeError = '<?php echo $feError; ?>'
    <?php } ?>
</script>
<?php
$extraOutput = vcfilter('vcv:frontend:body:extraOutput', []);
if (is_array($extraOutput)) {
    foreach ($extraOutput as $output) {
        echo $output;
    }
    unset($output);
}
?>
<div class="vcv-layout-container vcv-is-disabled-outline">
    <div class="vcv-layout" id="vcv-layout">
        <div class="vcv-layout-header" id="vcv-layout-header">
        </div>
        <div class="vcv-layout-content">
            <div class="vcv-layout-iframe-container">
	            <div class="vcv-layout-iframe-wrapper">
	                <iframe class="vcv-layout-iframe"
	                    src="<?php echo $editableLink; ?>" id="vcv-editor-iframe"
	                    frameborder="0" scrolling="auto"></iframe>
	            </div>
                <div class="vcv-layout-iframe-overlay" id="vcv-editor-iframe-overlay"></div>
                <div class="vcv-layout-iframe-content" id="vcv-layout-iframe-content">
                    <div class="vcv-loading-overlay">
	                    <div class="vcv-loading-overlay-inner">
		                    <div class="vcv-loading-dots-container">
			                    <div class="vcv-loading-dot vcv-loading-dot-1"></div>
			                    <div class="vcv-loading-dot vcv-loading-dot-2"></div>
		                    </div>
	                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<?php
do_action('wp_footer');
wp_print_footer_scripts();
do_action('admin_footer', '');
do_action('admin_print_footer_scripts-{$hook_suffix}');
do_action('admin_print_footer_scripts');
do_action('admin_footer-{$hook_suffix}');
$extraOutput = vcfilter('vcv:frontend:footer:extraOutput', []);
if (is_array($extraOutput)) {
    foreach ($extraOutput as $output) {
        echo $output;
    }
    unset($output);
}
?>
</body>
</html>
