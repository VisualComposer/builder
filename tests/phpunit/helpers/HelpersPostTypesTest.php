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

    public function testQueryUnauthorized()
    {
        wp_set_current_user(1);
        $postTypeHelper = vchelper('PostType');
        $postId = $postTypeHelper->create(
            [
                'post_title' => 'test1',
                'post_type' => 'post',
                'post_content' => 'Test',
                'post_status' => 'draft',
                'meta_input' => [
                    'vcv-test-unauthorized' => 1,
                ],
            ]
        );
        $postId2 = $postTypeHelper->create(
            [
                'post_title' => 'test2',
                'post_type' => 'post',
                'post_content' => 'Test',
                'post_status' => 'publish',
                'meta_input' => [
                    'vcv-test-unauthorized' => 1,
                ],
            ]
        );
        $postId3 = $postTypeHelper->create(
            [
                'post_title' => 'test3',
                'post_type' => 'post',
                'post_content' => 'Test',
                'post_status' => 'private',
                'meta_input' => [
                    'vcv-test-unauthorized' => 1,
                ],
            ]
        );

        $posts = $postTypeHelper->query('post_type=post&meta_key=vcv-test-unauthorized');
        $this->assertTrue(is_array($posts));
        $this->assertTrue(!empty($posts));
        $this->assertEquals(1, count($posts));

        wp_set_current_user(0);
        $posts = $postTypeHelper->query('post_type=post&meta_key=vcv-test-unauthorized');
        $this->assertTrue(is_array($posts));
        $this->assertTrue(!empty($posts));
        $this->assertEquals(1, count($posts));

        wp_set_current_user(0);
        $posts = $postTypeHelper->query('post_type=post&meta_key=vcv-test-unauthorized&post_status=publish,draft');
        $this->assertTrue(is_array($posts));
        $this->assertTrue(!empty($posts));
        $this->assertEquals(2, count($posts));
    }

    public function testQueryTemplatesUnauthorized()
    {
        wp_set_current_user(1);
        $postTypeHelper = vchelper('PostType');
        $postId = $postTypeHelper->create(
            [
                'post_title' => 'test1',
                'post_type' => 'vcv_templates',
                'post_content' => 'Test',
                'post_status' => 'draft',
                'meta_input' => [
                    'vcv-test-templates-unauthorized' => 1,
                ],
            ]
        );
        $postId2 = $postTypeHelper->create(
            [
                'post_title' => 'test2',
                'post_type' => 'vcv_templates',
                'post_content' => 'Test',
                'post_status' => 'publish',
                'meta_input' => [
                    'vcv-test-templates-unauthorized' => 1,
                ],
            ]
        );
        $postId3 = $postTypeHelper->create(
            [
                'post_title' => 'test3',
                'post_type' => 'vcv_templates',
                'post_content' => 'Test',
                'post_status' => 'private',
                'meta_input' => [
                    'vcv-test-templates-unauthorized' => 1,
                ],
            ]
        );

        $posts = $postTypeHelper->query('post_type=vcv_templates&meta_key=vcv-test-templates-unauthorized');
        $this->assertTrue(is_array($posts));
        $this->assertTrue(!empty($posts));
        $this->assertEquals(1, count($posts));

        wp_set_current_user(0);
        $posts = $postTypeHelper->query('post_type=vcv_templates&meta_key=vcv-test-templates-unauthorized');
        $this->assertTrue(is_array($posts));
        $this->assertTrue(!empty($posts));
        $this->assertEquals(1, count($posts));

        wp_set_current_user(0);
        $posts = $postTypeHelper->query(
            'post_type=vcv_templates&meta_key=vcv-test-templates-unauthorized&post_status=publish,draft'
        );
        $this->assertTrue(is_array($posts));
        $this->assertTrue(!empty($posts));
        $this->assertEquals(2, count($posts));
    }

    public function testQueryTemplatesSearchUnauthorized()
    {
        wp_set_current_user(1);
        $postTypeHelper = vchelper('PostType');
        $postId = $postTypeHelper->create(
            [
                'post_title' => 'templates-1-testQueryTemplatesSearchUnauthorized',
                'post_type' => 'vcv_templates',
                'post_content' => 'Test',
                'post_status' => 'draft',
                'meta_input' => [
                    'vcv-test-templates-search-unauthorized' => 1,
                ],
            ]
        );
        $postId2 = $postTypeHelper->create(
            [
                'post_title' => 'templates-2-testQueryTemplatesSearchUnauthorized',
                'post_type' => 'vcv_templates',
                'post_content' => 'Test',
                'post_status' => 'publish',
                'meta_input' => [
                    'vcv-test-templates-search-unauthorized' => 1,
                ],
            ]
        );
        $postId3 = $postTypeHelper->create(
            [
                'post_title' => 'templates-3-testQueryTemplatesSearchUnauthorized',
                'post_type' => 'vcv_templates',
                'post_content' => 'Test',
                'post_status' => 'private',
                'meta_input' => [
                    'vcv-test-templates-search-unauthorized' => 1,
                ],
            ]
        );

        $posts = $postTypeHelper->query('post_type=any&s=testQueryTemplatesSearchUnauthorized');
        $this->assertTrue(is_array($posts));
        $this->assertEquals(0, count($posts));

        wp_set_current_user(0);
        $posts = $postTypeHelper->query('post_type=any&s=testQueryTemplatesSearchUnauthorized');
        $this->assertTrue(is_array($posts));
        $this->assertEquals(0, count($posts));
    }

    public function testWpQueryTemplatesSearchUnauthorized()
    {
        wp_set_current_user(1);
        $postTypeHelper = vchelper('PostType');
        $postId = $postTypeHelper->create(
            [
                'post_title' => 'templates-1-testWpQueryTemplatesSearchUnauthorized',
                'post_type' => 'vcv_templates',
                'post_content' => 'Test',
                'post_status' => 'draft',
            ]
        );
        $postId2 = $postTypeHelper->create(
            [
                'post_title' => 'templates-2-testWpQueryTemplatesSearchUnauthorized',
                'post_type' => 'vcv_templates',
                'post_content' => 'Test',
                'post_status' => 'publish',
            ]
        );
        $postId3 = $postTypeHelper->create(
            [
                'post_title' => 'templates-3-testWpQueryTemplatesSearchUnauthorized',
                'post_type' => 'vcv_templates',
                'post_content' => 'Test',
                'post_status' => 'private',
            ]
        );

        $posts = new WP_Query('post_type=any&s=testWpQueryTemplatesSearchUnauthorized');
        $posts = $posts->get_posts();
        $this->assertTrue(is_array($posts));
        $this->assertEquals(0, count($posts));

        wp_set_current_user(0);
        $posts = new WP_Query('post_type=any&s=testWpQueryTemplatesSearchUnauthorized');
        $posts = $posts->get_posts();
        $this->assertTrue(is_array($posts));
        $this->assertEquals(0, count($posts));
    }

    public function testWpQueryTemplatesGetUnauthorized()
    {
        wp_set_current_user(1);
        $postTypeHelper = vchelper('PostType');
        $postId = $postTypeHelper->create(
            [
                'post_title' => 'templates-1-testWpQueryTemplatesGetUnauthorized',
                'post_type' => 'vcv_templates',
                'post_content' => 'Test',
                'post_status' => 'draft',
                'meta_input' => [
                    'vcv-test-templates-testWpQueryTemplatesGetUnauthorized-unauthorized' => 1,
                ],
            ]
        );
        $postId2 = $postTypeHelper->create(
            [
                'post_title' => 'templates-2-testWpQueryTemplatesGetUnauthorized',
                'post_type' => 'vcv_templates',
                'post_content' => 'Test',
                'post_status' => 'publish',
                'meta_input' => [
                    'vcv-test-templates-testWpQueryTemplatesGetUnauthorized-unauthorized' => 1,
                ],
            ]
        );
        $postId3 = $postTypeHelper->create(
            [
                'post_title' => 'templates-3-testWpQueryTemplatesGetUnauthorized',
                'post_type' => 'vcv_templates',
                'post_content' => 'Test',
                'post_status' => 'private',
                'meta_input' => [
                    'vcv-test-templates-testWpQueryTemplatesGetUnauthorized-unauthorized' => 1,
                ],
            ]
        );

        $posts = new WP_Query(
            'post_type=vcv_templates&meta_key=vcv-test-templates-testWpQueryTemplatesGetUnauthorized-unauthorized'
        );
        $posts = $posts->get_posts();
        $this->assertTrue(is_array($posts));
        $this->assertEquals(2, count($posts));

        wp_set_current_user(0);
        $posts = new WP_Query(
            'post_type=vcv_templates&meta_key=vcv-test-templates-testWpQueryTemplatesGetUnauthorized-unauthorized'
        );
        $posts = $posts->get_posts();
        $this->assertTrue(is_array($posts));
        $this->assertEquals(1, count($posts));
    }
}
