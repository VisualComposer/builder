<?php

class LicenseControllerTest extends WP_UnitTestCase
{
    public function testHubDownload()
    {
        $this->assertTrue(vcvenv('VCV_ENV_HUB_DOWNLOAD'));
    }

    public function testAccountId()
    {
        $this->assertEquals('account', vcvenv('VCV_ENV_ADDONS_ID'));
    }

    public function testHubUrl()
    {
        $this->assertEquals('https://account.visualcomposer.io', vcvenv('VCV_HUB_URL'));
    }

    public function testTokenUrl()
    {
        $this->assertEquals('https://account.visualcomposer.io/authorization-token', vcvenv('VCV_TOKEN_URL'));
    }

    public function testLicenseActivateUrl()
    {
        $this->assertEquals('https://account.visualcomposer.io/activation', vcvenv('VCV_LICENSE_ACTIVATE_URL'));
    }

    public function testLicenseActivateFinishUrl()
    {
        $this->assertEquals(
            'https://account.visualcomposer.io/finish-license-activation',
            vcvenv('VCV_LICENSE_ACTIVATE_FINISH_URL')
        );
    }

    public function testLicenseDeactivateUrl()
    {
        $this->assertEquals(
            'https://account.visualcomposer.io/deactivate-license',
            vcvenv('VCV_LICENSE_DEACTIVATE_URL')
        );
    }

    public function testLicenseDeactivateFinishUrl()
    {
        $this->assertEquals(
            'https://account.visualcomposer.io/finish-license-deactivation',
            vcvenv('VCV_LICENSE_DEACTIVATE_FINISH_URL')
        );
    }
}
