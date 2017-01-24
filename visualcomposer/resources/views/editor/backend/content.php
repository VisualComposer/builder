<?php
/**
 * @var $editableLink - link to editable content
 */
/** @var \VisualComposer\Helpers\Url $urlHelper */
$urlHelper = vchelper('Url');
/** @var \VisualComposer\Helpers\Nonce $nonceHelper */
$nonceHelper = vchelper('Nonce');
$postTypeHelper = vchelper('PostType');
?>
<script>
    window.ajaxurl = '<?php echo admin_url('admin-ajax.php', 'relative'); ?>';
    window.vcvSourceID = <?php echo get_the_ID(); ?>;
    window.vcvAjaxUrl = '<?php echo $urlHelper->ajax(); ?>';
    window.vcvNonce = '<?php echo $nonceHelper->admin(); ?>';
    window.vcvPluginUrl = '<?php echo VCV_PLUGIN_URL; ?>';
    window.vcvPostData = <?php echo json_encode($postTypeHelper->getPostData()); ?>;
    window.vcvPostPermanentLink = '<?php echo get_permalink(get_the_ID()) ?>';
</script>

<div id="vcv-editor">
    <div class="vcv-wpbackend-layout-container">
        <div class="vcv-layout" id="vcv-layout">
            <div class="vcv-layout-header" id="vcv-layout-header"></div>
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
            </div>
        </div>
    </div>
</div>

<?php
$extraOutput = vcfilter('vcv:backend:extraOutput', []);
foreach ($extraOutput as $output) {
    echo $output;
}
?>