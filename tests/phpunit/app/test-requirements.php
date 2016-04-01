<?php

class RequirementsTest extends WP_UnitTestCase
{
    public function testPluginRequirementsConstants()
    {
        $this->assertTrue(class_exists('VcVCoreRequirements'));
    }
}
