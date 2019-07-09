<?php

class DataAjaxControllerTest extends \WP_UnitTestCase
{
    public function testGetData()
    {
        wp_set_current_user(1);
        $factory = new WP_UnitTest_Factory_For_Post($this);
        $postId = $factory->create(['post_title' => 'Test post']);
        /** @var \VisualComposer\Helpers\Request $requestHelper */
        $requestHelper = vchelper('Request');
        $requestHelper->setData(
            [
                'vcv-source-id' => $postId,
            ]
        );

        /** @var \VisualComposer\Helpers\Filters $filterHelper */
        $filterHelper = vchelper('Filters');
        $postTypeHelper = vchelper('PostType');
        $postTypeHelper->setupPost($postId);
        $result = $filterHelper->fire('vcv:ajax:getData:adminNonce', '', [
            'sourceId' => $postId,
        ]);
        $this->assertEquals('', $result['data']);

        update_post_meta($postId, VCV_PREFIX . 'pageContent', 'some test data');
        $result = $filterHelper->fire('vcv:ajax:getData:adminNonce', '', [
            'sourceId' => $postId,
        ]);
        $this->assertEquals('some test data', $result['data']);

        // Reset
        $requestHelper->setData([]);
    }

    public function testGetDataForMetaInput()
    {
        wp_set_current_user(1);
        $factory = new WP_UnitTest_Factory_For_Post($this);
        $metaInput = [];
        $metaInput[ VCV_PREFIX . 'pageContent' ] = 'second test data';
        $postId = $factory->create(['post_title' => 'Test post', 'meta_input' => $metaInput]);
        /** @var \VisualComposer\Helpers\Request $requestHelper */
        $requestHelper = vchelper('Request');
        $postHelper = vchelper('PostType')->setupPost($postId);
        $requestHelper->setData(
            [
                'vcv-source-id' => $postId,
            ]
        );

        /** @var \VisualComposer\Helpers\Filters $filterHelper */
        $filterHelper = vchelper('Filters');
        $result = $filterHelper->fire('vcv:ajax:getData:adminNonce', '', [
            'sourceId' => $postId,
        ]);
        $this->assertEquals('second test data', $result['data']);

        // Reset
        $requestHelper->setData([]);
    }

    public function testSetData()
    {
        $user = wp_set_current_user(1);
        $factory = new WP_UnitTest_Factory_For_Post($this);
        $metaInput = [];
        $metaInput[ VCV_PREFIX . 'pageContent' ] = 'second test data';
        $postId = $factory->create(['post_title' => 'Test post', 'meta_input' => $metaInput]);
        /** @var \VisualComposer\Helpers\Request $requestHelper */
        $requestHelper = vchelper('Request');
        $requestHelper->setData(
            [
                'vcv-source-id' => $postId,
                'vcv-content' => 'some new content',
                'vcv-ready' => '1',
                'vcv-data' => json_encode(['new elements!']),
            ]
        );

        /** @var \VisualComposer\Helpers\Filters $filterHelper */
        $filterHelper = vchelper('Filters');
        $postTypeHelper = vchelper('PostType');
        $postTypeHelper->setupPost($postId);
        $result = $filterHelper->fire('vcv:ajax:setData:adminNonce', '', [
            'sourceId' => $postId,
        ]);
        $this->assertTrue(array_key_exists('status', $result));
        $this->assertEquals(true, $result['status']);

        // Test get
        $result = $filterHelper->fire('vcv:ajax:getData:adminNonce', '', [
            'sourceId' => $postId,
        ]);
        $this->assertEquals(json_encode(['new elements!']), $result['data']);
        $this->assertEquals('some new content', get_post_field('post_content', $postId));
        // Reset
        $requestHelper->setData([]);
    }

    public function testSetDataFalse()
    {

        /** @var \VisualComposer\Helpers\Request $requestHelper */
        $requestHelper = vchelper('Request');
        $requestHelper->setData(['vcv-ready' => '1']);
        /** @var \VisualComposer\Helpers\Filters $filterHelper */
        $filterHelper = vchelper('Filters');
        $result = $filterHelper->fire('vcv:ajax:setData:adminNonce');
        $this->assertTrue(array_key_exists('status', $result));
        $this->assertEquals(false, $result['status']);

        // Reset
        $requestHelper->setData([]);
    }
}
