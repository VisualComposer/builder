<?php
/**
 * @var int $sourceId
 * @var string $editableLink - link to editable content
 */

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
require_once ABSPATH . 'wp-admin/includes/admin.php';
$globalsHelper = vchelper('Globals');
$outputHelper = vchelper('Output');
// @codingStandardsIgnoreStart
global $title, $hook_suffix, $current_screen, $wp_locale, $pagenow, $wp_version,
       $update_title, $total_update_count, $parent_file, $typenow, $wp_meta_boxes;

$extraOutput = vcfilter('vcv:frontend:head:extraOutput', [], ['sourceId' => $sourceId]);
$variables = vcfilter('vcv:editor:variables', [], ['sourceId' => $sourceId]);

echo vcview('editor/frontend/header', array(
    'sourceId' => $sourceId,
    'currentScreen' => $current_screen,
    'hookSuffix' => $hook_suffix,
    'globalsHelper' => $globalsHelper,
    'outputHelper' => $outputHelper,
    'title' => sprintf(__('Visual Composer: %s', 'visualcomposer'), esc_html(get_the_title())),
    'extraOutput' => $extraOutput,
    'variables' => $variables,
));

?>
<body class="vcv-wb-editor vcv-is-disabled-outline">
<?php
$extraOutput = vcfilter('vcv:frontend:body:extraOutput', [], ['sourceId' => $sourceId]);
if (is_array($extraOutput)) {
    foreach ($extraOutput as $output) {
        $outputHelper->printNotEscaped($output);
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
                    <div class="vcv-layout-guide-helper-controls" data-vcv-guide-helper="element-controls">
                    </div>
                    <div class="vcv-layout-guide-helper-bottom-menu" data-vcv-guide-helper="quick-actions">
                    </div>
                    <iframe class="vcv-layout-iframe"
                            src="<?php
                            echo esc_url($editableLink);
                            ?>" id="vcv-editor-iframe"
                            frameborder="0" scrolling="auto"></iframe>
                </div>
                <div class="vcv-layout-iframe-overlay" id="vcv-editor-iframe-overlay">
                    <div class="vcv-ui-outline-controls-wrapper"></div>
                    <div class="vcv-ui-append-control-wrapper"></div>
                    <div class="vcv-ui-element-resize-control-wrapper"></div>
                    <div class="vcv-ui-element-outline-container"></div>
                </div>
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
vcevent('vcv:frontend:render:footer', ['sourceId' => $sourceId]);

$extraOutput = vcfilter('vcv:frontend:footer:extraOutput', [], ['sourceId' => $sourceId]);
echo vcview('editor/frontend/footer', array(
    'sourceId' => $sourceId,
    'hookSuffix' => $hook_suffix,
    'outputHelper' => $outputHelper,
    'extraOutput' => $extraOutput,
));
