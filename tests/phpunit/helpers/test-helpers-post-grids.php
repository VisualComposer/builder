<?php

class HelpersPostGridsTest extends WP_UnitTestCase
{
    public function testParseTemplate()
    {
        wp_set_current_user(1);
        $postTypeHelper = vchelper('PostType');
        $gridItemTemplateHelper = vchelper('GridItemTemplate');
        $postId = $postTypeHelper->create(
            [
                'post_type' => 'post',
                'post_content' => 'Test',
            ]
        );
        $this->assertTrue(is_numeric($postId));
        $postTypeHelper->setupPost($postId);
        $post = $postTypeHelper->get($postId);
        vchelper('Filters')->listen(
            'vcv:elements:grid_item_template:variable:test_template',
            function ($response, $payload) {
                return 'Hello!';
            }
        );
        $result = $gridItemTemplateHelper->parseTemplate('{{test_template}}', $post);
        $this->assertEquals('Hello!', $result);
    }

    public function testParseTemplateArguments()
    {
        wp_set_current_user(1);
        $postTypeHelper = vchelper('PostType');
        $gridItemTemplateHelper = vchelper('GridItemTemplate');
        $postId = $postTypeHelper->create(
            [
                'post_type' => 'post',
                'post_content' => 'Test',
            ]
        );
        $this->assertTrue(is_numeric($postId));
        $postTypeHelper->setupPost($postId);
        $post = $postTypeHelper->get($postId);
        vchelper('Filters')->listen(
            'vcv:elements:grid_item_template:variable:test_template_args',
            function ($response, $payload) {
                return sprintf("Hello2!<%s>", $payload['value']);
            }
        );
        $result = $gridItemTemplateHelper->parseTemplate(
            '{{test_template_args:something}} {{test_template_args:something2}}',
            $post
        );
        $this->assertEquals('Hello2!<something> Hello2!<something2>', $result);
    }

    public function testParseTemplateArgumentsAdvanced()
    {
        wp_set_current_user(1);
        $postTypeHelper = vchelper('PostType');
        $gridItemTemplateHelper = vchelper('GridItemTemplate');
        $postId = $postTypeHelper->create(
            [
                'post_type' => 'post',
                'post_content' => 'Test',
            ]
        );
        $this->assertTrue(is_numeric($postId));
        $postTypeHelper->setupPost($postId);
        $post = $postTypeHelper->get($postId);
        vchelper('Filters')->listen(
            'vcv:elements:grid_item_template:variable:test_template_args',
            function ($response, $payload) {
                $value = rawurldecode($payload['value']);
                $value = json_decode($value, true);

                return sprintf("Hello3!<%s>", $value['iconColor']);
            }
        );
        $result = $gridItemTemplateHelper->parseTemplate(
            '{{test_template_args:%7B%22iconColor%22%3A%22rgba(%2010%2C%20120%2C%2010%2C%200.3)%22%7D}}',
            $post
        );
        $this->assertEquals('Hello3!<rgba( 10, 120, 10, 0.3)>', $result);
    }
}
