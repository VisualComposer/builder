<?php

class EditPostLinksControllerTest extends WP_UnitTestCase
{
    public function testAdminBarEditLink()
    {
        wp_set_current_user(1);
        $post = new WP_UnitTest_Factory_For_Post($this);
        $postId = $post->create(['post_title' => 'Test Post']);

        $query = new WP_Query(
            [
                'p' => $postId,
                'posts_per_page' => 1,
            ]
        );
        $backup = $GLOBALS['wp_query'];
        $GLOBALS['wp_query'] = $query;
        $innerLoop = false;
        $argsCallbackCalled = false;
        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $this->assertTrue(is_singular(), 'queried object should be singular');
                $innerLoop = true;

                $wpAdminBar = $this->getMockBuilder('WP_Admin_Bar')->setMethods(['add_menu'])->getMock();
                $wpAdminBar->expects($this->atLeastOnce())->method('add_menu')->will($this->returnValue(true));
                $wpAdminBar->expects($this->atLeastOnce())->method('add_menu')->with(
                    $this->callback(
                        function ($page) use (&$argsCallbackCalled) {
                            $this->assertTrue(is_array($page));

                            if (strpos($page['id'], 'edit') !== false) {
                                $this->assertEquals('Edit with Visual Composer', $page['title']);
                                $this->assertTrue(
                                    strpos($page['href'], 'vcv-action=frontend&vcv-source-id=') !== false
                                );
                            } else {
                                $this->assertEquals('Add New with Visual Composer', $page['title']);
                                $this->assertTrue(
                                    strpos($page['href'], 'vcv-action=frontend') !== false
                                );
                            }
                            $argsCallbackCalled = true;

                            return true;
                        }
                    )
                );

                /** @var \VisualComposer\Modules\Editors\EditPostLinks\Controller $module */
                $module = vc_create_module_mock('\VisualComposer\Modules\Editors\EditPostLinks\Controller');
                $module->call('addEditLinkToAdminBarOnFrontend', ['wpAdminBar' => $wpAdminBar]);
                $module->call('addEditLinkToAdminBarOnAdminArea', ['wpAdminBar' => $wpAdminBar]);
            }
        }
        $GLOBALS['wp_query'] = $backup;
        wp_reset_query();

        $this->assertTrue($innerLoop, 'loop should be triggered');
        $this->assertTrue($argsCallbackCalled, 'args callback should be called');
    }

    public function testAdminRowLinks()
    {
        wp_set_current_user(1);
        /** @var \VisualComposer\Modules\Editors\EditPostLinks\Controller $module */
        $module = vc_create_module_mock('\VisualComposer\Modules\Editors\EditPostLinks\Controller');
        $actions = [];
        $post = new WP_UnitTest_Factory_For_Post($this);
        $postId = $post->create(['post_title' => 'Test Post']);
        $GLOBALS['post'] = get_post($postId);
        /** @see \VisualComposer\Modules\Editors\EditPostLinks\Controller::adminRowLinks */
        $return = $module->call('adminRowLinks', [$actions]);
        $this->assertTrue(is_array($return));
        $this->assertTrue(array_key_exists('edit_vc5', $return));
        $this->assertTrue(strpos($return['edit_vc5'], __('Edit with Visual Composer', 'visualcomposer')) !== false);
        $this->assertTrue(strpos($return['edit_vc5'], '<a href=') !== false);
    }
}
