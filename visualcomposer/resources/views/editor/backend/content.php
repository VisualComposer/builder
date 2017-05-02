<?php
/**
 * @var $editableLink - link to editable content
 * @var $frontendEditorLink - link to frontend editor
 */
/** @var \VisualComposer\Helpers\Url $urlHelper */
$urlHelper = vchelper('Url');
/** @var \VisualComposer\Helpers\Nonce $nonceHelper */
$nonceHelper = vchelper('Nonce');
$postTypeHelper = vchelper('PostType');
?>
<script>
    document.getElementById('postdivrich').classList.add('vcv-hidden')
    window.ajaxurl = '<?php echo admin_url('admin-ajax.php', 'relative'); ?>';
    window.vcvSourceID = <?php echo get_the_ID(); ?>;
    window.vcvAjaxUrl = '<?php echo $urlHelper->ajax(); ?>';
    window.vcvNonce = '<?php echo $nonceHelper->admin(); ?>';
    window.vcvPluginUrl = '<?php echo VCV_PLUGIN_URL; ?>';
    window.vcvPluginSourceUrl = '<?php echo VCV_PLUGIN_URL; ?>' + 'public/sources/';
    window.vcvPostData = <?php echo json_encode($postTypeHelper->getPostData()); ?>;
    window.vcvPostPermanentLink = '<?php echo get_permalink(get_the_ID()) ?>';
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
                        src="<?php echo $editableLink; ?>"
                        frameborder="0" scrolling="auto"></iframe>
                    <div class="vcv-layout-iframe-overlay" id="vcv-editor-iframe-overlay"></div>
                </div>
            </div>
            <div class="vcv-wpbackend-layout-content-container">
                <div id="vcv-wpbackend-layout-content" class="vcv-wpbackend-layout-content"></div>
                <div class="vcv-wpbackend-layout-content-overlay" id="vcv-wpbackend-layout-content-overlay"></div>
	            <div class="vcv-layout-iframe-content" id="vcv-layout-iframe-content">
		            <div class="vcv-loading-overlay">
			            <div class="vcv-loading-dots-container">
				            <div class="vcv-loading-dot vcv-loading-dot-1"></div>
				            <div class="vcv-loading-dot vcv-loading-dot-2"></div>
			            </div>
		            </div>
	            </div>
            </div>
        </div>
    </div>
    <input type="hidden" value="0" name="vcv-ready" id="vcv-ready">
    <input type="hidden" name="vcv-action" id="vcv-action">
    <input type="hidden" name="vcv-data" id="vcv-data">
    <input type="hidden" name="vcv-global-elements-css" id="vcv-global-elements-css">
    <input type="hidden" name="vcv-global-elements" id="vcv-global-elements">
    <input type="hidden" name="vcv-global-elements-data" id="vcv-global-elements">
    <input type="hidden" name="vcv-source-assets-files" id="vcv-source-assets-files">
    <input type="hidden" name="vcv-source-css" id="vcv-source-css">
    <input type="hidden" name="vcv-settings-source-custom-css" id="vcv-settings-source-custom-css">
    <input type="hidden" name="vcv-settings-global-css" id="vcv-settings-global-css">
    <input type="hidden" name="tf" id="vcv-tf">
</div>

<?php
$extraOutput = vcfilter('vcv:backend:extraOutput', []);
if (is_array($extraOutput)) {
    foreach ($extraOutput as $output) {
        echo $output;
    }
}
