<?php

class AjaxControllerTest extends WP_UnitTestCase
{
    public function testGetResponse()
    {
        /** @var \VisualComposer\Modules\System\Ajax\Controller $module */
        $module = vc_create_module_mock('\VisualComposer\Modules\System\Ajax\Controller');
        /** @var \VisualComposer\Helpers\Filters $filterHelper */
        $filterHelper = vchelper('Filters');

        $filterHelper->listen(
            'vcv:ajax:testGetResponse',
            function ($response) {
                return 'my custom response';
            }
        );

        $this->assertEquals('my custom response', $module->call('getResponse', ['testGetResponse']));
    }

    public function testValidateNonce()
    {
        /** @var \VisualComposer\Modules\System\Ajax\Controller $module */
        $module = vc_create_module_mock('\VisualComposer\Modules\System\Ajax\Controller');
        /** @var \VisualComposer\Helpers\Request $requestHelper */
        $requestHelper = vchelper('Request');
        /** @var \VisualComposer\Helpers\Nonce $nonceHelper */
        $nonceHelper = vchelper('Nonce');
        $this->assertFalse(
            $module->call(
                'validateNonce',
                [
                    'test:nonce',
                    $requestHelper,
                ]
            )
        );

        $requestHelper->setData(['vcv-nonce' => $nonceHelper->user()]);
        $this->assertTrue(
            $module->call(
                'validateNonce',
                [
                    'test:nonce',
                    $requestHelper,
                ]
            )
        );

        $requestHelper->setData(['vcv-nonce' => 'someInvalidNonce11']);
        $this->assertFalse(
            $module->call(
                'validateNonce',
                [
                    'test:nonce',
                    $requestHelper,
                ]
            )
        );
        $requestHelper->setData([]);
    }

    public function testValidateNonceAdmin()
    {
        wp_set_current_user(1);
        /** @var \VisualComposer\Modules\System\Ajax\Controller $module */
        $module = vc_create_module_mock('\VisualComposer\Modules\System\Ajax\Controller');
        /** @var \VisualComposer\Helpers\Request $requestHelper */
        $requestHelper = vchelper('Request');
        /** @var \VisualComposer\Helpers\Nonce $nonceHelper */
        $nonceHelper = vchelper('Nonce');
        $this->assertFalse(
            $module->call(
                'validateNonce',
                [
                    'test:adminNonce',
                    $requestHelper,
                ]
            )
        );

        $requestHelper->setData(['vcv-nonce' => $nonceHelper->admin()]);
        $this->assertTrue(
            $module->call(
                'validateNonce',
                [
                    'test:adminNonce',
                    $requestHelper,
                ]
            )
        );

        $requestHelper->setData(['vcv-nonce' => 'someInvalidNonce']);
        $this->assertFalse(
            $module->call(
                'validateNonce',
                [
                    'test:adminNonce',
                    $requestHelper,
                ]
            )
        );
        $requestHelper->setData([]);
    }

    public function testValidateEmpty()
    {
        /** @var \VisualComposer\Modules\System\Ajax\Controller $module */
        $module = vc_create_module_mock('\VisualComposer\Modules\System\Ajax\Controller');
        $this->assertTrue(
            $module->call(
                'validateNonce',
                [
                    'test',
                ]
            )
        );
    }

    public function testRenderResponse()
    {
        /** @var \VisualComposer\Modules\System\Ajax\Controller $module */
        $module = vc_create_module_mock('\VisualComposer\Modules\System\Ajax\Controller');

        $this->assertTrue(is_string($module->call('renderResponse', ['test'])));
        $this->assertTrue(is_string($module->call('renderResponse', [''])));
        $this->assertEquals('test', $module->call('renderResponse', ['test']));

        $this->assertEquals('1', $module->call('renderResponse', [1]));
        $this->assertEquals('["test"]', ($module->call('renderResponse', [['test']])));
        $this->assertEquals('{"test":0}', ($module->call('renderResponse', [['test' => 0]])));
        $this->assertEquals('{"test":true}', ($module->call('renderResponse', [['test' => true]])));
        $this->assertEquals('{"test":false}', ($module->call('renderResponse', [['test' => false]])));
        $this->assertEquals('{"test":1}', ($module->call('renderResponse', [['test' => 1]])));
        $this->assertEquals('{"test":"hi"}', ($module->call('renderResponse', [['test' => 'hi']])));

    }

    public function testSetGlobals()
    {
        $this->assertFalse(defined('VCV_AJAX_REQUEST_CALL'));
        $this->assertFalse(defined('DOING_AJAX'));

        /** @var \VisualComposer\Modules\System\Ajax\Controller $controller */
        $module = vc_create_module_mock('\VisualComposer\Modules\System\Ajax\Controller');
        $module->call('setGlobals');

        $this->assertTrue(defined('VCV_AJAX_REQUEST_CALL'));
        $this->assertTrue(defined('DOING_AJAX'));
        $this->assertTrue(VCV_AJAX_REQUEST_CALL);
        $this->assertTrue(DOING_AJAX);
    }
}
