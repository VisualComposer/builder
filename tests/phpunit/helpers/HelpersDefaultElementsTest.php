<?php

class HelpersDefaultElementsTest extends WP_UnitTestCase
{
    public function testContainDefaultElements()
    {
        $defaultElementsHelper = vchelper('DefaultElements')->all();
        $elementsToRegister = [
            'row',
            'column',
            'textBlock',
            'singleImage',
            'basicButton',
            'googleFontsHeading',
            'youtubePlayer',
            'vimeoPlayer',
            'separator',
            'wpWidgetsCustom',
            'wpWidgetsDefault',
            'shortcode',
            'outlineButton',
            // 36v+
            'facebookLike',
            'flickrImage',
            'instagramImage',
            'googleMaps',
            'heroSection',
            'icon',
            'faqToggle',
            'feature',
            'featureDescription',
            'featureSection',
            'imageGallery',
            'imageMasonryGallery',
            'simpleImageSlider',
            'pinterestPinit',
            'rawHtml',
            'rawJs',
            'separatorIcon',
            'separatorTitle',
            'twitterButton',
            'twitterGrid',
            'twitterTimeline',
            'twitterTweet',
        ];

        $this->assertIsArray($defaultElementsHelper);

        foreach ($elementsToRegister as $el) {
            $this->assertContains($el, $defaultElementsHelper);
        }
    }
}
