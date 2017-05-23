<?php

class HelpersPostTypesTest extends WP_UnitTestCase
{
    public function testCreate()
    {
        wp_set_current_user(1);
        $postTypeHelper = vchelper('PostType');
        $postId = $postTypeHelper->create(
            [
                'post_type' => 'post',
                'post_content' => 'Test',
            ]
        );
        $this->assertTrue(is_numeric($postId));
        $postTypeHelper->setupPost($postId);

        $post = $postTypeHelper->get($postId);

        $this->assertTrue(is_object($post));
        $this->assertTrue($post instanceof \WP_Post);
        $this->assertEquals('Test', $post->post_content);

        $deleteResult = $postTypeHelper->delete($postId);
        $this->assertTrue($deleteResult);
    }

    public function testCreateNegative()
    {
        wp_set_current_user(1);
        $postTypeHelper = vchelper('PostType');
        $postId = $postTypeHelper->create(
            [
                'post_type' => 'post',
                'post_content' => 'Test',
            ]
        );
        $this->assertTrue(is_numeric($postId));

        $this->assertTrue(is_object($postTypeHelper->get($postId)));
        $this->assertFalse(is_object($postTypeHelper->get($postId, 'page')));
        $this->assertTrue(is_object($postTypeHelper->get($postId, 'post')));

        $deleteResult = $postTypeHelper->delete($postId);
        $this->assertTrue($deleteResult);

        $deleteResult = $postTypeHelper->delete($postId);
        $this->assertTrue($deleteResult);
    }

    public function testDeleteNegative()
    {
        wp_set_current_user(1);
        $postTypeHelper = vchelper('PostType');
        $postId = $postTypeHelper->create(
            [
                'post_type' => 'post',
                'post_content' => 'Test',
            ]
        );
        $this->assertTrue(is_numeric($postId));

        $deleteResult = $postTypeHelper->delete($postId, 'page');
        $this->assertFalse($deleteResult);

        $deleteResult = $postTypeHelper->delete($postId, 'post');
        $this->assertTrue($deleteResult);
    }
}
