<?php

class FrontendControllerTest extends WP_UnitTestCase
{
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
        $this->assertContains('vcv:assets:front:script', wp_scripts()->done);
        $this->assertContains('vcv:assets:runtime:script', wp_scripts()->done);
        $this->assertContains('vcv:assets:vendor:script', wp_scripts()->done);
        $this->assertContains('vcv:editors:frontend:script', wp_scripts()->done);
    }
}
