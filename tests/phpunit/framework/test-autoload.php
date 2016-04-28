<?php

class AutoloadTest extends WP_UnitTestCase
{
    public function testShuffleAssoc()
    {
        /** @var \VisualComposer\Framework\Autoload $app */
        $app = vcapp('Autoload');
        $data = [
            'test' => 1,
            'test2' => 2,
            'test3' => 3,
            'test4' => 4,
            'test5' => 5,
            'test6' => 6,
            'test7' => 7,
            'test8' => 8,
            'test9' => 9,
            'test10' => 10,
        ];
        $shuffled = $app->shuffleAssoc($data);
        $this->assertEquals($data, $shuffled);
        $this->assertNotEquals(array_keys($data), array_keys($shuffled));
    }

    public function testGetComponents()
    {
        /** @var \VisualComposer\Framework\Autoload $app */
        $app = vcapp('Autoload');
        $components = $app->getComponents();
        $this->assertTrue(is_array($components));
        $this->assertTrue(is_array($components['helpers']));
        $this->assertTrue(is_array($components['modules']));

        $this->assertTrue(!empty($components['helpers']));
        $this->assertTrue(!empty($components['modules']));
        foreach ($components['helpers'] as $helper) {
            $helperObj = vchelper(str_replace('Helper', '', $helper['name']));
            $helperObjFromApp = vcapp($helper['name']);
            $this->assertEquals(
                $helperObj,
                $helperObjFromApp,
                'Checking that helper is accessable: ' . $helper['name']
            );
        }

        foreach ($components['modules'] as $module) {
            $moduleObj = vcapp($module['name']);
            $this->assertTrue(is_object($moduleObj), 'module should be an object:' . $module['name']);
        }
    }

    public function testInitComponents()
    {
        /** @var \VisualComposer\Framework\Autoload $app */
        $app = vcapp('Autoload');
        $components = $app->getComponents();
        $this->assertTrue($app->initComponents($components));
    }

    public function testIsHelper()
    {
        /** @var \VisualComposer\Framework\Autoload $app */
        $app = vcapp('Autoload');
        $this->assertTrue($app->isHelper('Helper'));
        $this->assertTrue($app->isHelper('\VisualComposer\Framework\Illuminate\Support\Helper'));
        $this->assertTrue($app->isHelper('\\VisualComposer\\Framework\\Illuminate\\Support\\Helper'));

        // Wrong values
        $this->assertFalse($app->isHelper(''));
        $this->assertFalse($app->isHelper('Module'));
    }

    public function testIsModule()
    {
        /** @var \VisualComposer\Framework\Autoload $app */
        $app = vcapp('Autoload');
        $this->assertTrue($app->isModule('Module'));
        $this->assertTrue($app->isModule('\VisualComposer\Framework\Illuminate\Support\Module'));
        $this->assertTrue($app->isModule('\\VisualComposer\\Framework\\Illuminate\\Support\\Module'));

        // Wrong values
        $this->assertFalse($app->isModule(''));
        $this->assertFalse($app->isModule('Helper'));
    }

    public function testGetName()
    {
        /** @var \VisualComposer\Framework\Autoload $app */
        $app = vcapp('Autoload');

        /** @see \VisualComposer\Helpers\Str */
        /** @see \VisualComposer\Helpers\Token */
        /** @see \VisualComposer\Modules\Site\Controller */
        /** @see \VisualComposer\Modules\License\Controller */
        /** @see \VisualComposer\Modules\Editors\PageEditable\Controller */

        $this->assertEquals(
            'StrHelper',
            $app->getHelperName(
                [
                    'namespace' => 'VisualComposer\Helpers',
                    'class' => 'Str',
                ]
            )
        );
        $this->assertEquals(
            'TokenHelper',
            $app->getHelperName(
                [
                    'namespace' => 'VisualComposer\Helpers',
                    'class' => 'Token',
                ]
            )
        );

        $this->assertEquals(
            'SiteController',
            $app->getModuleName(
                [
                    'namespace' => 'VisualComposer\Modules\Site',
                    'class' => 'Controller',
                ]
            )
        );
        $this->assertEquals(
            'LicenseController',
            $app->getModuleName(
                [
                    'namespace' => 'VisualComposer\Modules\License',
                    'class' => 'Controller',
                ]
            )
        );
        $this->assertEquals(
            'EditorsPageEditableController',
            $app->getModuleName(
                [
                    'namespace' => 'VisualComposer\Modules\Editors\PageEditable',
                    'class' => 'Controller',
                ]
            )
        );
    }
}
