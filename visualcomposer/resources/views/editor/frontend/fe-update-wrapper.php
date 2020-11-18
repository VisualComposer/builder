<?php
/**
 * @var array $posts
 * @var array $actions
 */
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
require_once ABSPATH . 'wp-admin/includes/admin.php';

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
/** @var integer $sourceId - id of current edited post */
wp_enqueue_style('wp-admin');
wp_enqueue_media();
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" <?php language_attributes(); ?>>
<head>
    <link rel="profile" href="http://gmpg.org/xfn/11" />
    <meta http-equiv="Content-Type" content="<?php bloginfo('html_type'); ?>; charset=<?php bloginfo('charset'); ?>" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1, user-scalable=0" />
    <title>Visual Composer Post Update</title>
    <link rel="stylesheet"
            href="//fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900,900italic&subset=latin,greek,greek-ext,cyrillic-ext,latin-ext,cyrillic">
    <?php
    vcevent('vcv:frontend:render', ['sourceId' => $sourceId]);
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
    if (is_array($variables)) {
        foreach ($variables as $variable) {
            if (is_array($variable) && isset($variable['key'], $variable['value'])) {
                $type = isset($variable['type']) ? $variable['type'] : 'variable';
                evcview('partials/variableTypes/' . $type, $variable);
            }
        }
        unset($variable);
    }
    // @codingStandardsIgnoreLine
    do_action('admin_enqueue_scripts', $hook_suffix);
    do_action('admin_print_scripts');
    do_action('admin_head');
    do_action('embed_head');
    wp_print_head_scripts();
    ?>
</head>
<body class="vcv-wb-editor vcv-is-disabled-outline">
<div class="vcv-settings">
    <?php echo $content; ?>
</div>
<?php
vcevent('vcv:frontend:postUpdate:render:footer', ['sourceId' => $sourceId]);
wp_print_footer_scripts();
do_action('admin_footer', '');
do_action('admin_print_footer_scripts-{$hookSuffix}');
do_action('admin_print_footer_scripts');
do_action('admin_footer-{$hookSuffix}');
$extraOutput = vcfilter('vcv:frontend:update:extraOutput', []);
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
