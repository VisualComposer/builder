<?php

class AuthorControllerTest extends WP_UnitTestCase
{
    public function testOutputAuthorList() {
        wp_set_current_user(1);

        $post = new WP_UnitTest_Factory_For_Post($this);
        $postId = $post->create(['post_title' => 'Test Post']);
        vchelper('PostType')->setupPost($postId);

        $extraOutput = vcfilter('vcv:frontend:head:extraOutput', []);

        $this->assertIsArray($extraOutput);

        $pattern ='/window.VCV_AUTHOR_LIST = {"current":"1","all":\[{"label":"admin \(admin\)","value":"1"}]};/';
        $match = preg_grep( $pattern, $extraOutput);

        $this->assertIsArray($match);
    }

    public function testGetAuthorListForUpdate() {
        wp_set_current_user(1);

        $post = new WP_UnitTest_Factory_For_Post($this);
        $postId = $post->create(['post_title' => 'Test Post']);
        vchelper('PostType')->setupPost($postId);

        $expectedList = [
            "status" => true,
            "data" => [
                [
                    "label" => "admin (admin)",
                    "value" => "1",
                ],
            ],
        ];

        $updateList = vcfilter('vcv:ajax:dropdown:author:updateList:adminNonce');

        $this->assertSame($expectedList, $updateList);
    }

    public function testSetData() {
        wp_set_current_user(1);

        $secondUserId = wp_insert_user(
            [
                'user_pass' => 'admin',
                'role' => 'admin',
                'user_login' => 'admin-2',
            ]
        );

        $post = new WP_UnitTest_Factory_For_Post($this);
        $postId = $post->create(
            [
                'post_title' => 'Test Post',
                'post_author' => $secondUserId
            ]
        );

        $requestHelper = vchelper('Request');
        $requestHelper->setData(
            [
                'vcv-settings-author' => 1,
            ]
        );

        $payload = [
            'sourceId' => $postId,
            'requestHelper' => $requestHelper,
        ];

        vcfilter('vcv:dataAjax:setData', [], $payload);

        $post = get_post($postId);

        $this->assertEquals($post->post_author, 1);

        wp_delete_user(2);
    }
}
