<?php

class HelpersDataTest extends WP_UnitTestCase
{
    public function testDataHelper()
    {
        /**
         * @var $helper VisualComposer\Helpers\Data
         */
        $helper = vcapp('VisualComposer\Helpers\Data');
        $this->assertTrue(is_object($helper), 'Data helper should be an object');
    }

    public function testArraySearch()
    {
        $helper = vcapp('VisualComposer\Helpers\Data');

        $arr = [
            [
                'test' => 1,
                'test2' => 2,
            ],
            [
                'test' => 3,
                'test2' => 4,
            ],
            [
                'test' => 5,
                'test2' => 6,
            ],
        ];

        $this->assertTrue(method_exists($helper, 'arraySearch'));

        $this->assertFalse($helper->arraySearch('not an array', 'test', 5));

        $this->assertFalse($helper->arraySearch($arr, 'test', 999));

        $this->assertEquals(
            [
                'test' => 5,
                'test2' => 6,
            ],
            $helper->arraySearch($arr, 'test', 5)
        );

        $this->assertEquals(
            2,
            $helper->arraySearch($arr, 'test2', 6, true)
        );
    }

    public function testArraySearchKey()
    {
        $helper = vcapp('VisualComposer\Helpers\Data');

        $arr = [
            [
                'test' => 1,
                'test2' => 2,
            ],
            [
                'test' => 3,
                'test2' => 4,
            ],
            [
                'test' => 5,
                'test2' => 6,
            ],
        ];

        $this->assertEquals($helper->arraySearchKey($arr, 'test'), 0);

        $this->assertFalse($helper->arraySearchKey('not an array', 'test'));

        $this->assertFalse($helper->arraySearchKey($arr, 'doesnt-exist'));

        $this->assertEquals($helper->arraySearchKey($arr, 'test', true), $arr[0]['test']);
    }

    public function testArrayUnique()
    {
        $helper = vchelper('Data');

        $arr1 = [
            1,
            1,
            2,
            2,
            3,
            3,
        ];

        $this->assertEquals(array_unique($arr1), $helper->arrayDeepUnique($arr1));

        $arr2 = [
            1,
            1,
            2,
            2,
            3,
            3,
            'a' => [
                'test' => 1,
                'test2' => 2,
            ],
            [
                'test' => 1,
                'test2' => 2,
            ],
            'b' => [
                'test' => 1,
                'test2' => 2,
            ],
            [
                'test' => 5,
                'test2' => 6,
            ],
            [
                'test' => 5,
                'test2' => 6,
            ],
            'd' => [
                'test' => 5,
                'test2' => 6,
            ],
        ];

        $this->assertEquals([
            0 => 1,
            2 => 2,
            4 => 3,
            'a' => [
                'test' => 1,
                'test2' => 2,
            ],
            7 => [
                'test' => 5,
                'test2' => 6,
            ],
        ], $helper->arrayDeepUnique($arr2));
    }
}
