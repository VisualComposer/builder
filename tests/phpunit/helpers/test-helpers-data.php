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
            $helper->arraySearch($arr, 'test', 5),
            [
                'test' => 5,
                'test2' => 6,
            ]
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
}
