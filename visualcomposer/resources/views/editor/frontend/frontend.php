<?php
/**
 * @var $editableLink - link to editable content
 */
/** @var \VisualComposer\Helpers\Url $urlHelper */
$urlHelper = vchelper('Url');
/** @var \VisualComposer\Helpers\Nonce $nonceHelper */
$nonceHelper = vchelper('Nonce');
wp_enqueue_media();
/** @var \VisualComposer\Modules\Editors\Frontend\Controller $frontendModule */
$frontendModule = vcapp('EditorsFrontendController');
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" <?php language_attributes(); ?>>
<head>
    <link rel="profile" href="http://gmpg.org/xfn/11" />
    <meta http-equiv="Content-Type" content="<?php bloginfo('html_type'); ?>; charset=<?php bloginfo('charset'); ?>" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <title><?php __('Frontend editor', 'vc5'); /** @todo use more informative title */ ?></title>
    <link rel="stylesheet"
        href="//fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900,900italic&subset=latin,greek,greek-ext,cyrillic-ext,latin-ext,cyrillic">
    <link rel="stylesheet" property="stylesheet" type="text/css"
        href="<?php
        echo $urlHelper->to(
            'public/dist/wp.bundle.css?' . uniqid()
        ) ?>" />

    <?php
    /** @todo add jquery into bundle.js. */
    do_action('embed_head');
    wp_print_head_scripts();
    ?>
</head>
<body class="vcv-wb-editor">

<script type="text/javascript" src="<?php echo $urlHelper->to(
    'public/dist/wp.bundle.js?' . uniqid()
); /** @todo: use assets folder */ ?>"></script>
<script>
    window.vcvSourceID = <?php echo get_the_ID(); ?>;
    window.vcvAjaxUrl = '<?php echo $urlHelper->ajax(); ?>';
    window.vcvNonce = '<?php echo $nonceHelper->admin(); ?>';
    window.vcvPluginUrl = '<?php echo VCV_PLUGIN_URL; ?>';
    window.vcvPostData = <?php echo json_encode(vcapp()->call([$frontendModule, 'getPostData'])); ?>;
</script>

<?php
do_action('wp_footer');
$extraOutput = vcfilter('vcv:frontend:extraOutput', []);
foreach ($extraOutput as $output) {
    echo $output;
}
wp_print_footer_scripts();
?>

<div class="vcv-layout-container">
    <div class="vcv-layout" id="vcv-layout">
        <div class="vcv-layout-header" id="vcv-layout-header">

        </div>
        <div class="vcv-layout-content">
            <div class="vcv-layout-iframe-container">
                <iframe class="vcv-layout-iframe"
                    src="<?php echo $editableLink; ?>" id="vcv-editor-iframe"
                    frameborder="0" scrolling="auto"></iframe>
                <div class="vcv-layout-iframe-overlay" id="vcv-editor-iframe-overlay"></div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
