<?php

class ContentUrlReplaceTest extends \WP_UnitTestCase
{
    public function testSiteUrlRegister()
    {
        $siteUrl = get_site_url();
        $siteUrls = vchelper('Options')->get('siteUrls');
        $this->assertEquals(['prevUrls' => [], 'currentUrl' => $siteUrl], $siteUrls);

        // Emulate multiple different siteUrls
        $additionalSiteUrls = ['https://dev.local', 'http://test.local', 'http://dev.local'];
        foreach ($additionalSiteUrls as $url) {
            $callback = function () use ($url) {
                return $url;
            };

            add_filter('site_url', $callback);
            // Trigger register
            $this->triggerRegisterUrl();
            remove_filter('site_url', $callback);
        }

        // check is site urls was registered
        $siteUrls = vchelper('Options')->get('siteUrls');
        $this->assertEquals(
            [
                'prevUrls' => [$siteUrl, 'https://dev.local', 'http://test.local'],
                'currentUrl' => $additionalSiteUrls[ count($additionalSiteUrls) - 1 ],
            ],
            $siteUrls
        );

        // Trigger original siteUrl
        $this->triggerRegisterUrl();
        $siteUrls = vchelper('Options')->get('siteUrls');
        $this->assertEquals(
            [
                'prevUrls' => $additionalSiteUrls,
                'currentUrl' => $siteUrl,
            ],
            $siteUrls
        );
        $this->checkUrlReplace();
    }

    public function checkUrlReplace()
    {
        $siteUrls = vchelper('Options')->get('siteUrls');
        /*
          array (
             'prevUrls' =>
             array (
               0 => 'https://dev.local',
               1 => 'http://test.local',
               2 => 'http://dev.local',
             ),
             'currentUrl' => 'http://localhost',
           ),
          */
        $postTypeHelper = vchelper('PostType');
        wp_set_current_user(1);
        $postContent = sprintf(
            'This is test content to be replaced (urls)
                <img src="%s/test.jpg" />
                <img src="%s/test2.jpg" />
                <img src="%s/test3.jpg" />
                <img src="%s/test4.jpg" />
                ',
            get_site_url(), // http://localhost
            'https://dev.local',
            'http://dev.local',
            'http://test.local'
        );
        $postId = $postTypeHelper->create(
            [
                'post_type' => 'page',
                'post_content' => $postContent,
                'meta_input' => [
                    'vcv-pageContent' => 'not-empty',
                ],
            ]
        );
        $this->assertTrue(is_numeric($postId));
        $this->assertTrue($postId > 0);
        $postTypeHelper->setupPost($postId);

        vchelper('Options')->set('settingsResetInitiated', time());
        $content = vcfilter('vcv:frontend:content', get_post($postId)->post_content);

        $this->assertEquals(
            sprintf(
                'This is test content to be replaced (urls)
                <img src="%s/test.jpg" />
                <img src="%s/test2.jpg" />
                <img src="%s/test3.jpg" />
                <img src="%s/test4.jpg" />
                ',
                get_site_url(), // http://localhost
                get_site_url(), // http://localhost
                get_site_url(), // http://localhost
                get_site_url() // http://localhost
            ),
            $content
        );
        vchelper('Options')->delete('settingsResetInitiated');
    }

    protected function triggerRegisterUrl()
    {
        $initListeners = vchelper('Events')->getListeners('vcv:inited');
        foreach ($initListeners as $listener) {
            $listenerHash = print_r($listener, true);
            if (strpos($listenerHash, 'VisualComposer\Modules\FrontView\ContentUrlReplaceController') !== false) {
                $listener();
            }
        }
    }
}
