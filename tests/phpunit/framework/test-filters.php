<?php

class TestFilters extends WP_UnitTestCase
{
    public function test_simple_filters()
    {
        /** @var \VisualComposer\Framework\Illuminate\Filters\Dispatcher $helper */
        $helper = vchelper('Filters');
        $helper->listen(
            'test-filter',
            function ($value) {
                return $value + 1;
            }
        );
        $helper->listen(
            'test-filter',
            function ($value) {
                return $value + 2;
            }
        );
        $helper->listen(
            'test-filter',
            function ($value) {
                return $value + 4;
            }
        );
        $helper->listen(
            'test-filter',
            function ($value) {
                return $value + 8;
            }
        );
        $helper->listen(
            'test-filter',
            function ($value) {
                return $value + 16;
            }
        );

        $value = $helper->fire('test-filter', 0);
        $this->assertEquals(1 + 2 + 4 + 8 + 16, $value);
        $this->assertTrue((bool)($value & 1), $value);
        $this->assertTrue((bool)($value & 2), $value);
        $this->assertTrue((bool)($value & 4), $value);
        $this->assertTrue((bool)($value & 8), $value);
        $this->assertTrue((bool)($value & 16), $value);
        $helper->forget('test-filter');
    }

    public function test_filters_weight()
    {
        /** @var \VisualComposer\Framework\Illuminate\Filters\Dispatcher $helper */
        $helper = vchelper('Filters');
        $helper->listen(
            'test-filter',
            function ($value) {
                return 1;
            },
            10
        );
        $helper->listen(
            'test-filter',
            function ($value) {
                return 2;
            },
            20
        );
        $helper->listen(
            'test-filter',
            function ($value) {
                return 4;
            },
            30
        );
        $helper->listen(
            'test-filter',
            function ($value) {
                return 8;
            },
            40
        );
        $helper->listen(
            'test-filter',
            function ($value) {
                return 16;
            },
            50
        );

        $value = $helper->fire('test-filter', 0);
        $this->assertEquals(16, $value);
        $this->assertFalse((bool)($value & 1), $value);
        $this->assertFalse((bool)($value & 2), $value);
        $this->assertFalse((bool)($value & 4), $value);
        $this->assertFalse((bool)($value & 8), $value);
        $this->assertTrue((bool)($value & 16), $value);
        $helper->forget('test-filter');
    }

    public function test_filters_weight_random()
    {
        /** @var \VisualComposer\Framework\Illuminate\Filters\Dispatcher $helper */
        $helper = vchelper('Filters');
        $helper->listen(
            'test-filter',
            function ($value) {
                return 1;
            },
            rand(0, 100)
        );
        $helper->listen(
            'test-filter',
            function ($value) {
                return 2;
            },
            rand(0, 100)
        );
        $helper->listen(
            'test-filter',
            function ($value) {
                return 4;
            },
            rand(0, 100)
        );
        $helper->listen(
            'test-filter',
            function ($value) {
                return 8;
            },
            rand(0, 100)
        );
        $helper->listen(
            'test-filter',
            function ($value) {
                return 16;
            },
            101
        );

        $value = $helper->fire('test-filter', 0);
        $this->assertEquals(16, $value);
        $this->assertFalse((bool)($value & 1), $value);
        $this->assertFalse((bool)($value & 2), $value);
        $this->assertFalse((bool)($value & 4), $value);
        $this->assertFalse((bool)($value & 8), $value);
        $this->assertTrue((bool)($value & 16), $value);
        $helper->forget('test-filter');
    }

    public function test_filters_weight_shuffle()
    {
        /** @var \VisualComposer\Framework\Illuminate\Filters\Dispatcher $helper */
        $helper = vchelper('Filters');
        $helper->listen(
            'test-filter',
            function ($value) {
                return 1;
            },
            20
        );
        $helper->listen(
            'test-filter',
            function ($value) {
                return 2;
            },
            10
        );
        $helper->listen(
            'test-filter',
            function ($value) {
                return 4;
            },
            30
        );
        $helper->listen(
            'test-filter',
            function ($value) {
                return 8;
            },
            50
        );
        $helper->listen(
            'test-filter',
            function ($value) {
                return 16;
            },
            10
        );

        $value = $helper->fire('test-filter', 0);
        $this->assertEquals(8, $value);
        $this->assertFalse((bool)($value & 1), $value);
        $this->assertFalse((bool)($value & 2), $value);
        $this->assertFalse((bool)($value & 4), $value);
        $this->assertTrue((bool)($value & 8), $value);
        $this->assertFalse((bool)($value & 16), $value);
        $helper->forget('test-filter');
    }

    public function test_filters_value_passing()
    {
        /** @var \VisualComposer\Framework\Illuminate\Filters\Dispatcher $helper */
        $helper = vchelper('Filters');
        $helper->listen(
            'test-filter',
            function ($value) {
                return $value - 100;
            },
            20
        );
        $helper->listen(
            'test-filter',
            function ($value) {
                return abs($value);
            },
            10
        );
        $helper->listen(
            'test-filter',
            function ($value) {
                return $value + 100;
            },
            30
        );
        $helper->listen(
            'test-filter',
            function ($value) {
                return abs($value);
            },
            50
        );
        $helper->listen(
            'test-filter',
            function ($value) {
                return $value - 100;
            },
            10
        );

        $value = $helper->fire('test-filter', 0);
        $this->assertEquals(100, $value);
        /*$this->assertFalse((bool)($value & 1), $value);
        $this->assertFalse((bool)($value & 2), $value);
        $this->assertFalse((bool)($value & 4), $value);
        $this->assertTrue((bool)($value & 8), $value);
        $this->assertFalse((bool)($value & 16), $value);*/
        $helper->forget('test-filter');
    }
}
