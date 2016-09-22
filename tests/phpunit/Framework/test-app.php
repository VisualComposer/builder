<?php

class AppTest extends WP_UnitTestCase
{
    public function testBootstrap()
    {
        $this->assertTrue((bool)did_action('vcv:boot'), 'vcv:boot action must be called');
    }

    public function testModuleEvents()
    {
        $this->assertTrue(is_object(vcapp('EventsHelper')));
        /**
         * @var $events VisualComposer\Helpers\Events
         */
        $events = vcapp('EventsHelper');
        $called = false;
        $events->listen(
            'test',
            function () use (&$called) {
                $called = true;
            }
        );
        $events->fire('test');
        $this->assertTrue($called, 'event must be called');

    }

    public function testModuleEventsDependencyInjection()
    {
        /**
         * @var $events VisualComposer\Helpers\Events
         */
        $events = vcapp('EventsHelper');
        $called = false;
        $evInstance = false;
        $events->listen(
            'test',
            function (\VisualComposer\Helpers\Events $inst) use (
                &$called,
                &$evInstance
            ) {
                $evInstance = $inst;
                $called = true;
            }
        );
        $events->fire('test');
        $this->assertTrue($called, 'event must be called');
        $this->assertTrue(is_object($evInstance), 'dependency injection must work');
        $this->assertTrue(method_exists($evInstance, 'fire'), 'method fire must exist for instance');
        $this->assertTrue(method_exists($evInstance, 'listen'), 'method listen must exist for instance');
        $this->assertEquals($events, $evInstance, 'dependnecy injected method should be same as vcapp');
    }

    public function testAppDI()
    {
        $called = false;
        $func = function (
            VisualComposer\Application $app0,
            VisualComposer\Framework\Application $app1,
            VisualComposer\Helpers\Events $events,
            VisualComposer\Framework\Illuminate\Container\Container $app3,
            VisualComposer\Framework\Illuminate\Contracts\Container\Container $app4
        ) use (&$called) {
            $this->assertTrue(is_object($events));
            $this->assertTrue(method_exists($events, 'fire'));
            $this->assertTrue(method_exists($events, 'listen'));
            $this->assertEquals($events, vcapp('EventsHelper'));
            $this->assertEquals($app0, $app1, 'it should be same instances');
            $this->assertEquals($app3, $app4, 'it should be same instances');
            $this->assertEquals($app0, vcapp(), 'it should be same instances');
            $this->assertEquals($app1, vcapp(), 'it should be same instances');
            $this->assertEquals($app3, vcapp(), 'it should be same instances');
            $this->assertEquals($app4, vcapp(), 'it should be same instances');
            $this->assertEquals($app1, vcapp()->make('App'), 'it should be same instances');
            $this->assertEquals($app1, vcapp('App'), 'it should be same instances');
            $called = true;
        };

        vcapp()->call($func);
        $this->assertTrue($called, 'function must be called');
    }

    public function testInit()
    {
        /** @var \VisualComposer\Helpers\Events $helper */
        $helper = vchelper('Events');
        $helper->forget('vcv:inited');
        $called = false;
        $arg = false;
        $callback = function ($app) use (&$called, &$arg) {
            $called = true;
            $arg = $app;
        };
        $helper->listen('vcv:inited', $callback);
        vcapp()->init();
        $this->assertTrue($called);
        $this->assertTrue(is_object($arg));
        $this->assertTrue($arg instanceof \VisualComposer\Application);
        $helper->forget('vcv:inited');
    }
}
