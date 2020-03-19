<?php

class VcCustomForTestWpScripts extends \WP_Scripts
{
    public $enqueuedScripts = [];

    public function enqueue($handle)
    {
        if (isset($this->enqueuedScripts[ $handle ])) {
            $this->enqueuedScripts[ $handle ]++;
        } else {
            $this->enqueuedScripts[ $handle ] = 1;
        }

        return parent::enqueue($handle);
    }
}

class VcCustomForTestWpStyles extends \WP_Styles
{
    public $enqueuedStyles = [];

    public function enqueue($handle)
    {
        if (isset($this->enqueuedStyles[ $handle ])) {
            $this->enqueuedStyles[ $handle ]++;
        } else {
            $this->enqueuedStyles[ $handle ] = 1;
        }

        return parent::enqueue($handle);
    }
}

class HelpersAssetsEnqueueTest extends WP_UnitTestCase
{
    public function testAssetEnqueue()
    {
        wp_set_current_user(1);
        $factory = new WP_UnitTest_Factory_For_Post($this);
        $postId = $factory->create(
            [
                'post_type' => 'vcv_headers',
                'post_content' => '<!--vcv no format--><div class="vce-row-container"><div class="vce-row vce-row--col-gap-30 vce-row-columns--top vce-row-content--top" id="el-4c549ec4" data-vce-do-apply="all el-4c549ec4"><div class="vce-row-content" data-vce-element-content="true"><div class="vce-col vce-col--md-auto vce-col--xs-1 vce-col--xs-last vce-col--xs-first vce-col--sm-last vce-col--sm-first vce-col--md-last vce-col--lg-last vce-col--xl-last vce-col--md-first vce-col--lg-first vce-col--xl-first" id="el-688d5adb"><div class="vce-col-inner" data-vce-do-apply="border margin background  el-688d5adb"><div class="vce-col-content" data-vce-element-content="true" data-vce-do-apply="padding el-688d5adb"><div class="vce-faq-toggle vce-faq-toggle-color--fff vce-faq-toggle-shape-color--1D64C5 vce-faq-toggle-shape--rounded"><div class="vce-faq-toggle-wrapper vce" id="el-204cb4fe" data-vce-do-apply="margin padding border background  el-204cb4fe"><div class="vce-faq-toggle-inner" data-reactroot=""><div class="vce-faq-toggle-title"><h3 class="vce-faq-toggle-title-text"><i class="vce-faq-toggle-icon"></i>What is frequently asked questions?</h3></div><div class="vce-faq-toggle-text-block"><p>Frequently asked questions (FAQ) or Questions and Answers (Q&amp;A), are listed questions and answers, all supposed to be commonly asked in some context, and pertaining to a particular topic.</p></div></div></div></div></div></div></div></div></div></div><div class="vce-row-container"><div class="vce-row vce-row--col-gap-30 vce-row-columns--top vce-row-content--top" id="el-94434e30" data-vce-do-apply="all el-94434e30"><div class="vce-row-content" data-vce-element-content="true"><div class="vce-col vce-col--md-auto vce-col--xs-1 vce-col--xs-last vce-col--xs-first vce-col--sm-last vce-col--sm-first vce-col--md-last vce-col--lg-last vce-col--xl-last vce-col--md-first vce-col--lg-first vce-col--xl-first" id="el-3540167a"><div class="vce-col-inner" data-vce-do-apply="border margin background  el-3540167a"><div class="vce-col-content" data-vce-element-content="true" data-vce-do-apply="padding el-3540167a"><div class="vce-single-image-container vce-single-image--align-left"><div class="vce vce-single-image-wrapper" id="el-be868b24" data-vce-do-apply="all el-be868b24"><figure><div class="vce-single-image-inner vce-single-image--absolute" style="padding-bottom: 66.6667%; width: 960px;"><img class="vce-single-image" width="960" height="640"src="|!|vcvUploadUrl|!|/2019/11/single-image-960x640.jpg" srcset="|!|vcvUploadUrl|!|/2019/11/single-image-320x213.jpg 320w,|!|vcvUploadUrl|!|/2019/11/single-image-480x320.jpg 480w,|!|vcvUploadUrl|!|/2019/11/single-image-800x533.jpg 800w,|!|vcvUploadUrl|!|/2019/11/single-image-960x640.jpg 960w" data-img-src="http://127.0.0.1:8000/wp-content/plugins/builder/elements/singleImage/singleImage/public/single-image.jpg" alt="" title="" /></div></figure></div></div></div></div></div></div></div></div><!--vcv no format-->',
                'post_status' => 'publish',
                'post_title' => 'Unit Test Header',
                'post_name' => 'unit-test-header',
                'meta_input' => [
                    VCV_PREFIX
                    . 'pageContent' => '%7B%22elements%22%3A%7B%2224053598%22%3A%7B%22metaThumbnailUrl%22%3A%22%22%2C%22parent%22%3Afalse%2C%22hidden%22%3Afalse%2C%22name%22%3A%22--%22%2C%22metaPreviewUrl%22%3A%22%22%2C%22order%22%3A0%2C%22metaDescription%22%3A%22%22%2C%22customHeaderTitle%22%3A%22%22%2C%22tag%22%3A%22row%22%2C%22id%22%3A%2224053598%22%7D%2C%22eb5b30ca%22%3A%7B%22size%22%3A%22100%25%22%2C%22designOptionsAdvanced%22%3A%7B%7D%2C%22disableStacking%22%3Afalse%2C%22firstInRow%22%3Atrue%2C%22relatedTo%22%3A%5B%22Column%22%5D%2C%22customClass%22%3A%22%22%2C%22containerFor%22%3A%5B%22General%22%5D%2C%22metaThumbnailUrl%22%3A%22http%3A%2F%2Fvcwb.local%2Fwp-content%2Fuploads%2Fvisualcomposer-assets%2Felements%2F%22%2C%22parent%22%3A%2224053598%22%2C%22hidden%22%3Afalse%2C%22editFormTab1%22%3A%5B%22metaCustomId%22%2C%22customClass%22%5D%2C%22name%22%3A%22Column%22%2C%22metaPreviewUrl%22%3A%22http%3A%2F%2Fvcwb.local%2Fwp-content%2Fuploads%2Fvisualcomposer-assets%2Felements%2F%22%2C%22metaBundlePath%22%3A%22http%3A%2F%2Fvcwb.local%2Fwp-content%2Fuploads%2Fvisualcomposer-assets%2Felements%2Fcolumn%2Fpublic%2Fdist%2Felement.bundle.js%22%2C%22metaAssetsPath%22%3A%22http%3A%2F%2Fvcwb.local%2Fwp-content%2Fuploads%2Fvisualcomposer-assets%2Felements%2Fcolumn%2Fcolumn%2Fpublic%2F%22%2C%22order%22%3A0%2C%22metaEditFormTabs%22%3A%5B%22editFormTab1%22%2C%22designOptionsAdvanced%22%2C%22dividers%22%5D%2C%22metaCustomId%22%3A%22%22%2C%22metaDescription%22%3A%22%22%2C%22assetsLibrary%22%3A%5B%22animate%22%2C%22backgroundSlider%22%2C%22backgroundSimple%22%2C%22backgroundZoom%22%2C%22backgroundColorGradient%22%2C%22backgroundVideoYoutube%22%2C%22backgroundVideoVimeo%22%2C%22backgroundVideoEmbed%22%2C%22parallaxFade%22%2C%22parallaxBackground%22%5D%2C%22backendView%22%3A%22frontend%22%2C%22dividers%22%3A%7B%7D%2C%22customHeaderTitle%22%3A%22%22%2C%22tag%22%3A%22column%22%2C%22id%22%3A%22eb5b30ca%22%2C%22metaElementPath%22%3A%22http%3A%2F%2Fvcwb.local%2Fwp-content%2Fuploads%2Fvisualcomposer-assets%2Felements%2Fcolumn%2Fcolumn%2F%22%2C%22lastInRow%22%3Atrue%7D%2C%2210fd6ab0%22%3A%7B%22metaThumbnailUrl%22%3A%22%22%2C%22parent%22%3A%22eb5b30ca%22%2C%22hidden%22%3Afalse%2C%22name%22%3A%22--%22%2C%22metaPreviewUrl%22%3A%22%22%2C%22order%22%3A0%2C%22metaDescription%22%3A%22%22%2C%22customHeaderTitle%22%3A%22%22%2C%22tag%22%3A%22singleImage%22%2C%22id%22%3A%2210fd6ab0%22%7D%7D%7D',
                    '_' . VCV_PREFIX . '-page-template' => 'blank',
                    '_' . VCV_PREFIX . '-page-template-type' => 'vc',
                    'vcvSourceAssetsFiles' => [
                        'jsBundles' => [
                            'assetsLibrary/faqToggle/dist/faqToggle.bundle.js?v=21.0',
                            'http://127.0.0.1:8000/wp-content/plugins/builder/devElements/faqToggle/faqToggle/public/dist/faqToggle.min.js?ver=20.0',
                        ],
                        'cssBundles' => [
                            'assetsLibrary/imageFilter/dist/imageFilter.bundle.css?v=21.0',
                        ],
                    ],
                ],
            ]
        );
        $this->assertTrue(is_numeric($postId));
        vchelper('PostType')->setupPost($postId);
        $headerPostId = $postId;

        $factory = new WP_UnitTest_Factory_For_Post($this);
        $postId = $factory->create(
            [
                'post_type' => 'post',
                'post_content' => '<!--vcv no format--><div class="vce-row-container"><div class="vce-row vce-row--col-gap-30 vce-row-columns--top vce-row-content--top" id="el-3fb305e5" data-vce-do-apply="all el-3fb305e5"><div class="vce-row-content" data-vce-element-content="true"><div class="vce-col vce-col--md-auto vce-col--xs-1 vce-col--xs-last vce-col--xs-first vce-col--sm-last vce-col--sm-first vce-col--md-last vce-col--lg-last vce-col--xl-last vce-col--md-first vce-col--lg-first vce-col--xl-first" id="el-f41d037d"><div class="vce-col-inner" data-vce-do-apply="border margin background  el-f41d037d"><div class="vce-col-content" data-vce-element-content="true" data-vce-do-apply="padding el-f41d037d"><div class="vce-faq-toggle vce-faq-toggle-color--fff vce-faq-toggle-shape-color--1D64C5 vce-faq-toggle-shape--rounded"><div class="vce-faq-toggle-wrapper vce" id="el-79cdbffe" data-vce-do-apply="margin padding border background  el-79cdbffe"><div class="vce-faq-toggle-inner" data-reactroot=""><div class="vce-faq-toggle-title"><h3 class="vce-faq-toggle-title-text"><i class="vce-faq-toggle-icon"></i>What is frequently asked questions?</h3></div><div class="vce-faq-toggle-text-block"><p>Frequently asked questions (FAQ) or Questions and Answers (Q&amp;A), are listed questions and answers, all supposed to be commonly asked in some context, and pertaining to a particular topic.</p></div></div></div></div></div></div></div></div></div></div><div class="vce-row-container"><div class="vce-row vce-row--col-gap-30 vce-row-columns--top vce-row-content--top" id="el-c8a8c90d" data-vce-do-apply="all el-c8a8c90d"><div class="vce-row-content" data-vce-element-content="true"><div class="vce-col vce-col--md-auto vce-col--xs-1 vce-col--xs-last vce-col--xs-first vce-col--sm-last vce-col--sm-first vce-col--md-last vce-col--lg-last vce-col--xl-last vce-col--md-first vce-col--lg-first vce-col--xl-first" id="el-84196e89"><div class="vce-col-inner" data-vce-do-apply="border margin background  el-84196e89"><div class="vce-col-content" data-vce-element-content="true" data-vce-do-apply="padding el-84196e89"><div class="vce-single-image-container vce-single-image--align-left"><div class="vce vce-single-image-wrapper" id="el-dfb869cf" data-vce-do-apply="all el-dfb869cf"><figure><div class="vce-single-image-inner vce-single-image--absolute" style="padding-bottom: 66.6667%; width: 960px;"><img class="vce-single-image" width="960" height="640"src="|!|vcvUploadUrl|!|/2019/11/single-image-960x640.jpg" srcset="|!|vcvUploadUrl|!|/2019/11/single-image-320x213.jpg 320w,|!|vcvUploadUrl|!|/2019/11/single-image-480x320.jpg 480w,|!|vcvUploadUrl|!|/2019/11/single-image-800x533.jpg 800w,|!|vcvUploadUrl|!|/2019/11/single-image-960x640.jpg 960w" data-img-src="http://127.0.0.1:8000/wp-content/plugins/builder/elements/singleImage/singleImage/public/single-image.jpg" alt="" title="" /></div></figure></div></div></div></div></div></div></div></div><!--vcv no format-->',
                'post_status' => 'publish',
                'post_title' => 'Unit Test Post',
                'post_name' => 'unit-test-post',
                'meta_input' => [
                    VCV_PREFIX
                    . 'pageContent' => '%7B%22elements%22%3A%7B%223fb305e5%22%3A%7B%22columnGap%22%3A%2230%22%2C%22size%22%3A%22auto%22%2C%22contentPosition%22%3A%22top%22%2C%22designOptionsAdvanced%22%3A%7B%7D%2C%22columnBackground%22%3A%22%22%2C%22customClass%22%3A%22%22%2C%22sticky%22%3A%7B%7D%2C%22parent%22%3Afalse%2C%22hidden%22%3Afalse%2C%22layout%22%3A%7B%7D%2C%22boxShadow%22%3A%7B%7D%2C%22rowWidth%22%3A%22boxed%22%2C%22metaAssetsPath%22%3A%22http%3A%2F%2F127.0.0.1:8000%2Fwp-content%2Fplugins%2Fbuilder%2Felements%2Frow%2Frow%2Fpublic%2F%22%2C%22order%22%3A0%2C%22metaCustomId%22%3A%22%22%2C%22removeSpaces%22%3Afalse%2C%22fullHeight%22%3Afalse%2C%22parallax%22%3A%7B%7D%2C%22dividers%22%3A%7B%7D%2C%22metaElementAssets%22%3A%7B%7D%2C%22customHeaderTitle%22%3A%22%22%2C%22tag%22%3A%22row%22%2C%22id%22%3A%223fb305e5%22%2C%22equalHeight%22%3Afalse%2C%22columnPosition%22%3A%22top%22%7D%2C%22f41d037d%22%3A%7B%22size%22%3A%7B%22all%22%3A%22auto%22%2C%22defaultSize%22%3A%22auto%22%7D%2C%22designOptionsAdvanced%22%3A%7B%7D%2C%22firstInRow%22%3A%7B%22all%22%3Atrue%7D%2C%22customClass%22%3A%22%22%2C%22sticky%22%3A%7B%7D%2C%22parent%22%3A%223fb305e5%22%2C%22hidden%22%3Afalse%2C%22boxShadow%22%3A%7B%7D%2C%22metaAssetsPath%22%3A%22http%3A%2F%2F127.0.0.1:8000%2Fwp-content%2Fplugins%2Fbuilder%2Felements%2Fcolumn%2Fcolumn%2Fpublic%2F%22%2C%22order%22%3A0%2C%22metaCustomId%22%3A%22%22%2C%22parallax%22%3A%7B%7D%2C%22dividers%22%3A%7B%7D%2C%22metaElementAssets%22%3A%7B%7D%2C%22customHeaderTitle%22%3A%22%22%2C%22tag%22%3A%22column%22%2C%22id%22%3A%22f41d037d%22%2C%22lastInRow%22%3A%7B%22all%22%3Atrue%7D%7D%2C%2279cdbffe%22%3A%7B%22iconHoverColor%22%3A%22%23e6e6e6%22%2C%22darkTextSkin%22%3Afalse%2C%22designOptions%22%3A%7B%7D%2C%22textBlock%22%3A%22%3Cp%3EFrequently%20asked%20questions%20(FAQ)%20or%20Questions%20and%20Answers%20(Q%26A)%2C%20are%20listed%20questions%20and%20answers%2C%20all%20supposed%20to%20be%20commonly%20asked%20in%20some%20context%2C%20and%20pertaining%20to%20a%20particular%20topic.%3C%2Fp%3E%22%2C%22shape%22%3A%22rounded%22%2C%22shapeColor%22%3A%22%231D64C5%22%2C%22titleText%22%3A%22What%20is%20frequently%20asked%20questions%3F%22%2C%22customClass%22%3A%22%22%2C%22shapeHoverColor%22%3A%22%23164d99%22%2C%22parent%22%3A%22f41d037d%22%2C%22hidden%22%3Afalse%2C%22iconColor%22%3A%22%23fff%22%2C%22metaAssetsPath%22%3A%22http%3A%2F%2F127.0.0.1:8000%2Fwp-content%2Fplugins%2Fbuilder%2FdevElements%2FfaqToggle%2FfaqToggle%2Fpublic%2F%22%2C%22order%22%3A0%2C%22metaCustomId%22%3A%22%22%2C%22metaElementAssets%22%3A%7B%7D%2C%22customHeaderTitle%22%3A%22%22%2C%22tag%22%3A%22faqToggle%22%2C%22id%22%3A%2279cdbffe%22%2C%22customHoverColors%22%3Afalse%2C%22elementTag%22%3A%22h3%22%7D%2C%22c8a8c90d%22%3A%7B%22columnGap%22%3A%2230%22%2C%22size%22%3A%22auto%22%2C%22contentPosition%22%3A%22top%22%2C%22designOptionsAdvanced%22%3A%7B%7D%2C%22columnBackground%22%3A%22%22%2C%22customClass%22%3A%22%22%2C%22sticky%22%3A%7B%7D%2C%22parent%22%3Afalse%2C%22hidden%22%3Afalse%2C%22layout%22%3A%7B%7D%2C%22boxShadow%22%3A%7B%7D%2C%22rowWidth%22%3A%22boxed%22%2C%22metaAssetsPath%22%3A%22http%3A%2F%2F127.0.0.1:8000%2Fwp-content%2Fplugins%2Fbuilder%2Felements%2Frow%2Frow%2Fpublic%2F%22%2C%22order%22%3A1%2C%22metaCustomId%22%3A%22%22%2C%22removeSpaces%22%3Afalse%2C%22fullHeight%22%3Afalse%2C%22parallax%22%3A%7B%7D%2C%22dividers%22%3A%7B%7D%2C%22metaElementAssets%22%3A%7B%7D%2C%22customHeaderTitle%22%3A%22%22%2C%22tag%22%3A%22row%22%2C%22id%22%3A%22c8a8c90d%22%2C%22equalHeight%22%3Afalse%2C%22columnPosition%22%3A%22top%22%7D%2C%2284196e89%22%3A%7B%22size%22%3A%7B%22all%22%3A%22auto%22%2C%22defaultSize%22%3A%22auto%22%7D%2C%22designOptionsAdvanced%22%3A%7B%7D%2C%22firstInRow%22%3A%7B%22all%22%3Atrue%7D%2C%22customClass%22%3A%22%22%2C%22sticky%22%3A%7B%7D%2C%22parent%22%3A%22c8a8c90d%22%2C%22hidden%22%3Afalse%2C%22boxShadow%22%3A%7B%7D%2C%22metaAssetsPath%22%3A%22http%3A%2F%2F127.0.0.1:8000%2Fwp-content%2Fplugins%2Fbuilder%2Felements%2Fcolumn%2Fcolumn%2Fpublic%2F%22%2C%22order%22%3A0%2C%22metaCustomId%22%3A%22%22%2C%22parallax%22%3A%7B%7D%2C%22dividers%22%3A%7B%7D%2C%22metaElementAssets%22%3A%7B%7D%2C%22customHeaderTitle%22%3A%22%22%2C%22tag%22%3A%22column%22%2C%22id%22%3A%2284196e89%22%2C%22lastInRow%22%3A%7B%22all%22%3Atrue%7D%7D%2C%22dfb869cf%22%3A%7B%22designOptions%22%3A%7B%7D%2C%22size%22%3A%22large%22%2C%22shape%22%3A%22square%22%2C%22alignment%22%3A%22left%22%2C%22customClass%22%3A%22%22%2C%22showCaption%22%3Afalse%2C%22parent%22%3A%2284196e89%22%2C%22hidden%22%3Afalse%2C%22metaAssetsPath%22%3A%22http%3A%2F%2F127.0.0.1:8000%2Fwp-content%2Fplugins%2Fbuilder%2Felements%2FsingleImage%2FsingleImage%2Fpublic%2F%22%2C%22order%22%3A0%2C%22metaCustomId%22%3A%22%22%2C%22metaElementAssets%22%3A%7B%7D%2C%22customHeaderTitle%22%3A%22%22%2C%22tag%22%3A%22singleImage%22%2C%22id%22%3A%22dfb869cf%22%2C%22image%22%3A%22single-image.jpg%22%2C%22clickableOptions%22%3A%22%22%7D%7D%7D',
                    '_' . VCV_PREFIX . 'page-template' => 'header-footer-layout',
                    '_' . VCV_PREFIX . 'page-template-type' => 'vc-theme',
                    '_' . VCV_PREFIX . 'HeaderTemplateId' => $headerPostId,
                    '_' . VCV_PREFIX . 'FooterTemplateId' => 'default',
                    'vcvSourceAssetsFiles' => [
                        'jsBundles' => [
                            'assetsLibrary/faqToggle/dist/faqToggle.bundle.js?v=23.0',
                            'http://127.0.0.1:8000/wp-content/plugins/builder/devElements/faqToggle/faqToggle/public/dist/faqToggle.min.js?ver=21.0',
                        ],
                        'cssBundles' => [
                            'assetsLibrary/imageFilter/dist/imageFilter.bundle.css?v=22.0',
                        ],
                    ],
                ],
            ]
        );
        $this->assertTrue(is_numeric($postId));
        vchelper('PostType')->setupPost($postId);

        vchelper('AssetsEnqueue')->addToEnqueueList($headerPostId);
        vchelper('AssetsEnqueue')->addToEnqueueList($postId);

        // @codingStandardsIgnoreStart
        global $wp_scripts, $wp_styles;
        $backupScripts = $wp_scripts;
        $backupStyles = $wp_styles;
        $wp_scripts = new VcCustomForTestWpScripts();
        $wp_styles = new VcCustomForTestWpStyles();
        // @codingStandardsIgnoreEnd

        // Enqueue Assets
        vchelper('AssetsEnqueue')->enqueueAssets($headerPostId);
        vchelper('AssetsEnqueue')->enqueueAssets($postId);

        // @codingStandardsIgnoreLine
        $enqueuedScript = $wp_scripts->enqueuedScripts;
        // @codingStandardsIgnoreLine
        $enqueuedStyle = $wp_styles->enqueuedStyles;

        // Check is asset enqueued
        $this->assertArrayHasKey(
            'vcv:assets:source:scripts:assetslibraryfaqtoggledistfaqtogglebundlejs',
            $enqueuedScript
        );
        $this->assertArrayHasKey(
            'vcv:assets:source:scripts:http1270018000wp-contentpluginsbuilderdevelementsfaqtogglefaqtogglepublicdistfaqtoggleminjs',
            $enqueuedScript
        );
        $this->assertArrayHasKey(
            'vcv:assets:source:styles:assetslibraryimagefilterdistimagefilterbundlecss',
            $enqueuedStyle
        );

        // Check enqueued script and styles count
        $this->assertEquals(
            $enqueuedScript['vcv:assets:source:scripts:assetslibraryfaqtoggledistfaqtogglebundlejs'],
            1
        );

        $this->assertEquals(
            $enqueuedScript['vcv:assets:source:scripts:http1270018000wp-contentpluginsbuilderdevelementsfaqtogglefaqtogglepublicdistfaqtoggleminjs'],
            1
        );

        $this->assertEquals(
            $enqueuedStyle['vcv:assets:source:styles:assetslibraryimagefilterdistimagefilterbundlecss'],
            1
        );

        $enqueueArray =  vchelper('AssetsEnqueue')->getEnqueueList();
        $this->assertContains($headerPostId, $enqueueArray);
        $this->assertContains($postId, $enqueueArray);

        // @codingStandardsIgnoreStart
        $wp_scripts = $backupScripts;
        $wp_styles = $backupStyles;
        // @codingStandardsIgnoreEnd
    }
}
