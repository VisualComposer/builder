<?php

class ModulesDependencyInjectionTest extends WP_UnitTestCase
{
    /** @var MyTestModule */
    protected $container;

    public function setUp()
    {
        parent::setUp();
        $this->container = vcapp('MyTestModule');
    }

    public function testDIContainerCall()
    {
        $obj = new stdClass();
        $obj->data = 1;

        $obj2 = new stdClass();
        $this->assertTrue($this->container->call('pr', [0, $obj]));
        $this->assertTrue($this->container->call('pr', [0, $obj, []]));
        $this->assertFalse($this->container->call('pr', [0, $obj2, []]));
        $this->assertFalse($this->container->call('pr', [0, $obj, false]));

        $this->assertTrue($this->container->call('pr', [1, $obj, ['test']]));
        $this->assertTrue($this->container->call('pr', [2, $obj, ['test', 'test2'],]));
        $this->assertFalse($this->container->call('pr', [2, $obj2, ['test', 'test2'],]));

        $this->assertTrue($this->container->call('pb', [0, $obj]));
        $this->assertTrue($this->container->call('pb', [0, $obj, []]));
        $this->assertFalse($this->container->call('pb', [0, $obj2, []]));
        $this->assertFalse($this->container->call('pb', [0, $obj, false]));

        $this->assertTrue($this->container->call('pb', [1, $obj, ['test']]));
        $this->assertTrue($this->container->call('pb', [2, $obj, ['test', 'test2']]));
        $this->assertFalse($this->container->call('pb', [2, $obj2, ['test', 'test2']]));
    }

    public function testDIContainerCallAssoc()
    {
        $obj = new stdClass();
        $obj->data = 1;

        $obj2 = new stdClass();
        $this->assertTrue($this->container->call('pr', ['data' => 0, 'obj2' => $obj]));
        $this->assertTrue($this->container->call('pr', ['data' => 0, 'obj2' => $obj, 'test' => []]));
        $this->assertTrue($this->container->call('pb', ['data' => 1, 'obj2' => $obj, 'test' => ['test']]));
        $this->assertFalse($this->container->call('pb', ['data' => 2, 'obj2' => $obj2, 'test' => ['test', 'test2']]));
    }

    public function testEmpty()
    {
        $called = false;
        $func = function () use (&$called) {
            $this->assertTrue(true, 'function should be called');
            $called = true;
        };
        $this->container->call($func);
        $this->assertTrue($called, 'function must be called');
    }

    public function testDefaults()
    {
        $called = false;
        $func = function ($param = []) use (&$called) {
            $this->assertEquals([], $param);
            $called = true;
        };
        $this->container->call($func);
        $this->assertTrue($called, 'function must be called');
    }

    public function testDefaultsWithValuesAssoc()
    {
        $called = false;
        $func = function ($param = []) use (&$called) {
            $this->assertEquals(['my param'], $param);
            $called = true;
        };
        $this->container->call($func, ['param' => ['my param']]);
        $this->assertTrue($called, 'function must be called');
    }

    public function testDefaultsWithValues()
    {
        $called = false;
        $func = function ($param = []) use (&$called) {
            $this->assertEquals(['my param'], $param);
            $called = true;
        };
        $this->container->call($func, [['my param']]);
        $this->assertTrue($called, 'function must be called');
    }

    public function testWithoutInjection()
    {
        $called = false;
        $func = function (
            $param1,
            $param2
        ) use (&$called) {
            $this->assertEquals('param1', $param1);
            $this->assertEquals(6, $param2);
            $called = true;
        };
        $this->container->call($func, ['param1', 6]);
        $this->assertTrue($called, 'function must be called');
    }

    public function testWithoutInjectionAssoc()
    {
        $called = false;
        $func = function (
            $param1,
            $param2
        ) use (&$called) {
            $this->assertEquals('param1', $param1);
            $this->assertEquals(6, $param2);
            $called = true;
        };
        $this->container->call($func, ['param1' => 'param1', 'param2' => 6]);
        $this->assertTrue($called, 'function must be called');
    }

    public function testBasicInjection()
    {
        $called = false;
        $func = function (
            \VisualComposer\Helpers\Core $core,
            \VisualComposer\Helpers\Templates $templates
        ) use (&$called) {
            $this->assertTrue(is_object($core));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        $this->container->call($func);
        $this->assertTrue($called, 'function must be called');
    }

    public function testBasicInjectionWithParams()
    {
        $called = false;
        $func = function (
            $param1,
            $param2,
            \VisualComposer\Helpers\Core $core,
            \VisualComposer\Helpers\Templates $templates
        ) use (&$called) {
            $this->assertEquals('params1', $param1);
            $this->assertEquals(4, $param2);
            $this->assertTrue(is_object($core));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        $this->container->call($func, ['params1', 4]);
        $this->assertTrue($called, 'function must be called');
    }

    public function testBasicInjectionWithParamsAssoc()
    {
        $called = false;
        $func = function (
            $param1,
            $param2,
            \VisualComposer\Helpers\Core $core,
            \VisualComposer\Helpers\Templates $templates
        ) use (&$called) {
            $this->assertEquals('params1', $param1);
            $this->assertEquals(4, $param2);
            $this->assertTrue(is_object($core));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        $this->container->call($func, ['param1' => 'params1', 'param2' => 4]);
        $this->assertTrue($called, 'function must be called');
    }

    public function testBasicInjectionWithParamsAndDefaults()
    {
        $called = false;
        $func = function (
            $param1,
            $param2 = [],
            \VisualComposer\Helpers\Core $core,
            \VisualComposer\Helpers\Templates $templates
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals([], $param2);
            $this->assertTrue(is_object($core));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        $this->container->call($func, ['params one']);
        $this->assertTrue($called, 'function must be called');
    }

    public function testBasicInjectionWithParamsAndDefaultsAssoc()
    {
        $called = false;
        $func = function (
            $param1,
            $param2 = [],
            \VisualComposer\Helpers\Core $core,
            \VisualComposer\Helpers\Templates $templates
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals([], $param2);
            $this->assertTrue(is_object($core));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        $this->container->call($func, ['param1' => 'params one']);
        $this->assertTrue($called, 'function must be called');
    }

    public function testBasicInjectionWithParamsAndDefaultsWithValue()
    {
        $called = false;
        $func = function (
            $param1,
            $param2 = [],
            \VisualComposer\Helpers\Core $core,
            \VisualComposer\Helpers\Templates $templates
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals(['second param'], $param2);
            $this->assertTrue(is_object($core));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        $this->container->call($func, ['params one', ['second param']]);
        $this->assertTrue($called, 'function must be called');
    }

    public function testBasicInjectionWithParamsAndDefaultsWithValueAssoc()
    {
        $called = false;
        $func = function (
            $param1,
            $param2 = [],
            \VisualComposer\Helpers\Core $core,
            \VisualComposer\Helpers\Templates $templates
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals(['second param'], $param2);
            $this->assertTrue(is_object($core));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        $this->container->call($func, ['param1' => 'params one', 'param2' => ['second param']]);
        $this->assertTrue($called, 'function must be called');
    }

    public function testBasicInjectionWithParamsObjectFirst()
    {
        $called = false;
        $func = function (
            \VisualComposer\Helpers\Core $core,
            \VisualComposer\Helpers\Templates $templates,
            $param1,
            $param2
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals(6, $param2);
            $this->assertTrue(is_object($core));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        $this->container->call($func, ['params one', 6]);
        $this->assertTrue($called, 'function must be called');
    }

    public function testBasicInjectionWithParamsObjectFirstAssoc()
    {
        $called = false;
        $func = function (
            \VisualComposer\Helpers\Core $core,
            \VisualComposer\Helpers\Templates $templates,
            $param1,
            $param2
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals(6, $param2);
            $this->assertTrue(is_object($core));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        $this->container->call($func, ['param1' => 'params one', 'param2' => 6]);
        $this->assertTrue($called, 'function must be called');
    }

    public function testBasicInjectionWithParamsAndDefaultsObjectFirst()
    {
        $called = false;
        $func = function (
            \VisualComposer\Helpers\Core $core,
            \VisualComposer\Helpers\Templates $templates,
            $param1,
            $param2 = []
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals([], $param2);
            $this->assertTrue(is_object($core));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        $this->container->call($func, ['params one']);
        $this->assertTrue($called, 'function must be called');
    }

    public function testBasicInjectionWithParamsAndDefaultsObjectFirstAssoc()
    {
        $called = false;
        $func = function (
            \VisualComposer\Helpers\Core $core,
            \VisualComposer\Helpers\Templates $templates,
            $param1,
            $param2 = []
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals([], $param2);
            $this->assertTrue(is_object($core));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        $this->container->call($func, ['param1' => 'params one']);
        $this->assertTrue($called, 'function must be called');
    }

    public function testBasicInjectionWithParamsAndDefaultsWithValuesObjectFirst()
    {
        $called = false;
        $func = function (
            \VisualComposer\Helpers\Core $core,
            \VisualComposer\Helpers\Templates $templates,
            $param1,
            $param2 = []
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals(['second param'], $param2);
            $this->assertTrue(is_object($core));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        $this->container->call($func, ['params one', ['second param']]);
        $this->assertTrue($called, 'function must be called');
    }

    public function testBasicInjectionWithParamsAndDefaultsWithValuesObjectFirstAssoc()
    {
        $called = false;
        $func = function (
            \VisualComposer\Helpers\Core $core,
            \VisualComposer\Helpers\Templates $templates,
            $param1,
            $param2 = []
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals(['second param'], $param2);
            $this->assertTrue(is_object($core));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        $this->container->call($func, ['param1' => 'params one', 'param2' => ['second param']]);
        $this->assertTrue($called, 'function must be called');
    }

    public function testInjectionWithCustomObjects()
    {
        $called = false;
        $func = function (
            $myObject,
            \VisualComposer\Helpers\Templates $templates,
            $param1,
            $param2 = []
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals([], $param2);
            $this->assertTrue(is_object($myObject));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        $this->container->call($func, [new stdClass(), 'params one']);
        $this->assertTrue($called, 'function must be called');
    }

    public function testInjectionWithCustomObjectsDeclaration()
    {
        $called = false;
        $func = function (
            stdClass $myObject,
            \VisualComposer\Helpers\Templates $templates,
            $param1,
            $param2 = []
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals([], $param2);
            $this->assertTrue(is_object($myObject));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        $this->container->call($func, [new stdClass(), 'params one']);
        $this->assertTrue($called, 'function must be called');
    }

    public function testInjectionWithCustomObjectsWithAllValues()
    {
        $called = false;
        $func = function (
            $myObject,
            $param1,
            $param2 = [],
            \VisualComposer\Helpers\Templates $templates
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals(['my second param'], $param2);
            $this->assertTrue(is_object($myObject));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        $this->container->call($func, [new stdClass(), 'params one', ['my second param']]);
        $this->assertTrue($called, 'function must be called');
    }

    public function testInjectionWithCustomObjectsWithAllValuesAndDi()
    {
        $helper = vcapp('TemplatesHelper');
        $called = false;
        $func = function (
            $myObject,
            $param1,
            $param2 = [],
            \VisualComposer\Helpers\Templates $templates
        ) use (
            &$called,
            &$helper
        ) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals(['my second param'], $param2);
            $this->assertTrue(is_object($myObject));
            $this->assertTrue(is_object($templates));
            $this->assertEquals($helper, $templates);
            $called = true;
        };
        $this->container->call($func, [new stdClass(), 'params one', ['my second param'], vcapp('TemplatesHelper')]);
        $this->assertTrue($called, 'function must be called');
    }
}

class  MyTestModule extends \VisualComposer\Framework\Container
{
    /**
     * Call the given callback and inject its dependencies.
     *
     * @param  $method
     * @param  array $parameters
     *
     * @return mixed
     */
    public function call($method, array $parameters = [])
    {
        return parent::call($method, $parameters);
    }

    private function pr(\VisualComposer\Helpers\Options $options, $data, stdClass $obj2, $test = [])
    {
        return is_numeric($data) && is_array($test) && count($test) == $data && isset($obj2->data);
    }

    public function pb(\VisualComposer\Helpers\Options $options, $data, stdClass $obj2, $test = [])
    {
        return is_numeric($data) && is_array($test) && count($test) == $data && isset($obj2->data);
    }
}