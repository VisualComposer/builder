<?php

class TestPostUpdate extends WP_UnitTestCase
{
    public function testGetUpdateablePost()
    {
        wp_set_current_user(1);
        $postId = $this->createPost('megaTest');

        $this->assertIsInt($postId);
        //         dd(rawurldecode(get_post_meta($postId,  VCV_PREFIX . 'pageContent' , true)));
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
                    'name' => '',
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
        $licenseHelper->setType('free');
        $licenseHelper->setKey('test');
        $this->assertFalse($optionsHelper->get('bundleUpdateRequired'));
        $optionsHelper = vchelper('Options');
        $postId = $this->createPost('megaTest3');
        vchelper('PostType')->setupPost($postId);
        $optionsHelper->set('hubAction:updatePosts', [$postId]);
        $optionsHelper->set('bundleUpdateRequired', 1);
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

            preg_match_all('/Visual Composer Post Update/', $feEditorOutput, $matches);
            $this->assertEquals(1, count($matches[0]), 'Visual Composer Post Update');
        }

        $this->assertTrue($exceptionCalled);
        $licenseHelper->setType('');
        $licenseHelper->setKey('');
    }

    public function testRenderUpdateBe()
    {
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
        $page = [
            'slug' => 'vcv-update',
            'title' => __('Update', 'visualcomposer'),
            'showTab' => false,
            'layout' => 'standalone',
        ];
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

        preg_match_all('/window\.vcvIsFreeActivated/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'vcvIsFreeActivated');

        preg_match_all('/window\.vcvGoPremiumUrl/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'vcvGoPremiumUrl');

        preg_match_all('/window\.vcvGettingStartedUrl/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'vcvGettingStartedUrl');

        preg_match_all('/window\.vcvIsAnyActivated/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'vcvIsAnyActivated');

        preg_match_all('/window\.vcvUpgradeUrl \=/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'vcvUpgradeUrl');

        preg_match_all('/window\.vcvUpgradeUrlUnsplash/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'vcvUpgradeUrlUnsplash');

        preg_match_all('/Object\.defineProperty\(window, \'VCV_LICENSE_KEY\', {/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'VCV_LICENSE_KEY');

        preg_match_all('/Object\.defineProperty\(window, \'VCV_API_URL\', {/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'VCV_API_URL');

        preg_match_all('/Object\.defineProperty\(window, \'VCV_UTM\', {/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'VCV_UTM');

        preg_match_all('/public\/dist\/wpVcSettings\.bundle\.css/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'wpVcSettings css');

        preg_match_all('/public\/dist\/vendor\.bundle\.js/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'vendor');

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

        preg_match_all('/Object\.defineProperty\(window, \'VCV_CREATE_NEW_URL\', {/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'VCV_CREATE_NEW_URL');

        preg_match_all('/Object\.defineProperty\(window, \'VCV_CREATE_NEW_TEXT\', {/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'VCV_CREATE_NEW_TEXT');

        preg_match_all('/Object\.defineProperty\(window, \'VCV_PREMIUM_URL\', {/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'VCV_PREMIUM_URL');

        preg_match_all('/Object\.defineProperty\(window, \'VCV_GO_PREMIUM_URL\', {/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'VCV_GO_PREMIUM_URL');

        preg_match_all('/Object\.defineProperty\(window, \'VCV_MANAGE_OPTIONS\', {/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'VCV_MANAGE_OPTIONS');

        preg_match_all('/Object\.defineProperty\(window, \'VCV_ACTIVATE_FREE_URL\', {/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'VCV_ACTIVATE_FREE_URL');

        preg_match_all('/Object\.defineProperty\(window, \'VCV_ENV\', {/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'VCV_ENV');

        preg_match_all('/Object\.defineProperty\(window, \'VCV_SITE_URL\', {/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'VCV_SITE_URL');

        preg_match_all('/Object\.defineProperty\(window, \'VCV_SLUG\', {/', $output, $matches);
        $this->assertEquals(1, count($matches[0]), 'VCV_SLUG');

        //       window.vcvAjaxUrl = '?vcv-ajax=1';
        //       window.vcvAdminAjaxUrl = 'http://localhost/wp-admin/admin-ajax.php?vcv-admin-ajax=1&action=vcv-admin-ajax';

        //     window.vcvIsPremiumActivated = false;
        //     window.vcvGoPremiumUrl = "http:\/\/localhost\/wp-admin\/admin.php?page=vcv-go-premium";
        //     window.vcvGettingStartedUrl = "http:\/\/localhost\/wp-admin\/admin.php?page=vcv-getting-started&vcv-ref=logoFrontend";
        //     window.vcvIsAnyActivated = false;
        //     window.vcvUpgradeUrl = "http:\/\/localhost\/wp-admin\/admin.php?page=vcv-getting-started&vcv-ref=hub-banner";
        //     window.vcvUpgradeUrlUnsplash = "http:\/\/localhost\/wp-admin\/admin.php?page=vcv-getting-started&vcv-ref=unsplash";
        //           Object.defineProperty(window, 'VCV_ERROR_REPORT_URL', {

        /*
          if(typeof window['VCV_UPDATE_ACTIONS'] === 'undefined') {
          Object.defineProperty(window, 'VCV_UPDATE_ACTIONS', {
            value: function () {
              return {"actions":[],"posts":[{"id":648,"editableLink":"http:\/\/localhost\/?p=648&vcv-editable=1&vcv-source-id=648&vcv-nonce=f1447aa3ca","name":""}]} },
            writable: false
          });
        }
         */

        //           Object.defineProperty(window, 'VCV_UPDATE_PROCESS_ACTION_URL', {

        //          Object.defineProperty(window, 'VCV_UPDATE_SKIP_POST_URL', {
        //           Object.defineProperty(window, 'VCV_UPDATE_WP_BUNDLE_URL', {
        //           Object.defineProperty(window, 'VCV_UPDATE_VENDOR_URL', {
        //           Object.defineProperty(window, 'VCV_UPDATE_GLOBAL_VARIABLES_URL', {
        //           Object.defineProperty(window, 'VCV_PLUGIN_VERSION', {
        //           Object.defineProperty(window, 'VCV_UPDATE_URL', {
        //           Object.defineProperty(window, 'VCV_CREATE_NEW_URL', {
        //           Object.defineProperty(window, 'VCV_CREATE_NEW_TEXT', {
        //           Object.defineProperty(window, 'VCV_PREMIUM_URL', {
        //           Object.defineProperty(window, 'VCV_GO_PREMIUM_URL', {
        //           Object.defineProperty(window, 'VCV_MANAGE_OPTIONS', {

        //           Object.defineProperty(window, 'VCV_ACTIVATE_FREE_URL', {

        /*
         Object.defineProperty(window, 'VCV_ENV', {
            value: function () {
              return {"VCV_ENV_DEV_ADDONS":true,"VCV_DEBUG":true,"VCV_ENV_DEV_ELEMENTS":true,"VCV_JS_SAVE_ZIP":false,"VCV_ENV_ADDONS_ID":"account","VCV_ENV_HUB_DOWNLOAD":true,"VCV_ENV_EXTENSION_DOWNLOAD":true,"VCV_HUB_URL":"https:\/\/my.visualcomposer.com\/","VCV_TOKEN_URL":"https:\/\/my.visualcomposer.com\/authorization-token","VCV_PREMIUM_TOKEN_URL":"https:\/\/my.visualcomposer.com\/\/authorization-token","VCV_API_URL":"https:\/\/api.visualcomposer.com","VCV_ACTIVATE_LICENSE_URL":"https:\/\/my.visualcomposer.com\/?edd_action=activate_license&item_name=Visual%20Composer","VCV_FIX_CURL_JSON_DOWNLOAD":false,"VCV_TF_ASSETS_URLS_FACTORY_RESET":true,"VCV_ENV_ELEMENTS_FILES_NOGLOB":false,"VCV_TF_BLANK_PAGE_BOXED":true,"VCV_FT_INITIAL_CSS_LOAD":true,"VCV_TF_CSS_CHECKSUM":true,"VCV_FT_TEMPLATE_DATA_ASYNC":true,"VCV_FT_ASSETS_INSIDE_PLUGIN":true,"VCV_FT_DEFAULT_ELEMENTS_INSIDE_PLUGIN":true,"VCV_ENV_FT_SYSTEM_CHECK_LIST":true,"VCV_ENV_FT_GLOBAL_CSS_JS_SETTINGS":true,"VCV_JS_THEME_LAYOUTS":false,"VCV_JS_THEME_EDITOR":false,"VCV_JS_ARCHIVE_TEMPLATE":false,"VCV_JS_FT_ROW_COLUMN_LOGIC_REFACTOR":false,"VCV_JS_FT_DYNAMIC_FIELDS":true,"VCV_ACCOUNT_URL":"https:\/\/account.visualcomposer.io"} },
            writable: false
          });
         */

        //           Object.defineProperty(window, 'VCV_SITE_URL', {

        //           Object.defineProperty(window, 'VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT', {
        //           Object.defineProperty(window, 'VCV_HUB_GET_ADDONS', {

        //           Object.defineProperty(window, 'VCV_LICENSE_KEY', {

        //           Object.defineProperty(window, 'VCV_API_URL', {

        //           Object.defineProperty(window, 'VCV_SLUG', {

        //     Object.defineProperty(window, 'VCV_UTM', {

        // 		<link rel="stylesheet" href="http://localhost/wp-content/plugins/builder/public/dist/wpUpdate.bundle.css?v=dev"></link><script id="vcv-script-vendor-bundle-update" type="text/javascript" src="http://localhost/wp-content/plugins/builder/public/dist/vendor.bundle.js?v=dev"></script><script id="vcv-script-wpUpdate-bundle-update" type="text/javascript" src="http://localhost/wp-content/plugins/builder/public/dist/wpUpdate.bundle.js?v=dev"></script></body>
    }
}
