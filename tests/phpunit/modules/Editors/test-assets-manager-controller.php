<?php

class AssetsManagerControllerTest extends WP_UnitTestCase
{
    public function testSetPostDataHook()
    {
        return; // Feature Toggle
        // Create test post.
        $factory = new WP_UnitTest_Factory_For_Post($this);
        $postId = $factory->create(['post_title' => 'Test Post']);
        $post = get_post();

        /** @var VisualComposer\Framework\Illuminate\Filters\Dispatcher $filterHelper */
        $filterHelper = vchelper('Filters');
        $this->assertNotEmpty($filterHelper->getListeners('vcv:postAjax:setPostData'));
        $response = $filterHelper->fire(
            'vcv:postAjax:setPostData',
            ['status' => true],
            [
                'sourceId' => $postId,
                'post' => $post,
                'data' => ['foo', 'bar'],
                // 'vcv-scripts' => 'alert(1)',
                // 'vcv-styles' => 'body {color: red}'
            ]
        );
        $expected = ['status' => true, 'data' => ['stylesBundle' => '', 'scriptsBundle' => '']];

        $this->assertEquals($expected, $response);

    }
}
