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
<script>
  window.vcvAccountUrl = '<?php echo $urlHelper->ajax(['vcv-action' => 'bundle:update:adminNonce']); ?>'
  window.vcvNonce = '<?php echo $nonceHelper->admin(); ?>';
  window.vcvPageBack = '<?php echo $optionsHelper->getTransient('_vcv_update_page_redirect_url'); ?>';
</script>

<!-- Third screen / loading screen -->
<div class="vcv-popup-content vcv-popup-loading-screen">
    <!-- Loading image -->
    <div class="vcv-loading-dots-container">
        <div class="vcv-loading-dot vcv-loading-dot-1"></div>
        <div class="vcv-loading-dot vcv-loading-dot-2"></div>
    </div>

    <span class="vcv-popup-loading-heading"><?php
        echo __('We are updating assets from the Visual Composer Cloud ... Please wait.', 'vcwb');
        ?></span>


    <span class="vcv-popup-helper"><?php
        echo __('Don’t close this window while update is in process.', 'vcwb');
        ?></span>
    <!-- Loading big white circle -->
    <div class="vcv-popup-loading-zoom"></div>
</div>
<div class="vcv-popup-content">
    <div class="vcv-button-container">
        <button data-vcv-retry class="vcv-popup-button vcv-popup-last-screen-button vcv-popup-button--hidden"><span><?php echo __(
                    'Retry Update',
                    'vcwb'
                ); ?></span></button>
    </div>
</div>