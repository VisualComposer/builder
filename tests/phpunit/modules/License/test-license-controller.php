<?php

class LicenseControllerTest extends WP_UnitTestCase
{
    public function testAccountUrl()
    {
        $this->assertEquals('https://account.visualcomposer.io', VCV_ACCOUNT_URL);
    }

    public function testHubDownload()
    {
        $this->assertTrue(VCV_ENV_HUB_DOWNLOAD);
    }

    public function testAccountId()
    {
        $this->assertEquals('account', VCV_ENV_ADDONS_ID);
    }

    public function testHubUrl()
    {
        $this->assertEquals('https://account.visualcomposer.io', VCV_HUB_URL);
    }

    public function testTokenUrl()
    {
        $this->assertEquals('https://account.visualcomposer.io/authorization-token', VCV_TOKEN_URL);
    }

    public function testLicenseActivateUrl()
    {
        $this->assertEquals('https://account.visualcomposer.io/activation', VCV_LICENSE_ACTIVATE_URL);
    }

    public function testLicenseActivateFinishUrl()
    {
        $this->assertEquals('https://account.visualcomposer.io/finish-license-activation', VCV_LICENSE_ACTIVATE_FINISH_URL);
    }

    public function testLicenseDeactivateUrl()
    {
        $this->assertEquals('https://account.visualcomposer.io/deactivate-license', VCV_LICENSE_DEACTIVATE_URL);
    }

    public function testLicenseDeactivateFinishUrl()
    {
        $this->assertEquals('https://account.visualcomposer.io/finish-license-deactivation', VCV_LICENSE_DEACTIVATE_FINISH_URL);
    }
}
