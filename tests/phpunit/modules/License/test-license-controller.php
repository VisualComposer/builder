<?php

class LicenseControllerTest extends WP_UnitTestCase
{
    public function testAccountUrl()
    {
        $this->assertEquals('http://test.account.visualcomposer.io', VCV_ACCOUNT_URL);
    }
}
