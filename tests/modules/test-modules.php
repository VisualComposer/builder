<?php

class ModulesTest extends WP_UnitTestCase
{
    public function testModulesInstances()
    {
        $modules = vcapp()->modules;
        foreach ($modules as $module) {
            $this->assertTrue(is_object(vcapp($module)));
        }
    }
}
