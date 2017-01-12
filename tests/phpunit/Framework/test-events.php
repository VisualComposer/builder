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

    public function testEventsWeightMore()
    {
        $helper = vchelper('Events');
        $value = 0;
        $helper->listen(
            'test_events_weight_more',
            function () use (&$value) {
                $value = 1;
            }
        );
        $helper->listen(
            'test_events_weight_more',
            function () use (&$value) {
                $value = 2;
            }
        );
        $helper->fire('test_events_weight_more');
        $this->assertEquals(2, $value);

        // If weight provided it will be called last
        $value = 0;
        $helper->listen(
            'test_events_weight_more:2',
            function () use (&$value) {
                $value = 1;
            },
            1
        );
        $helper->listen(
            'test_events_weight_more:2',
            function () use (&$value) {
                $value = 2;
            }
        );
        $helper->fire('test_events_weight_more:2');
        $this->assertEquals(1, $value);

        // If weight provided for both it will be sorted asc and with more weight will be called last
        $value = 0;
        $helper->listen(
            'test_events_weight_more:3',
            function () use (&$value) {
                $value = 1;
            },
            2
        );
        $helper->listen(
            'test_events_weight_more:3',
            function () use (&$value) {
                $value = 2;
            },
            1
        );
        $helper->fire('test_events_weight_more:3');
        $this->assertEquals(1, $value);
    }

    public function testEventsOrderingPriorityExact()
    {
        $helper = vchelper('Events');

        $value = 0;
        $helper->listen(
            'test_event_priority:1:*',
            function () use (&$value) {
                $value = 1;
            }
        );

        $helper->listen(
            'test_event_priority:1:exact',
            function () use (&$value) {
                $value = 2;
            }
        );

        $helper->fire('test_event_priority:1:exact');
        $this->assertEquals(2, $value);
    }

    public function testEventsOrderingPriorityExactReversed()
    {
        $helper = vchelper('Events');

        $value = 0;
        $helper->listen(
            'test_event_priority:2:exact',
            function () use (&$value) {
                $value = 2;
            }
        );

        $helper->listen(
            'test_event_priority:2:*',
            function () use (&$value) {
                $value = 1;
            }
        );
        $helper->fire('test_event_priority:2:exact');
        $this->assertEquals(2, $value);
    }

    public function testEventsOrderingPrioritySameWeight()
    {
        $helper = vchelper('Events');
        $value = 0;
        $helper->listen(
            'test_event_priority:3:*',
            function () use (&$value) {
                $value = 1;
            }
        );

        $helper->listen(
            'test_event_priority:3:*',
            function () use (&$value) {
                $value = 2;
            }
        );
        $helper->fire('test_event_priority:3:exact');
        $this->assertEquals(2, $value);
    }
}
