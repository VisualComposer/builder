<?php

class FrontendControllerTest extends WP_UnitTestCase
{
    public function setUp(): void
    {
        parent::setUp();
        foreach (get_editable_roles() as $roleKey => $roleData) {
            foreach ($roleData['capabilities'] as $capabilityKey => $capabilityValue) {
                if (strpos($capabilityKey, 'vcv_access_rules__') !== false) {
                    get_role($roleKey)->remove_cap($capabilityKey);
                }
            }
        }
        $user = wp_set_current_user(1);
        $user->remove_all_caps();
        $user->set_role('administrator');
        vcevent('vcv:migration:enabledPostTypesMigration');
    }

    public function testEditorCapabilities()
    {
        wp_set_current_user(1);
        $post = new WP_UnitTest_Factory_For_Post($this);
        $postId = $post->create(['post_title' => 'Test Post']);
        $this->assertTrue(current_user_can('edit_post', $postId), 'current_user_can');
        $this->assertFalse(vchelper('AccessUserCapabilities')->isEditorEnabled('any_post_type'), 'is editor enabled');

        // Enable any post type
        vchelper('AccessRole')->who('administrator')->part('post_types')->setCapRule('edit_' . 'any_post_type', true);
        vchelper('AccessRole')->who('administrator')->part('post_types')->setCapRule('edit_' . 'post', true);
        // todo: check why not working
        //        $this->assertTrue(vchelper('AccessUserCapabilities')->isEditorEnabled('any_post_type'), 'is editor enabled');
        //        $this->assertTrue(vchelper('AccessUserCapabilities')->isEditorEnabled('post'), 'is editor enabled');
        //        $this->assertTrue(vchelper('AccessUserCapabilities')->canEdit($postId), 'canEdit');
    }

    public function testEditorCapabilitiesSetupPost()
    {
        wp_set_current_user(1);
        $postFactory = new WP_UnitTest_Factory_For_Post($this);
        $postId = $postFactory->create(['post_title' => 'Test Post']);
        $post = get_post($postId);
        $this->assertTrue(
            isset($post->post_type) && post_type_exists($post->post_type)
            && vchelper('AccessCurrentUser')->wpAll(
                [get_post_type_object($post->post_type)->cap->read, $post->ID]
            )->get()
        );

        $this->assertIsObject(vchelper('PostType')->setupPost($postId));
    }

    /**
     * Test for some specific strings/patterns in generated output.
     */
    public function testRenderEditorBase()
    {
        wp_set_current_user(1);

        /** @var $module \VisualComposer\Modules\Editors\Frontend\Controller */
        $module = vc_create_module_mock('\VisualComposer\Modules\Editors\Frontend\Controller');

        /** @var \VisualComposer\Helpers\Request $requestHelper */
        $requestHelper = vchelper('Request');
        // Create test post.
        $this->post = new WP_UnitTest_Factory_For_Post($this);
        $postId = $this->post->create(['post_title' => 'Test Post']);
        $requestHelper->setData(['vcv-source-id' => $postId]);
        vchelper('PostType')->setupPost($postId);
        vchelper('Options')->set('bundleUpdateRequired', false);
        $output = vchelper('Filters')->fire('vcv:editors:frontend:render');

        $patterns = [
            '<!DOCTYPE html>',
            'window\.vcvSourceID = ' . $postId . ';',
            'window\.vcvAjaxUrl = ".+[\?|\&]vcv-ajax=1";',
            'window\.vcvNonce = ".+";',
            'window\.vcvIsPremiumActivated',
            '<iframe class="vcv-layout-iframe"',
            'src=".+vcv-editable=1&vcv-source-id=' . $postId . '&vcv-nonce=.+" id="vcv-editor-iframe"',
            '\<title\>Frontend editor:',
            'Object\.defineProperty\(window, \\\'VCV_GET_SHARED_ASSETS\\\'',
            'Object\.defineProperty\(window, \\\'VCV_UTM\\\'',
            'Object\.defineProperty\(window, \\\'VCV_HUB_GET_ADDONS\\\'',
            'Object\.defineProperty\(window, \\\'VCV_HUB_GET_ELEMENTS\\\'',
            'Object\.defineProperty\(window, \\\'VCV_HUB_GET_TEASER\\\'',
            'Object\.defineProperty\(window, \\\'VCV_PLUGIN_UPDATE\\\'',
            'Object\.defineProperty\(window, \\\'VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT\\\'',
            'Object\.defineProperty\(window, \\\'VCV_PAGE_TEMPLATES_LAYOUTS\\\'',
            'Object\.defineProperty\(window, \\\'VCV_PAGE_TEMPLATES_LAYOUTS_THEME\\\'',
            'Object\.defineProperty\(window, \\\'VCV_HUB_GET_TEMPLATES_TEASER\\\'',
            'Object\.defineProperty\(window, \\\'VCV_HUB_GET_ADDON_TEASER\\\'',
            'Object\.defineProperty\(window, \\\'VCV_HUB_GET_CATEGORIES\\\'',
            'Object\.defineProperty\(window, \\\'VCV_HUB_GET_GROUPS\\\'',
            'class="vcv-layout-iframe-overlay" id="vcv-editor-iframe-overlay"',
            'class="vcv-layout-iframe-content" id="vcv-layout-iframe-content"',
            '<\/html>',
        ];

        foreach ($patterns as $pattern) {
            $errorMessage = 'Failed to find `' . $pattern . '` in generated output: "' . $output . '"';
            $this->assertEquals(1, preg_match('/' . $pattern . '/', $output), $errorMessage);
        }
        $this->assertContains('vcv:assets:runtime:script', wp_scripts()->done);
        $this->assertContains('vcv:assets:vendor:script', wp_scripts()->done);
        $this->assertContains('vcv:editors:frontend:script', wp_scripts()->done);

        $this->assertTrue(wp_style_is('vcv:editors:frontend:vendor', 'done'));
        $this->assertTrue(wp_style_is('vcv:editors:frontend:style', 'done'));
    }
}
