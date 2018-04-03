<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
/**
 * @var $editableLink - link to editable content
 * @var $frontendEditorLink - link to frontend editor
 */
/** @var \VisualComposer\Helpers\Url $urlHelper */
$urlHelper = vchelper('Url');
/** @var \VisualComposer\Helpers\Nonce $nonceHelper */
$nonceHelper = vchelper('Nonce');
$postTypeHelper = vchelper('PostType');
$beEditor = get_post_meta(get_the_ID(), 'vcv-be-editor', true);
if (vcvenv('VCV_ENV_LICENSES') && 'account' === vcvenv('VCV_ENV_ADDONS_ID')) {
    $licenseHelper = vchelper('License');
    $getPremiumPage = vcapp('PremiumPagesGetPremium');
}
// @codingStandardsIgnoreStart
?>
<script>
  document.getElementById('<?php echo $beEditor === 'classic' ? 'vcwb_visual_composer' : 'postdivrich' ?>').classList.add('vcv-hidden')
  window.ajaxurl = '<?php echo admin_url('admin-ajax.php', 'relative'); ?>';
  window.vcvSourceID = <?php echo get_the_ID(); ?>;
  window.vcvAjaxUrl = '<?php echo $urlHelper->ajax(); ?>';
  window.vcvAdminAjaxUrl = '<?php echo $urlHelper->adminAjax(); ?>';
  window.vcvNonce = '<?php echo esc_js($nonceHelper->admin()); ?>';
  window.vcvPluginUrl = '<?php echo VCV_PLUGIN_URL; ?>';
  window.vcvPluginSourceUrl = '<?php echo VCV_PLUGIN_URL; ?>' + 'public/sources/';
  window.vcvPostData = <?php echo json_encode($postTypeHelper->getPostData()); ?>;
  window.vcvPostPermanentLink = '<?php echo set_url_scheme(get_permalink(get_the_ID())); ?>';
    <?php if (vcvenv('VCV_ENV_LICENSES') && 'account' === vcvenv('VCV_ENV_ADDONS_ID')) : ?>
  window.vcvIsPremium = Boolean(<?php echo $licenseHelper->isActivated(); ?>);
  window.vcvGoPremiumUrlLogo = '<?php echo set_url_scheme(admin_url('admin.php?page=' . rawurlencode($getPremiumPage->getSlug()))); ?>';
    <?php endif; ?>
<?php // @codingStandardsIgnoreEnd ?>
</script>
<div id="vcv-editor">
    <div class="vcv-wpbackend-layout-container">
        <div class="vcv-layout" id="vcv-layout">
            <div class="vcv-layout-header" id="vcv-wpbackend-layout-header"></div>
            <div class="vcv-layout-content">
                <div class="vcv-layout-iframe-container">
                    <iframe
                            class="vcv-layout-iframe"
                            id="vcv-editor-iframe"
                            src="<?php
                            // @codingStandardsIgnoreLine
                            echo $editableLink;
                            ?>"
                            frameborder="0" scrolling="auto"></iframe>
                    <div class="vcv-layout-iframe-overlay" id="vcv-editor-iframe-overlay"></div>
                </div>
            </div>
            <div class="vcv-wpbackend-layout-content-container">
                <div id="vcv-wpbackend-layout-content" class="vcv-wpbackend-layout-content"></div>
                <div class="vcv-wpbackend-layout-content-overlay" id="vcv-wpbackend-layout-content-overlay"></div>
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
    <input type="hidden" value="0" name="vcv-backend" id="vcv-backend">
    <input type="hidden" name="vcv-action" id="vcv-action">
    <input type="hidden" name="vcv-data" id="vcv-data">
    <input type="hidden" name="vcv-global-elements-css" id="vcv-global-elements-css">
    <input type="hidden" name="vcv-global-elements" id="vcv-global-elements">
    <input type="hidden" name="vcv-global-elements-data" id="vcv-global-elements">
    <input type="hidden" name="vcv-source-assets-files" id="vcv-source-assets-files">
    <input type="hidden" name="vcv-source-css" id="vcv-source-css">
    <input type="hidden" name="vcv-settings-source-custom-css" id="vcv-settings-source-custom-css">
    <input type="hidden" name="vcv-settings-global-css" id="vcv-settings-global-css">
    <input type="hidden" name="vcv-elements-css-data" id="vcv-elements-css-data">
    <input type="hidden" name="vcv-settings-source-local-js" id="vcv-settings-source-local-js">
    <input type="hidden" name="vcv-settings-global-js" id="vcv-settings-global-js">
    <input type="hidden" name="vcv-tf" id="vcv-tf">
    <input type="hidden" name="vcv-be-editor" id="vcv-be-editor" value="<?php echo esc_attr($beEditor) ?>">
</div>
<?php
$extraOutput = vcfilter('vcv:backend:extraOutput', []);
if (is_array($extraOutput)) {
    foreach ($extraOutput as $output) {
        // @codingStandardsIgnoreLine
        echo $output;
    }
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
