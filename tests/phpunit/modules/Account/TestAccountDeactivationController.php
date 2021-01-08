<?php

class TestAccountDeactivationController extends WP_UnitTestCase
{
    public function testPing()
    {
        $requestHelper = vchelper('Request');
        $requestHelper->setData(
            [
                'code' => 'not empty',
            ]
        );
        $optionsHelper = vchelper('Options');
        $licenseHelper = vchelper('License');
        $this->assertFalse($licenseHelper->isPremiumActivated());
        $optionsHelper->setTransient('lastBundleUpdate', 1, 3600);
        $response = vcfilter('vcv:ajax:license:deactivation:ping');
        $this->assertEquals(['status' => true], $response);
        $this->assertEquals(1, $optionsHelper->getTransient('lastBundleUpdate'));
        $licenseHelper->setKey('test');
        $licenseHelper->setType('premium');

        // check wrong
        $requestHelper->setData(
            [
                'code' => 'wrong',
            ]
        );
        $this->assertTrue($licenseHelper->isPremiumActivated());
        $response = vcfilter('vcv:ajax:license:deactivation:ping');
        $this->assertEquals(1, $optionsHelper->getTransient('lastBundleUpdate'));

        $requestHelper->setData(
            [
                'code' => sha1('test'),
            ]
        );
        // Now the transient must be deleted
        $this->assertTrue($licenseHelper->isPremiumActivated());
        $response = vcfilter('vcv:ajax:license:deactivation:ping');
        $this->assertFalse($optionsHelper->getTransient('lastBundleUpdate'));

        $licenseHelper->setKey('');
        $licenseHelper->setType('');
    }
}
