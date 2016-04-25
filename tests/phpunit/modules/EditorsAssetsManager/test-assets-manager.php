<?php

class AssetsManagerTest extends WP_UnitTestCase
{
    public function test_setPostDataHook()
    {
        $module = vcapp('EditorsAssetsManagerController');
        $reflectionMethod = new ReflectionMethod($module, 'setPostDataHook');
        $reflectionMethod->setAccessible(true);

        $this->assertEquals(20, $reflectionMethod->invokeArgs($module, [20]));
    }
}
