<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
require_once(ABSPATH . 'wp-admin/includes/admin.php');

// @codingStandardsIgnoreStart
global $title, $hook_suffix, $current_screen, $wp_locale, $pagenow, $wp_version,
       $update_title, $total_update_count, $parent_file, $typenow, $wp_meta_boxes;

$hookSuffix = $hook_suffix;
$wp_meta_boxes = [];
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
/** @var \VisualComposer\Helpers\Token $nonceHelper */
$tokenHelper = vchelper('Token');

wp_enqueue_style('wp-admin');
wp_enqueue_media();
$licenseHelper = vchelper('License');
$postTypeHelper = vchelper('PostType');
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" <?php language_attributes(); ?>>
<head>
    <link rel="profile" href="http://gmpg.org/xfn/11" />
    <meta http-equiv="Content-Type" content="<?php bloginfo('html_type'); ?>; charset=<?php bloginfo('charset'); ?>" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1, user-scalable=0" />
    <title><?php echo sprintf(__('Frontend editor: %s', 'vcwb'), get_the_title()); ?></title>
    <link rel="stylesheet"
            href="//fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900,900italic&subset=latin,greek,greek-ext,cyrillic-ext,latin-ext,cyrillic">
    <?php
    // @codingStandardsIgnoreLine
    vcevent('vcv:frontend:render');
    do_action('admin_enqueue_scripts', $hookSuffix);
    do_action('admin_print_styles');
    do_action('admin_print_scripts');
    do_action('admin_head');
    do_action('embed_head');
    wp_print_head_scripts();
    $extraOutput = vcfilter('vcv:frontend:head:extraOutput', []);
    if (is_array($extraOutput)) {
        foreach ($extraOutput as $output) {
            // @codingStandardsIgnoreLine
            echo $output;
        }
        unset($output);
    }
    $variables = vcfilter('vcv:editor:variables', []);
    if (is_array($variables)) {
        foreach ($variables as $variable) {
            if (is_array($variable) && isset($variable['key'], $variable['value'])) {
                $type = isset($variable['type']) ? $variable['type'] : 'variable';
                evcview('partials/variableTypes/' . $type, $variable);
            }
        }
        unset($variable);
    }
    ?>
</head>
<body class="vcv-wb-editor vcv-is-disabled-outline">
<?php // @codingStandardsIgnoreStart ?>
<script>
  window.ajaxurl = '<?php echo admin_url('admin-ajax.php', 'relative'); ?>';
  window.vcvSourceID = <?php echo get_the_ID(); ?>;
  window.vcvAjaxUrl = '<?php echo $urlHelper->ajax() ?>';
  window.vcvAdminAjaxUrl = '<?php echo $urlHelper->adminAjax(); ?>';
  window.vcvNonce = '<?php echo esc_js($nonceHelper->admin()); ?>';
  window.vcvPluginUrl = '<?php echo VCV_PLUGIN_URL; ?>';
  window.vcvPluginSourceUrl = '<?php echo VCV_PLUGIN_URL; ?>' + 'public/sources/';
  window.vcvPostData = <?php echo json_encode($postTypeHelper->getPostData()); ?>;
  window.vcvPostPermanentLink = '<?php echo set_url_scheme(get_permalink(get_the_ID())); ?>';
  window.vcvIsPremium = Boolean(<?php echo $licenseHelper->isActivated(); ?>);
  window.vcvGoPremiumUrl = '<?php echo set_url_scheme(admin_url('admin.php?page=vcv-go-premium')); ?>';
  window.vcvGettingStartedUrl = '<?php echo set_url_scheme(admin_url('admin.php?page=vcv-getting-started&vcv-ref=logoFrontend')); ?>';
  window.vcvGutenbergEditorUrl = '<?php echo set_url_scheme(
      admin_url('post-new.php?post_type=vcv_gutenberg_attr')
  ); ?>';
  window.vcvIsActivated = Boolean(<?php echo $tokenHelper->isSiteAuthorized(); ?>);
  window.vcvUpgradeUrl = '<?php echo set_url_scheme(admin_url('admin.php?page=vcv-go-premium&vcv-ref=hub-banner')); ?>';
  window.vcvUpgradeUrlUnsplash = '<?php echo set_url_scheme(admin_url('admin.php?page=vcv-go-premium&vcv-ref=unsplash')); ?>';
  <?php if (isset($feError) && $feError) : ?>
  window.vcvFeError = '<?php echo $feError; ?>'
  <?php endif; ?>
</script>
<?php
// @codingStandardsIgnoreEnd
$extraOutput = vcfilter('vcv:frontend:body:extraOutput', []);
if (is_array($extraOutput)) {
    foreach ($extraOutput as $output) {
        // @codingStandardsIgnoreLine
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
                            src="<?php
                            // @codingStandardsIgnoreLine
                            echo $editableLink;
                            ?>" id="vcv-editor-iframe"
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
    <div class="vcv-layout-overlay"></div>
</div>
<?php
wp_print_footer_scripts();
do_action('admin_footer', '');
do_action('admin_print_footer_scripts-{$hookSuffix}');
do_action('admin_print_footer_scripts');
do_action('admin_footer-{$hookSuffix}');
$extraOutput = vcfilter('vcv:frontend:footer:extraOutput', []);
if (is_array($extraOutput)) {
    foreach ($extraOutput as $output) {
        // @codingStandardsIgnoreLine
        echo $output;
    }
    unset($output);
}
?>
</body>
</html>
