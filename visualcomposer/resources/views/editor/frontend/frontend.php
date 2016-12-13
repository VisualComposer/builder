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
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/wp.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script>
    window.vcvSourceID = <?php echo get_the_ID(); ?>;
    window.vcvAjaxUrl = '<?php echo $urlHelper->ajax(); ?>';
    window.vcvNonce = '<?php echo $nonceHelper->admin(); ?>';
    window.vcvPluginUrl = '<?php echo VCV_PLUGIN_URL; ?>';
    window.vcvPostData = <?php echo json_encode(vcapp()->call([$frontendModule, 'getPostData'])); ?>;
    window.vcvPostPermanentLink = '<?php echo get_permalink(get_the_ID()) ?>';
</script>
<!--
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/vendor.bundle.js?' . uniqid()); /** @todo: use assets  */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/wp.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-basicButton.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-column.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-flickrImage.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-googleFontsHeading.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-googleMaps.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-heroSection.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-icon.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-imageGallery.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-instagramImage.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-rawHtml.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-rawJs.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-row.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-singleImage.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-textBlock.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-twitterButton.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-twitterGrid.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-twitterPublisher.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-twitterTimeline.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-twitterTweet.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-vimeoPlayer.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-woocommerceAddToCart.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-woocommerceAddToCartUrl.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-woocommerceBestSellingProducts.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-woocommerceCart.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-woocommerceCheckout.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-woocommerceFeaturedProducts.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-woocommerceMyAccount.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-woocommerceOrderTracking.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-woocommerceProduct.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-woocommerceProductAttribute.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-woocommerceProductCategories.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-woocommerceProductCategory.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-woocommerceProductPage.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-woocommerceProducts.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-woocommerceRecentProducts.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-woocommerceRelatedProducts.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-woocommerceSaleProducts.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-woocommerceTopRatedProducts.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
<script type="text/javascript" src="<?php echo $urlHelper->to('public/dist/element-youtubePlayer.bundle.js?' . uniqid()); /** @todo: use assets folder */ ?>"></script>
!-->
<?php
$extraOutput = vcfilter('vcv:frontend:extraOutput', []);
foreach ($extraOutput as $output) {
    echo $output;
}
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
<?php
do_action('wp_footer');
wp_print_footer_scripts();
?>
</body>
</html>
