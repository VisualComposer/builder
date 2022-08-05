<?php

class PostUpdateTest extends WP_UnitTestCase
{
    public function testGetUpdateablePost()
    {
        wp_set_current_user(1);
        $postId = $this->createPost('megaTest');

        $this->assertIsInt($postId);
        $result = vcfilter('vcv:hub:findUpdatePosts:element/megaTest', [], ['action' => 'element/megaTest']);
        $this->assertEquals([$postId], $result);
    }

    public function testGetRequiredActions()
    {
        wp_set_current_user(1);

        $optionsHelper = vchelper('Options');
        $postId = $this->createPost('megaTest2');
        $optionsHelper->set('hubAction:updatePosts', [$postId]);

        $actions = vcapp(\VisualComposer\Helpers\Hub\Update::class)->getRequiredActions();
        $editableUrl = vcapp(\VisualComposer\Helpers\Frontend::class)->getEditableUrl($postId);
        $expected = [
            'actions' => [],
            'posts' => [
                [
                    'id' => $postId,
                    'editableLink' => $editableUrl,
                    'name' => 'Untitled',
                ],
            ],
        ];

        $this->assertEquals($expected, $actions);
    }

    public function testRenderUpdateFe()
    {
        // Previous test have Post Update action.
        $optionsHelper = vchelper('Options');
        $licenseHelper = vchelper('License');
        $this->assertFalse($optionsHelper->get('bundleUpdateRequired'));
        $optionsHelper = vchelper('Options');
        $postId = $this->createPost('megaTest3');
        vchelper('PostType')->setupPost($postId);
        $optionsHelper->set('hubAction:updatePosts', [$postId]);
        $optionsHelper->set('bundleUpdateRequired', 1);
        $optionsHelper->set('agreeHubTerms', time());
        $actions = vcapp(\VisualComposer\Helpers\Hub\Update::class)->getRequiredActions();
        $this->assertNotEmpty($actions);
        $exceptionCalled = false;
        try {
            ob_start();
            // Should throw phpunit die excetion as UpdateFePage triggers DIE
            vcfilter('vcv:editors:frontend:render', '');
            ob_end_clean();
        } catch (Exception $e) {
            ob_end_clean();
            $exceptionCalled = true;
            $feEditorOutput = $e->getMessage();

            // Now need to check FE variables
            $this->checkEditorVariables($feEditorOutput);
            $this->checkFeEditorVariables($feEditorOutput);
            $this->checkFeEditorBundles($feEditorOutput);

            preg_match_all('/Visual Composer: Update/', $feEditorOutput, $matches);
            $this->assertEquals(1, count($matches[0]), 'Visual Composer: Update');
        }

        $this->assertTrue($exceptionCalled, 'exception called successfully');
        $licenseHelper->setType('');
        $licenseHelper->setKey('');
    }

    public function testRenderUpdateBe()
    {
        wp_set_current_user(1);
        ob_start();
        do_action('admin_menu');
        ob_end_clean();
        // Previous test have Post Update action.
        $optionsHelper = vchelper('Options');
        $this->assertFalse($optionsHelper->get('bundleUpdateRequired'));
        $optionsHelper = vchelper('Options');
        $postId = $this->createPost('testRenderUpdateBe');
        $optionsHelper->set('hubAction:updatePosts', [$postId]);
        $optionsHelper->set('bundleUpdateRequired', 1);
        $actions = vcapp(\VisualComposer\Helpers\Hub\Update::class)->getRequiredActions();
        $this->assertNotEmpty($actions);

        $controller = vc_create_module_mock(\VisualComposer\Modules\Hub\Pages\UpdateBePage::class);
        $controller->call('addPage');
        $page = [
            'slug' => 'vcv-update',
            'title' => __('Update', 'visualcomposer'),
            'layout' => 'dashboard-tab-content-standalone',
            'showTab' => false,
            'isDashboardPage' => true,
            'hideInWpMenu' => false,
            'hideTitle' => true,
            'iconClass' => 'vcv-ui-icon-dashboard-update',
        ];
        $_GET['page'] = 'vcv-update';
        // Since v36
        $page['layout'] = 'dashboard-main-layout';
        $output = $controller->call(
            'renderPage',
            [
                'page' => $page,
                'pages' => [],
            ]
        );
        $this->checkEditorVariables($output);
    }

    protected function createPost($element)
    {
        wp_set_current_user(1);

        $postTypeHelper = vchelper('PostType');

        $postId = $postTypeHelper->create(
            [
                'post_title' => 'Untitled',
                'post_type' => 'post',
                'post_status' => 'publish',
                'post_content' => $element,
                'meta_input' => [
                    VCV_PREFIX
                    . 'pageContent' => '%7B%22elements%22%3A%7B%22b2cae3c8%22%3A%7B%22columnGap%22%3A%2230%22%2C%22size%22%3A%22auto%22%2C%22contentPosition%22%3A%22top%22%2C%22designOptionsAdvanced%22%3A%7B%7D%2C%22columnBackground%22%3A%22%22%2C%22customClass%22%3A%22%22%2C%22sticky%22%3A%7B%7D%2C%22parent%22%3Afalse%2C%22hidden%22%3Afalse%2C%22layout%22%3A%7B%7D%2C%22boxShadow%22%3A%7B%7D%2C%22rowWidth%22%3A%22boxed%22%2C%22metaAssetsPath%22%3A%22http%3A%2F%2F127.0.0.1%3A8000%2Fwp-content%2Fplugins%2Fvisualcomposer%2Felements%2Frow%2Frow%2Fpublic%2F%22%2C%22order%22%3A0%2C%22metaCustomId%22%3A%22%22%2C%22removeSpaces%22%3Afalse%2C%22fullHeight%22%3Afalse%2C%22parallax%22%3A%7B%7D%2C%22dividers%22%3A%7B%7D%2C%22metaElementAssets%22%3A%7B%7D%2C%22customHeaderTitle%22%3A%22%22%2C%22tag%22%3A%22row%22%2C%22id%22%3A%22b2cae3c8%22%2C%22equalHeight%22%3Afalse%2C%22columnPosition%22%3A%22top%22%7D%2C%227e69b963%22%3A%7B%22size%22%3A%7B%22all%22%3A%22auto%22%2C%22defaultSize%22%3A%22auto%22%7D%2C%22designOptionsAdvanced%22%3A%7B%7D%2C%22firstInRow%22%3A%7B%22all%22%3Atrue%7D%2C%22customClass%22%3A%22%22%2C%22sticky%22%3A%7B%7D%2C%22parent%22%3A%22b2cae3c8%22%2C%22hidden%22%3Afalse%2C%22boxShadow%22%3A%7B%7D%2C%22metaAssetsPath%22%3A%22http%3A%2F%2F127.0.0.1%3A8000%2Fwp-content%2Fplugins%2Fvisualcomposer%2Felements%2Fcolumn%2Fcolumn%2Fpublic%2F%22%2C%22order%22%3A0%2C%22metaCustomId%22%3A%22%22%2C%22parallax%22%3A%7B%7D%2C%22dividers%22%3A%7B%7D%2C%22metaElementAssets%22%3A%7B%7D%2C%22customHeaderTitle%22%3A%22%22%2C%22tag%22%3A%22column%22%2C%22id%22%3A%227e69b963%22%2C%22lastInRow%22%3A%7B%22all%22%3Atrue%7D%7D%2C%221f6d6705%22%3A%7B%22darkTextSkin%22%3Afalse%2C%22designOptions%22%3A%7B%7D%2C%22output%22%3A%22%3Ch2%3ETypography%20is%20the%20art%20and%20technique%3C%2Fh2%3E%5Cn%3Cp%3ETypography%20is%20the%20art%20and%20technique%20of%20arranging%20type%20to%20make%20written%20language%20legible%2C%20readable%20and%20appealing%20when%20displayed.%20The%20arrangement%20of%20type%20involves%20selecting%20typefaces%2C%20point%20size%2C%20line%20length%2C%20line-spacing%20(leading)%2C%20letter-spacing%20(tracking)%2C%20and%20adjusting%20the%20space%20within%20letters%20pairs%20(kerning).%3C%2Fp%3E%22%2C%22customClass%22%3A%22%22%2C%22parent%22%3A%227e69b963%22%2C%22hidden%22%3Afalse%2C%22metaAssetsPath%22%3A%22http%3A%2F%2F127.0.0.1%3A8000%2Fwp-content%2Fplugins%2Fvisualcomposer%2Felements%2FtextBlock%2FtextBlock%2Fpublic%2F%22%2C%22order%22%3A0%2C%22metaCustomId%22%3A%22%22%2C%22assetsLibrary%22%3A%5B%22animate%22%5D%2C%22metaElementAssets%22%3A%7B%7D%2C%22customHeaderTitle%22%3A%22%22%2C%22tag%22%3A%22'
                        . $element . '%22%2C%22id%22%3A%221f6d6705%22%7D%7D%7D',
                ],
            ]
        );

        $this->assertIsInt($postId);

        return $postId;
    }

    protected function checkFeEditorVariables($output)
    {
        preg_match_all('/window\.vcvIsPremiumActivated/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'vcvIsPremiumActivated');

        preg_match_all('/window\.vcvGoPremiumUrlWithRef/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'vcvGoPremiumUrlWithRef');

        preg_match_all('/window\.vcvGoPremiumUrl\s\=/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'vcvGoPremiumUrl');

        preg_match_all('/window\.vcvGettingStartedUrl/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'vcvGettingStartedUrl');

        preg_match_all('/Object\.defineProperty\(window, \'VCV_LICENSE_KEY\', {/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'VCV_LICENSE_KEY');

        preg_match_all('/Object\.defineProperty\(window, \'VCV_API_URL\', {/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'VCV_API_URL');

        preg_match_all('/Object\.defineProperty\(window, \'VCV_UTM\', {/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'VCV_UTM');

    }

    protected function checkFeEditorBundles($output) {
        preg_match_all('/\?vcv-script=vendor/', $output, $matches);
        $this->assertEquals(2, count($matches[0]), 'vendor');

        preg_match_all('/public\/dist\/wpVcSettings\.bundle\.css/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'wpVcSettings css');

        preg_match_all('/public\/dist\/wpUpdate\.bundle\.js/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'wpUpdate');
    }

    protected function checkEditorVariables($output)
    {
        preg_match_all('/window\.vcvNonce/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'vcvNonce');

        $adminNonce = vchelper('Nonce')->admin();
        preg_match_all('/ \= [\'|"]' . $adminNonce . '[\'|"]/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'admin vcvNonce');

        preg_match_all('/window\.vcvAjaxUrl/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'vcvAjaxUrl');

        preg_match_all('/window\.vcvAdminAjaxUrl/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'vcvAdminAjaxUrl');

        preg_match_all('/Object\.defineProperty\(window, \'VCV_UPDATE_ACTIONS\', {/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'VCV_UPDATE_ACTIONS');

        preg_match_all('/Object\.defineProperty\(window, \'VCV_UPDATE_PROCESS_ACTION_URL\', {/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'VCV_UPDATE_PROCESS_ACTION_URL');

        preg_match_all('/Object\.defineProperty\(window, \'VCV_UPDATE_SKIP_POST_URL\', {/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'VCV_UPDATE_SKIP_POST_URL');

        preg_match_all('/Object\.defineProperty\(window, \'VCV_UPDATE_WP_BUNDLE_URL\', {/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'VCV_UPDATE_WP_BUNDLE_URL');

        preg_match_all('/Object\.defineProperty\(window, \'VCV_UPDATE_VENDOR_URL\', {/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'VCV_UPDATE_VENDOR_URL');

        preg_match_all('/Object\.defineProperty\(window, \'VCV_UPDATE_GLOBAL_VARIABLES_URL\', {/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'VCV_UPDATE_GLOBAL_VARIABLES_URL');

        preg_match_all('/Object\.defineProperty\(window, \'VCV_PLUGIN_VERSION\', {/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'VCV_PLUGIN_VERSION');

        preg_match_all('/Object\.defineProperty\(window, \'VCV_UPDATE_URL\', {/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'VCV_UPDATE_URL');

        //        preg_match_all('/Object\.defineProperty\(window, \'VCV_PREMIUM_URL\', {/', $output, $matches);
        //        $this->assertEquals(1, count($matches[0]), 'VCV_PREMIUM_URL');

        preg_match_all('/Object\.defineProperty\(window, \'VCV_MANAGE_OPTIONS\', {/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'VCV_MANAGE_OPTIONS');

        preg_match_all('/Object\.defineProperty\(window, \'VCV_ENV\', {/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'VCV_ENV');

        preg_match_all('/Object\.defineProperty\(window, \'VCV_SITE_URL\', {/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'VCV_SITE_URL');

        preg_match_all('/Object\.defineProperty\(window, \'VCV_SLUG\', {/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'VCV_SLUG');
    }
}
