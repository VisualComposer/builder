<?php

class HelpersPostTypesTest extends WP_UnitTestCase
{
    public function testCreate()
    {
        $postTypeHelper = vchelper('PostType');
        $postId = $postTypeHelper->create(
            [
                'post_type' => 'post',
                'post_content' => 'Test',
            ]
        );
        $this->assertTrue(is_numeric($postId));
        $post = $postTypeHelper->get($postId);

        $this->assertTrue(is_object($post));
        $this->assertTrue($post instanceof \WP_Post);
        $this->assertEquals('Test', $post->post_content);

        $deleteResult = $postTypeHelper->delete($postId);
        $this->assertTrue(is_array($deleteResult), print_r($deleteResult, true));
    }

    public function testCreateNegative()
    {
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
        $this->assertTrue(is_array($deleteResult), print_r($deleteResult, true));

        $deleteResult = $postTypeHelper->delete($postId);
        $this->assertFalse(is_array($deleteResult), print_r($deleteResult, true));
    }

    public function testDeleteNegative()
    {
        $postTypeHelper = vchelper('PostType');
        $postId = $postTypeHelper->create(
            [
                'post_type' => 'post',
                'post_content' => 'Test',
            ]
        );
        $this->assertTrue(is_numeric($postId));

        $deleteResult = $postTypeHelper->delete($postId, 'page');
        $this->assertFalse(is_array($deleteResult), print_r($deleteResult, true));

        $deleteResult = $postTypeHelper->delete($postId, 'post');
        $this->assertTrue(is_array($deleteResult), print_r($deleteResult, true));
    }
}
