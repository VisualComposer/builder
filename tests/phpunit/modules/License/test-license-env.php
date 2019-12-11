<?php

class LicenseEnvTest extends WP_UnitTestCase
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
        $this->assertEquals('https://my.visualcomposer.com', vcvenv('VCV_HUB_URL'));
    }

    public function testTokenUrl()
    {
        $this->assertEquals('https://my.visualcomposer.com/authorization-token', vcvenv('VCV_TOKEN_URL'));
    }

    public function testLicenseActivateUrl()
    {
        $this->assertEquals(
            'https://my.visualcomposer.com/?edd_action=activate_license&item_name=Visual%20Composer',
            vcvenv('VCV_ACTIVATE_LICENSE_URL')
        );
    }
}
