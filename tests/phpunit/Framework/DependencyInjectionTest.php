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
            \VisualComposer\Helpers\Views $templates
        ) use (&$called) {
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
            \VisualComposer\Helpers\Views $templates,
            $param2
        ) use (&$called) {
            $this->assertEquals('params1', $param1);
            $this->assertEquals(4, $param2);
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
            \VisualComposer\Helpers\Views $templates
        ) use (&$called) {
            $this->assertEquals('params1', $param1);
            $this->assertEquals(4, $param2);
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
            \VisualComposer\Helpers\Views $templates
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals([], $param2);
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
            \VisualComposer\Helpers\Views $templates
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals([], $param2);
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
            \VisualComposer\Helpers\Views $templates
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals(['second param'], $param2);
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
            \VisualComposer\Helpers\Views $templates
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals(['second param'], $param2);
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
            \VisualComposer\Helpers\Views $templates,
            $param1,
            $param2
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals(6, $param2);
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
            \VisualComposer\Helpers\Views $templates,
            $param1,
            $param2
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals(6, $param2);
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
            \VisualComposer\Helpers\Views $templates,
            $param1,
            $param2 = []
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals([], $param2);
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
            \VisualComposer\Helpers\Views $templates,
            $param1,
            $param2 = []
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals([], $param2);
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
            \VisualComposer\Helpers\Views $templates,
            $param1,
            $param2 = []
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals(['second param'], $param2);
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
            \VisualComposer\Helpers\Views $templates,
            $param1,
            $param2 = []
        ) use (&$called) {
            $this->assertEquals('params one', $param1);
            $this->assertEquals(['second param'], $param2);
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
            \VisualComposer\Helpers\Views $templates,
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
            \VisualComposer\Helpers\Views $templates,
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
            \VisualComposer\Helpers\Views $templates
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
        $helper = vcapp('ViewsHelper');
        $called = false;
        $func = function (
            $myObject,
            $param1,
            $param2 = [],
            \VisualComposer\Helpers\Views $templates
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
        vcapp()->call($func, [new stdClass(), 'params one', ['my second param'], vcapp('ViewsHelper')]);
        $this->assertTrue($called, 'function must be called');
    }

    public function testDiDefaultParams()
    {
        $called = false;
        $func = function (
            $response = '',
            $payload = [],
            \VisualComposer\Helpers\Options $optionsHelper
        ) use (
            &$called
        ) {
            $called = true;
        };
        vcapp()->call($func);
        $this->assertTrue($called, 'function must be called');
    }

    public function testDiDefaultParamsFilter()
    {
        $called = false;
        $func = function (
            $response = '',
            $payload = [],
            \VisualComposer\Helpers\Options $optionsHelper
        ) use (
            &$called
        ) {
            $called = true;
            $this->assertTrue(is_array($response));
            $this->assertTrue(is_object($optionsHelper));

            return $response;
        };
        vchelper('Filters')->listen('vcv:test:testDiDefaultParamsFilter', $func);
        $result = vcfilter('vcv:test:testDiDefaultParamsFilter', ['test']);
        $this->assertTrue($called, 'function must be called');
        $this->assertEquals(['test'], $result, 'results must be same');
    }

    public function testDiDefaultParamsFilterLast()
    {
        $called = false;
        $func = function (
            \VisualComposer\Helpers\Options $optionsHelper,
            $response = '',
            $payload = []
        ) use (
            &$called
        ) {
            $called = true;
            $this->assertTrue(is_array($response));
            $this->assertTrue(is_object($optionsHelper));

            return $response;
        };
        vchelper('Filters')->listen('vcv:test:testDiDefaultParamsFilterLast', $func);
        $result = vcfilter('vcv:test:testDiDefaultParamsFilterLast', ['test']);
        $this->assertTrue($called, 'function must be called');
        $this->assertEquals(['test'], $result, 'results must be same');
    }

    public function testDiDefaultParamsEvent()
    {
        $called = false;
        $func = function (
            $response = '',
            $payload = [],
            \VisualComposer\Helpers\Options $optionsHelper
        ) use (
            &$called
        ) {
            $called = true;
            $this->assertTrue(is_string($response));
            $this->assertTrue(is_object($optionsHelper));

            return $response;
        };
        vchelper('Events')->listen('vcv:test:testDiDefaultParamsEvent', $func);
        vcevent('vcv:test:testDiDefaultParamsEvent', ['something']);
        $this->assertTrue($called, 'function must be called');
    }

    public function testDiDefaultParamsEventLast()
    {
        $called = false;
        $func = function (
            \VisualComposer\Helpers\Options $optionsHelper,
            $response = '',
            $payload = []
        ) use (
            &$called
        ) {
            $called = true;
            $this->assertTrue(is_object($optionsHelper));
            $this->assertTrue(is_string($response));

            return $response;
        };
        vchelper('Events')->listen('vcv:test:testDiDefaultParamsEventLast', $func);
        vcevent('vcv:test:testDiDefaultParamsEventLast', ['something']);
        $this->assertTrue($called, 'function must be called');
    }

    public function testAllowDiDirectCall()
    {
        $called = false;
        $resA = null;
        $resB = null;
        $resApp = null;
        $func = function ($a, $b, $app) use (&$called, &$resA, &$resB, &$resApp) {
            $called = true;
            $resA = $a;
            $resB = $b;
            $resApp = $app;
        };

        vcapp()->call($func, ['a' => 'test', 'b' => 1, 'app' => vcapp()]);
        $this->assertTrue($called);
        $this->assertEquals('test', $resA);
        $this->assertEquals(1, $resB);
        $this->assertTrue($resApp instanceof \VisualComposer\Application);
        $this->assertEquals(vcapp(), $resApp);
    }

    public function testAllowDiArgumentSwap()
    {
        $called = false;
        $resA = null;
        $resB = null;
        $resApp = null;
        $func = function ($b, $a, $app) use (&$called, &$resA, &$resB, &$resApp) {
            $called = true;
            $resA = $a;
            $resB = $b;
            $resApp = $app;
        };

        vcapp()->call($func, ['a' => 'test', 'b' => 1, 'app' => vcapp()]);
        $this->assertTrue($called);
        $this->assertEquals('test', $resA);
        $this->assertEquals(1, $resB);
        $this->assertTrue($resApp instanceof \VisualComposer\Application);
        $this->assertEquals(vcapp(), $resApp);
    }

    public function testAllowDiArgumentSwapWithDefault()
    {
        $called = false;
        $resA = null;
        $resB = null;
        $resApp = null;
        $func = function ($b = 0, $a, $app) use (&$called, &$resA, &$resB, &$resApp) {
            $called = true;
            $resA = $a;
            $resB = $b;
            $resApp = $app;
        };

        vcapp()->call($func, ['a' => 'test', 'app' => vcapp()]);
        $this->assertTrue($called);
        $this->assertEquals('test', $resA);
        $this->assertEquals(0, $resB);
        $this->assertTrue($resApp instanceof \VisualComposer\Application);
        $this->assertEquals(vcapp(), $resApp);
    }

    public function testAllowDiArgumentSwapObjects()
    {
        $called = false;
        $resA = null;
        $resB = null;
        $resApp = null;
        $func = function ($b, $a, \VisualComposer\Application $app) use (&$called, &$resA, &$resB, &$resApp) {
            $called = true;
            $resA = $a;
            $resB = $b;
            $resApp = $app;
        };

        vcapp()->call($func, ['a' => 'test', 'b' => 1]);
        $this->assertTrue($called);
        $this->assertEquals('test', $resA);
        $this->assertEquals(1, $resB);
        $this->assertTrue($resApp instanceof \VisualComposer\Application);
        $this->assertEquals(vcapp(), $resApp);
    }

    public function testAllowDiArgumentSwapObjectsDefault()
    {
        $called = false;
        $resA = null;
        $resB = null;
        $resApp = null;
        $func = function (
            \VisualComposer\Application $app,
            \VisualComposer\Helpers\Request $req,
            $b = 1,
            $a = 'test'
        ) use (&$called, &$resA, &$resB, &$resApp) {
            $called = true;
            $resA = $a;
            $resB = $b;
            $resApp = $app;
        };

        vcapp()->call($func);
        $this->assertTrue($called);
        $this->assertEquals('test', $resA);
        $this->assertEquals(1, $resB);
        $this->assertTrue($resApp instanceof \VisualComposer\Application);
        $this->assertEquals(vcapp(), $resApp);
    }

    public function testAllowDiArgumentSwapObjectsNoDefault()
    {
        $called = false;
        $resA = null;
        $resB = null;
        $resApp = null;
        $func = function (
            \VisualComposer\Application $app,
            \VisualComposer\Helpers\Request $req,
            $b = 1,
            $a = 'test'
        ) use (&$called, &$resA, &$resB, &$resApp) {
            $called = true;
            $resA = $a;
            $resB = $b;
            $resApp = $app;
        };

        vcapp()->call($func, [vcapp(), 2, 'test2']);
        $this->assertTrue($called);
        $this->assertEquals('test2', $resA);
        $this->assertEquals(2, $resB);
        $this->assertTrue($resApp instanceof \VisualComposer\Application);
        $this->assertEquals(vcapp(), $resApp);
    }
}
