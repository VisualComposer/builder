<?php

class HelpersEditorTemplatesTest extends WP_UnitTestCase
{
    public function testAll()
    {
        $templatesHelper = vchelper('EditorTemplates');
        $templates = $templatesHelper->all();

        $this->assertTrue(is_array($templates));
    }

    public function testCreate()
    {
        $templatesHelper = vchelper('EditorTemplates');
        $postTypeHelper = vchelper('PostType');
        $postId = $postTypeHelper->create(
            [
                'post_type' => 'vcv_templates',
                'post_content' => 'Test',
            ]
        );
        $this->assertTrue(is_numeric($postId));
        $template = $templatesHelper->get($postId);

        $this->assertTrue(is_object($template));
        $this->assertTrue($template instanceof \WP_Post);
        $this->assertEquals('Test', $template->post_content);
    }
}
