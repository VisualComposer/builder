<?php

class UpdateHelperTest extends WP_UnitTestCase
{
    public function testIsUrlDev()
    {
        $updatesHelper = vchelper('HubUpdate');
        $this->assertTrue($updatesHelper->isUrlDev('http://localhost'));
        $this->assertTrue($updatesHelper->isUrlDev('https://localhost'));
        $this->assertTrue($updatesHelper->isUrlDev('https://127.0.0.1'));
        $this->assertTrue($updatesHelper->isUrlDev('http://127.0.0.1'));
        $this->assertTrue($updatesHelper->isUrlDev('http://some.test'));
        $this->assertTrue($updatesHelper->isUrlDev('http://some.local'));
        $this->assertTrue($updatesHelper->isUrlDev('http://some.vc'));
        $this->assertFalse($updatesHelper->isUrlDev('http://visualcomposer.com'));
        $this->assertFalse($updatesHelper->isUrlDev('https://visualcomposer.com'));
        $this->assertFalse($updatesHelper->isUrlDev('http://wordpress.org'));
        $this->assertFalse($updatesHelper->isUrlDev('https://wordpress.org'));
    }
}
