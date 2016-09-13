<?php

class DataAjaxControllerTest extends \WP_UnitTestCase
{
    public function testGetDataFilterEmpty()
    {
        /** @var \VisualComposer\Helpers\Filters $filterHelper */
        $filterHelper = vchelper('Filters');
        $result = $filterHelper->fire('vcv:ajax:getData:adminNonce');
        $this->assertTrue(is_array($result));
        $this->assertTrue(array_key_exists('elements', $result));
        $this->assertEquals('', $result['elements']);
    }

    public function testGetData()
    {
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
        $result = $filterHelper->fire('vcv:ajax:getData:adminNonce');
        $this->assertEquals('', $result['elements']);

        update_post_meta($postId, VCV_PREFIX . 'pageContent', 'some test data');
        $result = $filterHelper->fire('vcv:ajax:getData:adminNonce');
        $this->assertEquals('some test data', $result['elements']);

        // Reset
        $requestHelper->setData([]);
    }

    public function testGetDataForMetaInput()
    {
        $factory = new WP_UnitTest_Factory_For_Post($this);
        $metaInput = [];
        $metaInput[ VCV_PREFIX . 'pageContent' ] = 'second test data';
        $postId = $factory->create(['post_title' => 'Test post', 'meta_input' => $metaInput]);
        /** @var \VisualComposer\Helpers\Request $requestHelper */
        $requestHelper = vchelper('Request');
        $requestHelper->setData(
            [
                'vcv-source-id' => $postId,
            ]
        );

        /** @var \VisualComposer\Helpers\Filters $filterHelper */
        $filterHelper = vchelper('Filters');
        $result = $filterHelper->fire('vcv:ajax:getData:adminNonce');
        $this->assertEquals('second test data', $result['elements']);

        // Reset
        $requestHelper->setData([]);
    }

    public function testSetData()
    {
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
                'vcv-data' => rawurlencode(json_encode(['elements' => 'new elements!'])),
            ]
        );

        /** @var \VisualComposer\Helpers\Filters $filterHelper */
        $filterHelper = vchelper('Filters');
        $result = $filterHelper->fire('vcv:ajax:setData:adminNonce');
        $this->assertTrue(array_key_exists('status', $result));
        $this->assertEquals(true, $result['status']);

        // Test get
        $result = $filterHelper->fire('vcv:ajax:getData:adminNonce');
        $this->assertEquals('new elements!', $result['elements']);
        $this->assertEquals('some new content', get_post_field('post_content', $postId));
        // Reset
        $requestHelper->setData([]);
    }

    public function testSetDataFalse()
    {
        /** @var \VisualComposer\Helpers\Request $requestHelper */
        $requestHelper = vchelper('Request');
        $requestHelper->setData([]);
        /** @var \VisualComposer\Helpers\Filters $filterHelper */
        $filterHelper = vchelper('Filters');
        $result = $filterHelper->fire('vcv:ajax:setData:adminNonce');
        $this->assertTrue(array_key_exists('status', $result));
        $this->assertEquals(false, $result['status']);

        // Reset
        $requestHelper->setData([]);
    }
}
