<?php
/**
 * @var string $content
 * @var int $sourceId
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

$variables = vcfilter(
    'vcv:editor:variables',
    [
        [
            'key' => 'VCV_SLUG',
            'value' => 'vcv-update-fe',
            'type' => 'constant',
        ],
    ],
    [
        'slug' => 'vcv-update-fe',
    ]
);

echo vcview('editor/frontend/header', array(
    'sourceId' => $sourceId,
    'currentScreen' => $current_screen,
    'hookSuffix' => $hook_suffix,
    'globalsHelper' => $globalsHelper,
    'outputHelper' => $outputHelper,
    'title' => __('Visual Composer: Update', 'visualcomposer'),
    'variables' => $variables,
));

$hookSuffix = $hook_suffix;
$globalsHelper->set('wp_meta_boxes', []);
if (empty($current_screen)) {
    set_current_screen();
}
// @codingStandardsIgnoreEnd
$globalsHelper->set('typenow', get_post_type());

wp_enqueue_style('wp-admin');
wp_enqueue_media();
?>

<body class="vcv-wb-editor vcv-is-disabled-outline">
<script src="<?php echo esc_url(get_site_url(null, 'index.php?vcv-script=vendor')); ?>"></script>

<div class="vcv-settings" data-section="vcv-update">
    <?php $outputHelper->printNotEscaped($content); ?>
</div>
<?php
vcevent('vcv:frontend:postUpdate:render:footer', ['sourceId' => $sourceId]);
$extraOutput = vcfilter('vcv:frontend:update:extraOutput', []);

echo vcview('editor/frontend/footer', array(
    'sourceId' => $sourceId,
    'hookSuffix' => $hook_suffix,
    'outputHelper' => $outputHelper,
    'extraOutput' => $extraOutput,
));
