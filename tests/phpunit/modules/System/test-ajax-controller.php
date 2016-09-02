<?php

class AjaxControllerTest extends \WP_UnitTestCase
{
    public function testGetResponse()
    {
        /** @var \VisualComposer\Modules\System\Ajax\Controller $module */
        $module = vcapp('SystemAjaxController');
        /** @var \VisualComposer\Helpers\Filters $filterHelper */
        $filterHelper = vchelper('Filters');

        $filterHelper->listen(
            'vcv:ajax:testGetResponse',
            function ($response) {
                return 'my custom response';
            }
        );

        $this->assertEquals('my custom response', $module->getResponse('testGetResponse'));
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

        $requestHelper->setData(['vcv-nonce' => 'someInvalidNonce']);
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

    public function testParseRequest()
    {
        /** @var \VisualComposer\Modules\System\Ajax\Controller $module */
        $module = vc_create_module_mock('\VisualComposer\Modules\System\Ajax\Controller');
        $this->assertFalse($module->call('parseRequest'));

        /** @var \VisualComposer\Helpers\Request $requestHelper */
        $requestHelper = vchelper('Request');
        $requestHelper->setData(
            [
                'vcv-action' => 'testParseRequest',
            ]
        );

        // Default empty response
        $this->assertEquals(
            '',
            $module->call(
                'parseRequest',
                [
                    $requestHelper,
                ]
            )
        );

        // Custom response
        /** @var \VisualComposer\Helpers\Filters $filterHelper */
        $filterHelper = vchelper('Filters');
        $filterHelper->listen(
            'vcv:ajax:testParseRequest',
            function ($response) {
                return ['Hi' => true];
            }
        );
        $this->assertEquals(
            ['Hi' => true],
            $module->call(
                'parseRequest',
                [
                    $requestHelper,
                ]
            )
        );

        // Reset
        $requestHelper->setData([]);
    }
}
