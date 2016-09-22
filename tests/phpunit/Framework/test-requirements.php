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
        $requirements = new VcvCoreRequirements();
        $this->assertTrue($requirements->coreChecks());
    }

    public function testCheckVersion()
    {
        $requirements = $this->getMockBuilder('VcvCoreRequirements')->setMethods(
            ['deactivate']
        )->getMock();
        $requirements->expects($this->exactly(2))->method('deactivate')->with(
            $this->equalTo(VCV_PLUGIN_FULL_PATH)
        )->will($this->returnValue(true));
        /** @var VcvCoreRequirements $requirements */
        $catched = false;
        try {
            $requirements->checkVersion('5.0', '4.0');
        } catch (WPDieException $e) {
            $catched = true;
        }
        $this->assertTrue($catched);

        // 5.0
        $catched = false;
        try {
            $this->assertTrue($requirements->checkVersion('5.0', '5.0'));
        } catch (WPDieException $e) {
            $catched = true;
        }
        $this->assertFalse($catched);

        // 5.1
        $catched = false;
        try {
            $this->assertTrue($requirements->checkVersion('5.0', '5.1'));
        } catch (WPDieException $e) {
            $catched = true;
        }
        $this->assertFalse($catched);

        // 6.0-dev
        $catched = false;
        try {
            $this->assertTrue($requirements->checkVersion('5.0', '6.0-dev'));
        } catch (WPDieException $e) {
            $catched = true;
        }
        $this->assertFalse($catched);

        // 5.0-beta
        $catched = false;
        try {
            $requirements->checkVersion('5.0', '5.0-beta');
        } catch (WPDieException $e) {
            $catched = true;
        }
        $this->assertTrue($catched);
    }

    public function testDeactivate()
    {
        $requirements = new VcvCoreRequirements();
        $plugins = function () {
            return ['testpath'];
        };
        add_filter('pre_option_active_plugins', $plugins);
        $called = false;
        add_action(
            'deactivated_plugin',
            function ($plugin) use (&$called) {
                if ($plugin == 'testpath') {
                    $called = true;
                }
            }
        );
        $requirements->deactivate('testpath2');
        $this->assertFalse($called);

        $requirements->deactivate('testpath');
        $this->assertTrue($called);

        remove_filter('pre_option_active_plugins', $plugins);
    }
}
