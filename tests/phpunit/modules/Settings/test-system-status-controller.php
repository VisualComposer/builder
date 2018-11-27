<?php

class SystemStatusControllerTest extends WP_UnitTestCase
{
    public function testCheckVersion()
    {
        $requestHelper = vchelper('Request');
        $requestHelper->setData([]);

        /** @var \VisualComposer\Helpers\Filters $filterHelper */
        $filterHelper = vchelper('Filters');
        $result = $filterHelper->fire('vcv:ajax:checkVersion:adminNonce');
        $this->assertInternalType('bool', $result['status']);
    }

    /**
     * @group new
     */
    public function testCheckVersionTrue()
    {
        $module = vc_create_module_mock('VisualComposer\Modules\Settings\Ajax\SystemStatusController');

        $updateHelperMock = $this->createMock('VisualComposer\Helpers\Hub\Update');
        $updateHelperMock->method('checkVersion')
            ->willReturn(['status' => true]);

        $optionsHelper = vchelper('Options');

        $transientTime = time();

        $optionsHelper->setTransient('lastBundleUpdate', $transientTime);

        $this->assertEquals($transientTime, $optionsHelper->getTransient('lastBundleUpdate'));
        $this->assertEquals(true, $module->call('checkVersion', [''])['status']);
        $this->assertEquals(1, $optionsHelper->getTransient('lastBundleUpdate'));
    }

    /**
     * @group new
     */
    public function testCheckVersionFalse()
    {
        $module = vc_create_module_mock('VisualComposer\Modules\Settings\Ajax\SystemStatusController');
        $updateHelperMock = $this->createMock('VisualComposer\Helpers\Hub\Update');
        $updateHelperMock->method('checkVersion')
            ->willReturn(['status' => false]);

        $optionsHelper = vchelper('Options');

        $transientTime = time();

        $optionsHelper->setTransient('lastBundleUpdate', $transientTime);

        $this->assertEquals($transientTime, $optionsHelper->getTransient('lastBundleUpdate'));
        $this->assertEquals(false, $module->call('checkVersion', ['', $updateHelperMock])['status']);
        $this->assertEquals($transientTime, $optionsHelper->getTransient('lastBundleUpdate'));
    }

}
