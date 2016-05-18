<?php
/**
 * @var $editableLink - link to editable content
 */
/** @var \VisualComposer\Helpers\Url $urlHelper */
$urlHelper = vchelper('Url');
/** @var \VisualComposer\Helpers\Nonce $nonceHelper */
$nonceHelper = vchelper('Nonce');
wp_enqueue_media();
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" <?php language_attributes(); ?>>
<head>
    <link rel="profile" href="http://gmpg.org/xfn/11"/>
    <meta http-equiv="Content-Type" content="<?php bloginfo('html_type'); ?>; charset=<?php bloginfo('charset'); ?>"/>
    <title><?php __('Frontend editor', 'vc5'); /** @todo use more informative title */ ?></title>
    <link rel="stylesheet" property="stylesheet" type="text/css"
        href="<?php
        echo $urlHelper->to(
            'public/dist/wp.bundle.css?' . uniqid()
        ) ?>"/>
    <?php
    /** @todo add jquery into bundle.js. */
    wp_print_head_scripts();
    do_action('embed_head');
    ?>
</head>
<body>

<script type="text/javascript" src="<?php echo $urlHelper->to(
    'public/dist/wp.bundle.js?' . uniqid()
); /** @todo: use assets folder */ ?>"></script>
<script>
    window.vcvSourceID = <?php echo get_the_ID(); ?>;
    window.vcvAjaxUrl = '<?php echo $urlHelper->ajax(); ?>';
    window.vcvNonce = '<?php echo $nonceHelper->admin(); ?>';
</script>

<?php
do_action('wp_footer');
wp_print_footer_scripts();
?>

<iframe src="<?php echo $editableLink; ?>" id="vcv-editor-iframe"
    width="100%" height="100%" frameborder="0" scrolling="auto"></iframe>
</body>
</html>
