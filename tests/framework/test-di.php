<?php

class DependencyInjectionTest extends WP_UnitTestCase
{
    public function testEmpty()
    {
        $called = false;
        $func = function () use (&$called) {
            $this->assertTrue(true, 'function should be called');
            $called = true;
        };
        vcapp()->call($func);
        $this->assertTrue($called, 'function must be called');
    }

    public function testDefaults()
    {
        $called = false;
        $func = function ($param = []) use (&$called) {
            $this->assertEquals([], $param);
            $called = true;
        };
        vcapp()->call($func);
        $this->assertTrue($called, 'function must be called');
    }

    public function testDefaultsWithValuesAssoc()
    {
        $called = false;
        $func = function ($param = []) use (&$called) {
            $this->assertEquals(['my param'], $param);
            $called = true;
        };
        vcapp()->call($func, ['param' => ['my param']]);
        $this->assertTrue($called, 'function must be called');
    }

    public function testDefaultsWithValues()
    {
        $called = false;
        $func = function ($param = []) use (&$called) {
            $this->assertEquals(['my param'], $param);
            $called = true;
        };
        vcapp()->call($func, [['my param']]);
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
        vcapp()->call($func, ['param1', 6]);
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
        vcapp()->call($func, ['param1' => 'param1', 'param2' => 6]);
        $this->assertTrue($called, 'function must be called');
    }

    public function testBasicInjection()
    {
        $called = false;
        $func = function (
            \VisualComposer\Helpers\Generic\Core $core,
            \VisualComposer\Helpers\Generic\Templates $templates
        ) use (&$called) {
            $this->assertTrue(is_object($core));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        vcapp()->call($func);
        $this->assertTrue($called, 'function must be called');
    }

    public function testBasicInjectionWithParams()
    {
        $called = false;
        $func = function (
            $param1,
            \VisualComposer\Helpers\Generic\Core $core,
            $param2,
            \VisualComposer\Helpers\Generic\Templates $templates
        ) use (&$called) {
            $this->assertEquals('params1', $param1);
            $this->assertEquals(4, $param2);
            $this->assertTrue(is_object($core));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        vcapp()->call($func, ['params1', 4]);
        $this->assertTrue($called, 'function must be called');
    }

    public function testBasicInjectionWithParamsAssoc()
    {
        $called = false;
        $func = function (
            $param1,
            $param2,
            \VisualComposer\Helpers\Generic\Core $core,
            \VisualComposer\Helpers\Generic\Templates $templates
        ) use (&$called) {
            $this->assertEquals('params1', $param1);
            $this->assertEquals(4, $param2);
            $this->assertTrue(is_object($core));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        vcapp()->call($func, ['param1' => 'params1', 'param2' => 4]);
        $this->assertTrue($called, 'function must be called');
    }

    public function testBasicInjectionWithParamsAndDefaults()
    {
        $called = false;
        $func = function (
            $param1,
            $param2 = [],
            \VisualComposer\Helpers\Generic\Core $core,
            \VisualComposer\Helpers\Generic\Templates $templates
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals([], $param2);
            $this->assertTrue(is_object($core));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        vcapp()->call($func, ['params one']);
        $this->assertTrue($called, 'function must be called');
    }

    public function testBasicInjectionWithParamsAndDefaultsAssoc()
    {
        $called = false;
        $func = function (
            $param1,
            $param2 = [],
            \VisualComposer\Helpers\Generic\Core $core,
            \VisualComposer\Helpers\Generic\Templates $templates
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals([], $param2);
            $this->assertTrue(is_object($core));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        vcapp()->call($func, ['param1' => 'params one']);
        $this->assertTrue($called, 'function must be called');
    }

    public function testBasicInjectionWithParamsAndDefaultsWithValue()
    {
        $called = false;
        $func = function (
            $param1,
            $param2 = [],
            \VisualComposer\Helpers\Generic\Core $core,
            \VisualComposer\Helpers\Generic\Templates $templates
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals(['second param'], $param2);
            $this->assertTrue(is_object($core));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        vcapp()->call($func, ['params one', ['second param']]);
        $this->assertTrue($called, 'function must be called');
    }

    public function testBasicInjectionWithParamsAndDefaultsWithValueAssoc()
    {
        $called = false;
        $func = function (
            $param1,
            $param2 = [],
            \VisualComposer\Helpers\Generic\Core $core,
            \VisualComposer\Helpers\Generic\Templates $templates
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals(['second param'], $param2);
            $this->assertTrue(is_object($core));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        vcapp()->call($func, ['param1' => 'params one', 'param2' => ['second param']]);
        $this->assertTrue($called, 'function must be called');
    }

    public function testBasicInjectionWithParamsObjectFirst()
    {
        $called = false;
        $func = function (
            \VisualComposer\Helpers\Generic\Core $core,
            \VisualComposer\Helpers\Generic\Templates $templates,
            $param1,
            $param2
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals(6, $param2);
            $this->assertTrue(is_object($core));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        vcapp()->call($func, ['params one', 6]);
        $this->assertTrue($called, 'function must be called');
    }

    public function testBasicInjectionWithParamsObjectFirstAssoc()
    {
        $called = false;
        $func = function (
            \VisualComposer\Helpers\Generic\Core $core,
            \VisualComposer\Helpers\Generic\Templates $templates,
            $param1,
            $param2
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals(6, $param2);
            $this->assertTrue(is_object($core));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        vcapp()->call($func, ['param1' => 'params one', 'param2' => 6]);
        $this->assertTrue($called, 'function must be called');
    }

    public function testBasicInjectionWithParamsAndDefaultsObjectFirst()
    {
        $called = false;
        $func = function (
            \VisualComposer\Helpers\Generic\Core $core,
            \VisualComposer\Helpers\Generic\Templates $templates,
            $param1,
            $param2 = []
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals([], $param2);
            $this->assertTrue(is_object($core));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        vcapp()->call($func, ['params one']);
        $this->assertTrue($called, 'function must be called');
    }

    public function testBasicInjectionWithParamsAndDefaultsObjectFirstAssoc()
    {
        $called = false;
        $func = function (
            \VisualComposer\Helpers\Generic\Core $core,
            \VisualComposer\Helpers\Generic\Templates $templates,
            $param1,
            $param2 = []
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals([], $param2);
            $this->assertTrue(is_object($core));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        vcapp()->call($func, ['param1' => 'params one']);
        $this->assertTrue($called, 'function must be called');
    }

    public function testBasicInjectionWithParamsAndDefaultsWithValuesObjectFirst()
    {
        $called = false;
        $func = function (
            \VisualComposer\Helpers\Generic\Core $core,
            \VisualComposer\Helpers\Generic\Templates $templates,
            $param1,
            $param2 = []
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals(['second param'], $param2);
            $this->assertTrue(is_object($core));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        vcapp()->call($func, ['params one', ['second param']]);
        $this->assertTrue($called, 'function must be called');
    }

    public function testBasicInjectionWithParamsAndDefaultsWithValuesObjectFirstAssoc()
    {
        $called = false;
        $func = function (
            \VisualComposer\Helpers\Generic\Core $core,
            \VisualComposer\Helpers\Generic\Templates $templates,
            $param1,
            $param2 = []
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals(['second param'], $param2);
            $this->assertTrue(is_object($core));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        vcapp()->call($func, ['param1' => 'params one', 'param2' => ['second param']]);
        $this->assertTrue($called, 'function must be called');
    }

    public function testInjectionWithCustomObjects()
    {
        $called = false;
        $func = function (
            $myObject,
            \VisualComposer\Helpers\Generic\Templates $templates,
            $param1,
            $param2 = []
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals([], $param2);
            $this->assertTrue(is_object($myObject));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        vcapp()->call($func, [new stdClass(), 'params one']);
        $this->assertTrue($called, 'function must be called');
    }

    public function testInjectionWithCustomObjectsDeclaration()
    {
        $called = false;
        $func = function (
            stdClass $myObject,
            \VisualComposer\Helpers\Generic\Templates $templates,
            $param1,
            $param2 = []
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals([], $param2);
            $this->assertTrue(is_object($myObject));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        vcapp()->call($func, [new stdClass(), 'params one']);
        $this->assertTrue($called, 'function must be called');
    }

    public function testInjectionWithCustomObjectsWithAllValues()
    {
        $called = false;
        $func = function (
            $myObject,
            $param1,
            $param2 = [],
            \VisualComposer\Helpers\Generic\Templates $templates
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals(['my second param'], $param2);
            $this->assertTrue(is_object($myObject));
            $this->assertTrue(is_object($templates));
            $called = true;
        };
        vcapp()->call($func, [new stdClass(), 'params one', ['my second param']]);
        $this->assertTrue($called, 'function must be called');
    }

    public function testInjectionWithCustomObjectsWithAllValuesAndDi()
    {
        $helper = vcapp('templatesHelper');
        $called = false;
        $func = function (
            $myObject,
            $param1,
            $param2 = [],
            \VisualComposer\Helpers\Generic\Templates $templates
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
        vcapp()->call($func, [new stdClass(), 'params one', ['my second param'], vcapp('templatesHelper')]);
        $this->assertTrue($called, 'function must be called');
    }
}
