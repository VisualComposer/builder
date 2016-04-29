<?php

class RequirementsTest extends WP_UnitTestCase
{
    public function testPluginRequirementsConstants()
    {
        $this->assertTrue(class_exists('VcVCoreRequirements'));

        $this->assertTrue(version_compare(VCV_REQUIRED_PHP_VERSION, '5.3', '>'));
        $this->assertTrue(version_compare(VCV_REQUIRED_PHP_VERSION, '5.3.1', '>'));
        $this->assertFalse(version_compare(VCV_REQUIRED_PHP_VERSION, '5.4', '>'));
        $this->assertFalse(version_compare(VCV_REQUIRED_PHP_VERSION, '5.4.1', '>'));
        $this->assertFalse(version_compare(VCV_REQUIRED_PHP_VERSION, '5.5', '>'));
        $this->assertFalse(version_compare(VCV_REQUIRED_PHP_VERSION, '7.0', '>'));


        $this->assertTrue(version_compare(VCV_REQUIRED_BLOG_VERSION, '4.0', '>'));
        $this->assertTrue(version_compare(VCV_REQUIRED_BLOG_VERSION, '4.0.9', '>'));
        $this->assertFalse(version_compare(VCV_REQUIRED_BLOG_VERSION, '4.1', '>'));
        $this->assertFalse(version_compare(VCV_REQUIRED_BLOG_VERSION, '4.5', '>'));
        VcvCoreRequirements::coreChecks();
    }
}
