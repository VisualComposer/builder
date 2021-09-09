<?php

class DataControllerTest extends WP_UnitTestCase
{
    public function testGetData()
    {
        wp_set_current_user(1);
        $factory = new WP_UnitTest_Factory_For_Post($this);
        $postId = $factory->create(['post_title' => 'Test post']);
        /** @var \VisualComposer\Helpers\Request $requestHelper */
        $postHelper = vchelper('PostType')->setupPost($postId);
        $requestHelper = vchelper('Request');
        $requestHelper->setData(
            [
                'vcv-source-id' => $postId,
            ]
        );

        // Set global and custom css
        $globalCSS = 'body{color:purple}';
        $customCSS = 'div{background:red}';
        update_option('vcv-globalElementsCss', $globalCSS);
        update_option('vcv-settingsGlobalCss', $globalCSS);
        update_post_meta($postId, 'vcvSettingsSourceCustomCss', $customCSS);

        $result = vcfilter('vcv:dataAjax:getData', ['status' => true], ['sourceId' => $postId]);

        $this->assertEquals($result['cssSettings']['custom'], $customCSS);
        $this->assertEquals($result['cssSettings']['global'], $globalCSS);

        // Reset
        $requestHelper->setData([]);
    }
}
