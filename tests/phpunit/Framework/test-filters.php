<?php

class FiltersTest extends WP_UnitTestCase
{
    public function testSimpleFiltering()
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

    public function testFiltersWeightMore()
    {
        $helper = vchelper('Filters');
        $helper->listen(
            'test_filters_weight_more',
            function () {
                return 1;
            }
        );
        $helper->listen(
            'test_filters_weight_more',
            function () {
                return 2;
            }
        );
        $this->assertEquals(2, $helper->fire('test_filters_weight_more'));

        // If weight provided it will be called last
        $helper->listen(
            'test_filters_weight_more:2',
            function () {
                return 1;
            },
            1
        );
        $helper->listen(
            'test_filters_weight_more:2',
            function () {
                return 2;
            }
        );
        $this->assertEquals(1, $helper->fire('test_filters_weight_more:2'));

        // If weight provided for both it will be sorted asc and with more weight will be called last
        $helper->listen(
            'test_filters_weight_more:3',
            function () {
                return 1;
            },
            2
        );
        $helper->listen(
            'test_filters_weight_more:3',
            function () {
                return 2;
            },
            1
        );
        $this->assertEquals(1, $helper->fire('test_filters_weight_more:3'));
    }

    public function testFiltersWeight()
    {
        /** @var \VisualComposer\Framework\Illuminate\Filters\Dispatcher $helper */
        $helper = vcapp('VisualComposer\Helpers\Filters');
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

    public function testFiltersWeightRandom()
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

        $value = vcfilter('test-filter', 0);
        $this->assertEquals(16, $value);
        $this->assertFalse((bool)($value & 1), $value);
        $this->assertFalse((bool)($value & 2), $value);
        $this->assertFalse((bool)($value & 4), $value);
        $this->assertFalse((bool)($value & 8), $value);
        $this->assertTrue((bool)($value & 16), $value);
        $helper->forget('test-filter');
    }

    public function testFiltersWeightShuffle()
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

        $value = vcfilter('test-filter', 0);
        $this->assertEquals(8, $value);
        $this->assertFalse((bool)($value & 1), $value);
        $this->assertFalse((bool)($value & 2), $value);
        $this->assertFalse((bool)($value & 4), $value);
        $this->assertTrue((bool)($value & 8), $value);
        $this->assertFalse((bool)($value & 16), $value);
        $helper->forget('test-filter');
    }

    public function testFiltersValuePassing()
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
        // 0 abs
        // 0 - 100
        // -100 - 100
        // -200 + 100
        // -100 abs
        // 100
        $this->assertEquals(100, $value);

        $helper->forget('test-filter');
    }

    public function testFilterOrderingPriorityExact()
    {
        $helper = vchelper('Filters');

        $helper->listen(
            'test_filter_priority:*',
            function () {
                return 1;
            }
        );

        $helper->listen(
            'test_filter_priority:exact',
            function () {
                return 2;
            }
        );

        $this->assertEquals(2, $helper->fire('test_filter_priority:exact'));
    }

    public function testFilterOrderingPriorityExactReversed()
    {
        $helper = vchelper('Filters');

        $helper->listen(
            'test_filter_priority:1:exact',
            function () {
                return 2;
            }
        );

        $helper->listen(
            'test_filter_priority:1:*',
            function () {
                return 1;
            }
        );

        $this->assertEquals(2, $helper->fire('test_filter_priority:1:exact'));
    }

    public function testFilterOrderingPrioritySameWeight()
    {
        $helper = vchelper('Filters');

        $helper->listen(
            'test_filter_priority:2:*',
            function () {
                return 1;
            }
        );

        $helper->listen(
            'test_filter_priority:2:*',
            function () {
                return 2;
            }
        );

        $this->assertEquals(2, $helper->fire('test_filter_priority:2:exact'));
    }
}
