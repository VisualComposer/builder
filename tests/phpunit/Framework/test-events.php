<?php

class EventsTest extends WP_UnitTestCase
{
    public function testWildCardListener()
    {
        /** @var \VisualComposer\Helpers\Events $helper */
        $helper = vchelper('Events');
        $called = false;
        $arg = '';
        $callback = function ($payload) use (&$called, &$arg) {
            $called = true;
            $arg = $payload;
        };
        $helper->listen('*', $callback);
        $helper->fire('something::testWildCardListener', 'test');
        $this->assertTrue($called);
        $this->assertEquals('test', $arg);
        $helper->forgetWildcard('*');
    }

    public function testWildCardListenerExact()
    {
        /** @var \VisualComposer\Helpers\Events $helper */
        $helper = vchelper('Events');
        $called = false;
        $arg = '';
        $callback = function ($payload = 'default') use (&$called, &$arg) {
            $called = true;
            $arg = $payload;
        };
        $helper->listen('different:*', $callback);
        $helper->fire('different::testWildCardListener', 'test2');
        $this->assertTrue($called);
        $this->assertEquals('test2', $arg);

        // Different event
        $called = false;
        $helper->fire('diff');
        $this->assertFalse($called);

        $called = false;
        $helper->fire('different');
        $this->assertFalse($called);

        $called = false;
        $helper->fire('different:');
        $this->assertTrue($called);

        $called = false;
        $helper->fire('different:a');
        $this->assertTrue($called);

        $called = false;
        $helper->fire('different:*');
        $this->assertTrue($called);

        $called = false;
        $helper->fire('*');
        $this->assertFalse($called);

        $helper->forgetWildcard('different:*');
    }
}
