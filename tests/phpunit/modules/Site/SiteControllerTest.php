<?php

class SiteControllerTest extends \WP_UnitTestCase
{
    public function setUp(): void
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
        $GLOBALS['post'] = $post;
        $link = apply_filters('edit_post_link', '', $postId, '');
        $pattern = '/' . __('Edit with Visual Composer', 'visualcomposer') . '/';
        $this->assertEquals(1, preg_match($pattern, $link), 'matches of output:' . $link);
        $requestHelper->setData([]);
    }
}
