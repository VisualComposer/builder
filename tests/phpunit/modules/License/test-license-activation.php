<?php

class LicenseActivationTest extends WP_UnitTestCase
{
    public function testLicenseActivation()
    {
        vchelper('Options')->setTransient('lastBundleUpdate', time());
        $this->assertNotEmpty(vcvenv('VCV_ACTIVATE_LICENSE_URL'));
        $this->assertFalse(vchelper('License')->isAnyActivated());
        $loggerHelper = vchelper('Logger');
        $loggerHelper->reset();

        $result = vchelper('Filters')->fire('vcv:ajax:license:activate:adminNonce');

        // Expect false result as no license and etc provided
        $this->assertEquals(
            [
                'status' => false,
                'response' =>
                    [
                        'success' => false,
                        'license' => 'invalid',
                        'item_id' => false,
                        'item_name' => 'Visual Composer',
                        'error' => 'missing',
                        'checksum' => 'b5798e0ea0ebe993851f15d085f64e0c',
                    ],
            ],
            $result
        );
        $this->assertEquals('Couldn\'t find a valid Visual Composer Website Builder license.', $loggerHelper->all());
        $loggerHelper->reset();

        // Now need to try to activate some unknown license
        $requestHelper = vchelper('Request');
        $requestHelper->setData(
            [
                'vcv-activation-type' => 'free',
                'vcv-license-key' => 'anything',
            ]
        );
        $result = vchelper('Filters')->fire('vcv:ajax:license:activate:adminNonce');
        $this->assertEquals(
            [
                'status' => false,
                'response' =>
                    [
                        'success' => false,
                        'license' => 'invalid',
                        'item_id' => false,
                        'item_name' => 'Visual Composer',
                        'error' => 'missing',
                        'checksum' => '2643bf7f5e6ea498135c722d8201ed7f',
                    ],
            ],
            $result
        );
        $this->assertEquals('Couldn\'t find a valid Visual Composer Website Builder license.', $loggerHelper->all());

        $loggerHelper->reset();
    }
}
