<?php

class SiteControllerTest extends \WP_UnitTestCase
{
    public function testAppendScript()
    {
        /** @var $module \VisualComposer\Modules\Site\Controller */
        $module = vcapp('SiteController');
        /** @see \VisualComposer\Modules\Site\Controller::appendScript */
        $output = vcapp()->call([$module, 'appendScript']);

        $pattern = '/<script src=".+node_modules\/less\/dist\/less.js" data-async="true"><\/script>/';

        $this->assertEquals(1, preg_match($pattern, $output), 'macthes of output: ' . $output);
    }

    public function testEditPostLink()
    {
        /** @var \VisualComposer\Helpers\Request $requestHelper */
        $requestHelper = vchelper('Request');

        // Create test post.
        /** @var WP_UnitTest_Factory_For_Post $post */
        $post = new WP_UnitTest_Factory_For_Post($this);
        $postId = $post->create(['post_title' => 'Test Post']);
        $requestHelper->setData(['vcv-action' => 'vcv-editable', 'vcv-source-id' => $postId]);

        wp_set_current_user(1);
        $link = apply_filters('edit_post_link', '');
        $pattern = '/' . __('Edit with VC5', 'vc5') . '/';
        $this->assertEquals(1, preg_match($pattern, $link), 'matches of output:' . $link);
        $requestHelper->setData([]);
    }
}
