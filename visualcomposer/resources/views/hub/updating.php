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

$extraOutput = vcfilter('vcv:frontend:update:head:extraOutput', []);
if (is_array($extraOutput)) {
    foreach ($extraOutput as $output) {
        echo $output;
    }
    unset($output);
}
?>
<div class="vcv-wb-editor vcv-is-disabled-outline">
    <script>
      window.vcvAccountUrl = '<?php echo $urlHelper->ajax(['vcv-action' => 'bundle:update:adminNonce']); ?>'
      window.vcvNonce = '<?php echo $nonceHelper->admin(); ?>';
      window.vcvPageBack = '<?php echo $optionsHelper->getTransient('_vcv_update_page_redirect_url'); ?>';
    </script>
    <div class="vcv-layout-container vcv-is-disabled-outline">
        <div class="vcv-layout" id="vcv-layout">
            <div class="vcv-layout-header" id="vcv-layout-header">
            </div>
            <div class="vcv-layout-content">
                <div class="vcv-layout-iframe-container">
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
</div>
