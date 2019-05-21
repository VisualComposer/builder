<?php

class HelpersEditorTemplatesTest extends WP_UnitTestCase
{
    public function testAll()
    {
        $user = wp_set_current_user(1);
        $templatesHelper = vchelper('EditorTemplates');
        $templates = $templatesHelper->all();

        $this->assertTrue(is_array($templates));
    }

    public function testCreate()
    {
        wp_set_current_user(1);
        $templatesHelper = vchelper('EditorTemplates');
        $postTypeHelper = vchelper('PostType');
        $postId = $postTypeHelper->create(
            [
                'post_type' => 'vcv_templates',
                'post_content' => 'Test',
            ]
        );
        $this->assertTrue(is_numeric($postId));
        $post = $postTypeHelper->setupPost($postId);
        $template = $templatesHelper->get($postId);
        if (vcvenv('VCV_FT_TEMPLATE_DATA_ASYNC')) {
            unset($template->vcvTemplateElements);
        }
        $this->assertEquals(1, did_action('init'));
        $this->assertTrue(post_type_exists('vcv_templates'));
        $this->assertTrue(is_object($template));
        $this->assertTrue(is_object(get_post_type_object('vcv_templates')));
        $this->assertTrue($template instanceof \WP_Post);
        $this->assertEquals('Test', $template->post_content);
        $this->assertEquals('vcv_templates', $template->post_type);
        $this->assertEquals($post, $template);
    }
}
