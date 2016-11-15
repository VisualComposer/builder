<?php

class FrontendControllerTest extends WP_UnitTestCase
{
    /**
     * Test for some specific strings/patterns in generated output.
     */
    public function testRenderEditorBase()
    {
        /** @var $module \VisualComposer\Modules\Editors\Frontend\Controller */
        $module = vc_create_module_mock('\VisualComposer\Modules\Editors\Frontend\Controller');

        /** @var \VisualComposer\Helpers\Request $requestHelper */
        $requestHelper = vchelper('Request');
        wp_set_current_user(1);
        // Create test post.
        $this->post = new WP_UnitTest_Factory_For_Post($this);
        $postId = $this->post->create(['post_title' => 'Test Post']);
        $requestHelper->setData(['vcv-source-id' => $postId]);

        $output = vchelper('Filters')->fire('vcv:ajax:frontend');

        $patterns = [
            '<!DOCTYPE html>',
            'window\.vcvSourceID = ' . $postId . ';',
            'window\.vcvAjaxUrl = \'.+\?vcv-ajax=1\';',
            'window\.vcvNonce = \'.+\';',
            '<iframe class="vcv-layout-iframe"',
            'src=".+vcv-editable=1&vcv-nonce=.+" id="vcv-editor-iframe"',
            '<\/html>',
        ];

        foreach ($patterns as $pattern) {
            $errorMessage = 'Failed to find `' . $pattern . '` in generated output: "' . $output . '"';
            $this->assertEquals(1, preg_match('/' . $pattern . '/', $output), $errorMessage);
        }
    }
}
