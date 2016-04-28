<?php

class HelpersCoreTest extends WP_UnitTestCase
{
    public function testCoreHelper()
    {
        /**
         * @var $helper VisualComposer\Helpers\Core
         */
        $helper = vcapp('VisualComposer\Helpers\Core');
        $this->assertTrue(is_object($helper), 'Core helper should be an object');
    }

    public function testIsNetworkPlugin()
    {
        $helper = vcapp('VisualComposer\Helpers\Core');

        $this->assertTrue(method_exists($helper, 'isNetworkPlugin'), 'isNetworkPlugin should exist');

        if (is_multisite()) {
            $this->assertTrue($helper->isNetworkPlugin(), 'if multisite it should be network plugin');
        } else {
            $this->assertTrue(!$helper->isNetworkPlugin(), 'if not multisite it should not be network plugin');
        }
    }

    public function testHelpersCoreDependencyInjection()
    {
        /**
         * @var $helper VisualComposer\Helpers\Core
         */
        $helper = vcapp('VisualComposer\Helpers\Core');

        $called = false;
        $teInstance = false;

        $data = function (\VisualComposer\Helpers\Core $core) use (&$called, &$teInstance) {
            $teInstance = $core;
            $called = true;
        };

        vcapp()->call($data);

        $this->assertTrue($called, 'closure should be called');

        $this->assertTrue(is_object($teInstance), 'teInstance should be injected');

        $this->assertEquals($helper, $teInstance, 'it should be same as $coreHelper');

        $this->assertTrue(method_exists($teInstance, 'isNetworkPlugin'), 'isNetworkPlugin method should exists');
    }

}
