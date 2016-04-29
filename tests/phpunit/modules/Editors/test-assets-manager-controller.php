<?php

class AssetsManagerControllerTest extends WP_UnitTestCase
{
    public function testSetPostDataHook()
    {
        // Create test post.
        global $post;
        $factory = new WP_UnitTest_Factory_For_Post($this);
        $postId = $factory->create(['post_title' => 'Test Post']);
        $post = get_post();

        $died = false;
        try {
            vcevent(
                'vcv:postAjax:setPostData',
                [
                    $postId,
                    $post,
                    ['foo', 'bar'],
                ]
            );
        } catch (\DiedException $e) {
            $expected = '{"success":true,"data":{"styleBundles":[]}}';
            $this->assertEquals($expected, $e->getMessage());
            $died = true;
        }

        $this->assertTrue($died, 'Method was expected to die, but didn\'t.');
    }
}
