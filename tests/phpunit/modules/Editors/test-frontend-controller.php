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

        // Create test post.
        $this->post = new WP_UnitTest_Factory_For_Post($this);
        $post_id = $this->post->create(array('post_title' => 'Test Post'));
        $requestHelper->setData(['vcv-source-id' => $post_id]);

        ob_start();
        vcapp()->call([$module, 'renderEditorBase']);
        $output = ob_get_contents();
        ob_end_clean();

        $patterns = [
            '<!DOCTYPE html>',
            'window\.vcvSourceID = ' . $post_id . ';',
            'window\.vcvAjaxUrl = \'.+\?vcv-ajax=1\';',
            'window\.vcvNonce = \'.+\';',
            '<iframe src=".+vcv-editable=1&vcv-nonce=.+" id="vcv-editor-iframe"',
            '<\/html>',
        ];

        foreach ($patterns as $pattern) {
            $errorMessage = 'Failed to find `' . $pattern . '` in generated output: "' . $output . '"';
            $this->assertEquals(1, preg_match('/' . $pattern . '/', $output), $errorMessage);
        }
    }

    /**
     * Test for some specific strings/patterns in generated output.
     */
    public function testRenderEditorBaseAction()
    {
        /** @var \VisualComposer\Helpers\Request $requestHelper */
        $requestHelper = vchelper('Request');

        // Create test post.
        $this->post = new WP_UnitTest_Factory_For_Post($this);
        $post_id = $this->post->create(array('post_title' => 'Test Post'));
        $requestHelper->setData(['vcv-source-id' => $post_id]);

        ob_start();
        do_action('vcv:ajax:loader:frontend');
        $output = ob_get_contents();
        ob_end_clean();

        $patterns = [
            '<!DOCTYPE html>',
            'window\.vcvSourceID = ' . $post_id . ';',
            'window\.vcvAjaxUrl = \'.+\?vcv-ajax=1\';',
            'window\.vcvNonce = \'.+\';',
            '<iframe src=".+vcv-editable=1&vcv-nonce=.+" id="vcv-editor-iframe"',
            '<\/html>',
        ];

        foreach ($patterns as $pattern) {
            $errorMessage = 'Failed to find `' . $pattern . '` in generated output: "' . $output . '"';
            $this->assertEquals(1, preg_match('/' . $pattern . '/', $output), $errorMessage);
        }
    }

}
