<?php

class SiteControllerTest extends \WP_UnitTestCase
{
    public function setUp()
    {
        parent::setUp();
        foreach (get_editable_roles() as $roleKey => $roleData) {
            foreach ($roleData['capabilities'] as $capabilityKey => $capabilityValue) {
                if (strpos($capabilityKey, 'vcv:') !== false) {
                    get_role($roleKey)->remove_cap($capabilityKey);
                }
            }
        }
        $user = wp_set_current_user(1);
        $user->remove_all_caps();
        $user->set_role('administrator');
    }

//    public function testAppendScript()
//    {
//        /** @var $module \VisualComposer\Modules\Site\Controller */
//        $module = vcapp('SiteController');
//        /** @see \VisualComposer\Modules\Site\Controller::appendScript */
//        $output = vcapp()->call([$module, 'appendScript']);
//
//        $pattern = '/<script src=".+node_modules\/less\/dist\/less.js" data-async="true"><\/script>/';
//
//        $this->assertEquals(1, preg_match($pattern, $output), 'macthes of output: ' . $output);
//    }

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
        $pattern = '/' . __('Edit with Visual Composer', 'vc5') . '/';
        $this->assertEquals(1, preg_match($pattern, $link), 'matches of output:' . $link);
        $requestHelper->setData([]);
    }

//    public function testEnqueueScripts()
//    {
//        /** @var $module \VisualComposer\Modules\Site\Controller */
//        $module = vcapp('SiteController');
//        /** @see \VisualComposer\Modules\Site\Controller::enqueueScripts */
//        $wp_scripts = wp_scripts();
//        $this->assertFalse(array_search('jquery', $wp_scripts->queue) !== false);
//        vcapp()->call([$module, 'enqueueScripts']);
//        $this->assertTrue(array_search('jquery', $wp_scripts->queue) !== false);
//    }
}
