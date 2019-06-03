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
require_once(ABSPATH . 'wp-admin/includes/admin.php');

// @codingStandardsIgnoreStart
global $title, $hook_suffix, $current_screen, $wp_locale, $pagenow, $wp_version,
       $update_title, $total_update_count, $parent_file, $typenow, $wp_meta_boxes;

if (empty($current_screen)) {
    set_current_screen();
}
$wp_meta_boxes = [];
// @codingStandardsIgnoreEnd
$typenow = get_post_type();
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
    <script>
      window.vcvAjaxUrl = '<?php echo vchelper('Url')->ajax(); ?>';
      window.vcvAdminAjaxUrl = '<?php echo vchelper('Url')->adminAjax(); ?>';
    </script>
    <?php
    evcview('settings/partials/admin-nonce');
    // @codingStandardsIgnoreLine
    do_action('admin_enqueue_scripts', $hook_suffix);
    do_action('admin_print_scripts');
    do_action('admin_head');
    wp_print_head_scripts();
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
<div class="vcv-settings">
    <?php echo $content; ?>
</div>
<?php
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
