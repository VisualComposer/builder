<?php

class LicenseActivationTest extends WP_UnitTestCase
{
    public function testLicenseActivation()
    {
        vchelper('Options')->setTransient('lastBundleUpdate', time());
        $this->assertNotEmpty(vcvenv('VCV_ACTIVATE_LICENSE_URL'));
        $loggerHelper = vchelper('Logger');
        $loggerHelper->reset();

        $result = vchelper('Filters')->fire('vcv:ajax:license:activate:adminNonce');
        unset($result['response']['checksum']);

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
        unset($result['response']['checksum']);
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
                    ],
            ],
            $result
        );
        $this->assertEquals('Couldn\'t find a valid Visual Composer Website Builder license.', $loggerHelper->all());

        $loggerHelper->reset();
    }
}
