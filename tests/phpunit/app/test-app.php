<?php

class AppTest extends WP_UnitTestCase
{
    public function testCoreApi()
    {
        $app = vcapp();
        $this->assertTrue(is_object($app));
        $this->assertEquals($app, vcapp(), 'vcapp should return same object');
    }

    public function testBootstrap()
    {
        $this->assertTrue((bool)did_action('vcv:load'), 'vcv:load action must be called');
        $this->assertTrue((bool)did_action('vcv:boot'), 'vcv:boot action must be called');
    }

    public function testModuleEvents()
    {
        $this->assertTrue(is_object(vcapp('eventsHelper')));
        /**
         * @var $events VisualComposer\Framework\Illuminate\Contracts\Events\Dispatcher
         */
        $events = vcapp('eventsHelper');
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
         * @var $events VisualComposer\Framework\Illuminate\Contracts\Events\Dispatcher
         */
        $events = vcapp('eventsHelper');
        $called = false;
        $evInstance = false;
        $events->listen(
            'test',
            function (\VisualComposer\Framework\Illuminate\Contracts\Events\Dispatcher $inst) use (
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
            VisualComposer\Framework\Illuminate\Contracts\Foundation\Application $app2,
            VisualComposer\Framework\Illuminate\Contracts\Events\Dispatcher $events,
            VisualComposer\Framework\Illuminate\Container\Container $app3,
            VisualComposer\Framework\Illuminate\Contracts\Container\Container $app4
        ) use (&$called) {
            $this->assertTrue(is_object($events));
            $this->assertTrue(method_exists($events, 'fire'));
            $this->assertTrue(method_exists($events, 'listen'));
            $this->assertEquals($events, vcapp('eventsHelper'));
            $this->assertEquals($app0, $app1, 'it should be same instances');
            $this->assertEquals($app1, $app2, 'it should be same instances');
            $this->assertEquals($app2, $app3, 'it should be same instances');
            $this->assertEquals($app3, $app4, 'it should be same instances');
            $this->assertEquals($app0, vcapp(), 'it should be same instances');
            $this->assertEquals($app1, vcapp(), 'it should be same instances');
            $this->assertEquals($app2, vcapp(), 'it should be same instances');
            $this->assertEquals($app3, vcapp(), 'it should be same instances');
            $this->assertEquals($app4, vcapp(), 'it should be same instances');
            $this->assertEquals($app1, vcapp()->make('app'), 'it should be same instances');
            $this->assertEquals($app1, vcapp('app'), 'it should be same instances');
            $called = true;
        };

        vcapp()->call($func);
        $this->assertTrue($called, 'function must be called');
    }
}
