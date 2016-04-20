<?php

class HelpersRequestTest extends WP_UnitTestCase
{
    protected $data = [
        'test0' => false,
        'test1' => 1,
        'test2' => 4,
        'test3' => 7,
        'test4' => 6,
        'test5' => 8,
    ];

    public function testRequestHelper()
    {
        /**
         * @var $helper VisualComposer\Helpers\Request
         */
        $helper = vcapp('VisualComposer\Helpers\Request');

        $this->assertTrue(is_object($helper), 'Request helper should be an object');

        $helper->setData($this->data);

        $this->assertEquals(
            [
                'test0' => false, // from POST
                'test1' => 1, // from POST
                'test2' => 4, // from GET (overrides POST)
                'test3' => 7, // from REQUEST (overrides GET)
                'test4' => 6, // from GET
                'test5' => 8, //from REQUEST
            ],
            $helper->input(),
            'it should be equals to this->data'
        );

        $this->assertEquals($this->data, $helper->input(), 'it should be equals to this->data');

        $this->assertTrue($helper->exists('test0'));
        $this->assertTrue($helper->exists('test1'));
        $this->assertTrue($helper->exists('test2'));
        $this->assertTrue($helper->exists('test3'));
        $this->assertTrue($helper->exists('test4'));
        $this->assertTrue($helper->exists('test5'));
        $this->assertFalse($helper->exists('not-exists'));

        $this->assertEquals(false, $helper->input('test0'));
        $this->assertEquals(1, $helper->input('test1'));
        $this->assertEquals(4, $helper->input('test2'));
        $this->assertEquals(7, $helper->input('test3'));
        $this->assertEquals(6, $helper->input('test4'));
        $this->assertEquals(8, $helper->input('test5'));

        $this->assertEquals(false, $helper->test0);
        $this->assertEquals(1, $helper->test1);
        $this->assertEquals(4, $helper->test2);
        $this->assertEquals(7, $helper->test3);
        $this->assertEquals(6, $helper->test4);
        $this->assertEquals(8, $helper->test5);

        $this->assertNull($helper->notexisted);

        $helper->setData(null);
    }

    public function testRequestHelperDependencyInjection()
    {
        /**
         * @var $helper VisualComposer\Helpers\Request
         */
        $helper = vcapp('VisualComposer\Helpers\Request');

        $helper->setData($this->data);
        $called = false;
        $teInstance = false;

        $data = function (\VisualComposer\Helpers\Request $request) use (&$called, &$teInstance) {
            $teInstance = $request;
            $called = true;
        };

        vcapp()->call($data);

        $this->assertTrue($called, 'closure should be called');

        $this->assertTrue(is_object($teInstance), 'teInstance should be injected');

        $this->assertEquals($helper, $teInstance, 'it should be same as $helper');

        $this->assertTrue(method_exists($teInstance, 'input'), 'isNetworkPlugin method should exists');

        $this->assertEquals(
            $this->data,
            $teInstance->input(),
            'it should be equals to this->data'
        );

        $this->assertEquals(
            [
                'test0' => false, // from POST
                'test1' => 1, // from POST
                'test2' => 4, // from GET (overrides POST)
                'test3' => 7, // from REQUEST (overrides GET)
                'test4' => 6, // from GET
                'test5' => 8, //from REQUEST
            ],
            $teInstance->input(),
            'it should be equals to this->data'
        );

        $helper->setData(null);
    }
}
