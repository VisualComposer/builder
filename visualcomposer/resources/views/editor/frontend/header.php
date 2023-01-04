<?php
/**
 * @var int $sourceId
 * @var string $currentScreen
 * @var string $hookSuffix
 * @var object $globalsHelper
 * @var object $outputHelper
 * @var string $title
 * @var array $extraOutput
 * @var array $variables
 */

$globalsHelper->set('wp_meta_boxes', []);
if (empty($currentScreen)) {
    set_current_screen();
}
global $current_screen;
if (empty($current_screen->id)) {
    $current_screen->id = $sourceId;
}
// @codingStandardsIgnoreEnd
$globalsHelper->set('typenow', get_post_type());

wp_enqueue_style('wp-admin');
wp_enqueue_media();
?>
<!DOCTYPE html>
<?php echo '<html xmlns="https://www.w3.org/1999/xhtml"' . ' ' .  get_language_attributes() . '>' ?>
<head>
    <link rel="profile" href="https://gmpg.org/xfn/11" />
    <meta http-equiv="Content-Type" content="<?php echo esc_attr(get_bloginfo('html_type', 'display')); ?>; charset=<?php echo esc_attr(get_bloginfo('charset', 'display')); ?>" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1, user-scalable=0" />
    <title><?php
        // translators: %s: page title
        echo $title;
        ?></title>
    <link rel="stylesheet"
        href="//fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900,900italic&subset=latin,greek,greek-ext,cyrillic-ext,latin-ext,cyrillic">
    <?php
    vcevent('vcv:frontend:render', ['sourceId' => $sourceId]);
    do_action('admin_enqueue_scripts', $hookSuffix);
    do_action('admin_print_styles');
    do_action('admin_print_scripts');
    do_action('admin_head');
    do_action('embed_head');
    wp_print_head_scripts();
    if (!empty($extraOutput) && is_array($extraOutput)) {
        foreach ($extraOutput as $output) {
            $outputHelper->printNotEscaped($output);
        }
        unset($output);
    }
    if (is_array($variables)) {
        foreach ($variables as $variable) {
            if (is_array($variable) && isset($variable['key'], $variable['value'])) {
                $variableType = isset($variable['type']) ? $variable['type'] : 'variable';
                evcview('partials/variableTypes/' . $variableType, $variable);
            }
        }
        unset($variable);
    }
    ?>
</head>