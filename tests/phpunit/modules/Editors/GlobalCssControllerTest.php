<?php

class GlobalCssControllerTest extends WP_UnitTestCase
{
    public function testGlobalCss()
    {
        // Set global css
        $globalCSS = 'body{color:purple}';
        update_option('vcv-globalElementsCss', $globalCSS);
        update_option('vcv-settingsGlobalCss', $globalCSS);

        // Create test post
        wp_set_current_user(1);
        $factory = new WP_UnitTest_Factory_For_Post($this);
        $postId = $factory->create(['post_title' => 'Test post']);
        $postHelper = vchelper('PostType')->setupPost($postId);

        // Check is it applied to post
        $data = vcfilter('vcv:dataAjax:getData', ['status' => true], ['sourceId' => $postId]);
        $this->assertEquals($data['cssSettings']['global'], $globalCSS);
    }
}
