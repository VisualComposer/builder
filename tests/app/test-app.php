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
        $this->assertTrue((bool)did_action('vc:v:load'), 'vc:v:load action must be called');
        $this->assertTrue((bool)did_action('vc:v:boot'), 'vc:v:boot action must be called');
    }

    public function testModuleEvents()
    {
        $this->assertTrue(is_object(vcapp('events')));
        /**
         * @var $events VisualComposer\Framework\Illuminate\Contracts\Events\Dispatcher
         */
        $events = vcapp('events');
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
        $events = vcapp('events');
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
    }
}