<?php

class HelpersTest extends WP_UnitTestCase
{
    protected $data = [
        'test0' => false,
        'test1' => 1,
        'test2' => 4,
        'test3' => 7,
        'test4' => 6,
        'test5' => 8,
    ];

    public function testHelpersTemplates()
    {
        /**
         * @var $templateHelper VisualComposer\Helpers\Templates
         */
        $templateHelper = vcapp('VisualComposer\Helpers\Templates');
        $this->assertTrue(is_object($templateHelper), 'templateHelper should be an object');
        $this->assertTrue(method_exists($templateHelper, 'render'), 'render method should exists');
        add_filter(
            'vcv:helpers:templates:render',
            function ($path) {
                if (strpos($path, 'test-helpers.php') > 0) {
                    return __DIR__ . '/template-for-test.php';
                }

                return $path;
            }
        );
        $this->assertEquals('This is template for test!', $templateHelper->render('test-helpers.php', [], false));
        $this->assertEquals(
            'This is template for test! Cool!',
            $templateHelper->render(
                'test-helpers.php',
                ['data' => ' Cool!'],
                false
            )
        );

        $this->assertEquals($templateHelper, vcapp('VisualComposer\Helpers\Templates'));

        $this->assertEquals($templateHelper, vcapp('TemplatesHelper'));
        $this->assertEquals(vcapp('VisualComposer\Helpers\Templates'), vcapp('TemplatesHelper'));
    }

    public function testHelpersDependencyInjection()
    {
        /**
         * @var $templateHelper VisualComposer\Helpers\Templates
         */
        $templateHelper = vcapp('VisualComposer\Helpers\Templates');
        $called = false;
        $teInstance = false;

        $data = function (\VisualComposer\Helpers\Templates $templates) use (&$called, &$teInstance) {
            $teInstance = $templates;
            $called = true;
        };

        vcapp()->call($data);
        $this->assertTrue($called, 'closure should be called');
        $this->assertTrue(is_object($teInstance), 'teInstance should be injected');
        $this->assertEquals($templateHelper, $teInstance, 'it should be same as $templateHelper');
        $this->assertTrue(method_exists($teInstance, 'render'), 'render method should exists');
    }

    public function testCoreHelper()
    {
        /**
         * @var $coreHelper VisualComposer\Helpers\Core
         */
        $coreHelper = vcapp('VisualComposer\Helpers\Core');
        $this->assertTrue(is_object($coreHelper), 'coreHelper should be an object');
        $this->assertTrue(method_exists($coreHelper, 'isNetworkPlugin'), 'isNetworkPlugin should exist');

        if (is_multisite()) {
            $this->assertTrue(
                $coreHelper->isNetworkPlugin(),
                'if multisite it should be network plugin'
            );
        } else {
            $this->assertTrue(
                !$coreHelper->isNetworkPlugin(),
                'if not multisite it should not be network plugin'
            );
        }
    }

    public function testHelpersCoreDependencyInjection()
    {
        /**
         * @var $coreHelper VisualComposer\Helpers\Core
         */
        $coreHelper = vcapp('VisualComposer\Helpers\Core');
        $called = false;
        $teInstance = false;

        $data = function (\VisualComposer\Helpers\Core $core) use (&$called, &$teInstance) {
            $teInstance = $core;
            $called = true;
        };

        vcapp()->call($data);
        $this->assertTrue($called, 'closure should be called');
        $this->assertTrue(is_object($teInstance), 'teInstance should be injected');
        $this->assertEquals($coreHelper, $teInstance, 'it should be same as $coreHelper');
        $this->assertTrue(method_exists($teInstance, 'isNetworkPlugin'), 'isNetworkPlugin method should exists');
    }

    public function testUrlHelper()
    {
        /**
         * @var $urlHelper VisualComposer\Helpers\Url
         */
        $urlHelper = vcapp('VisualComposer\Helpers\Url');
        $this->assertTrue(is_object($urlHelper), '$urlHelper should be an object');
        $this->assertTrue(method_exists($urlHelper, 'to'), 'to should exist');
        $this->assertTrue(method_exists($urlHelper, 'ajax'), 'ajax should exist');
        $this->assertTrue(method_exists($urlHelper, 'assetUrl'), 'assetUrl should exist');

        $this->assertEquals(VCV_PLUGIN_URL, $urlHelper->to(''), 'to should return plugin url should exist');
        $this->assertEquals(
            VCV_PLUGIN_URL . 'test',
            $urlHelper->to('//test'),
            'to should return plugin url with test'
        );
        $this->assertEquals(
            rtrim(get_site_url(), '/\\') . '/?vcv-ajax=1',
            $urlHelper->ajax(),
            'ajax should return url'
        );
        $this->assertEquals(
            rtrim(get_site_url(), '/\\') . '/?test=1&vcv-ajax=1',
            $urlHelper->ajax(['test' => 1]),
            'ajax should return url'
        );
    }

    public function testUrlHelperDependencyInjection()
    {
        /**
         * @var $urlHelper VisualComposer\Helpers\Url
         */
        $urlHelper = vcapp('VisualComposer\Helpers\Url');
        $called = false;
        $teInstance = false;

        $data = function (\VisualComposer\Helpers\Url $url) use (&$called, &$teInstance) {
            $teInstance = $url;
            $called = true;
        };

        vcapp()->call($data);
        $this->assertTrue($called, 'closure should be called');
        $this->assertTrue(is_object($teInstance), 'teInstance should be injected');
        $this->assertEquals($urlHelper, $teInstance, 'it should be same as $urlHelper');
        $this->assertTrue(method_exists($teInstance, 'to'), 'isNetworkPlugin method should exists');

        $this->assertEquals(VCV_PLUGIN_URL, $teInstance->to(''), 'to should return plugin url should exist');
    }

    public function testDataHelper()
    {
        /**
         * @var $dataHelper VisualComposer\Helpers\Data
         */
        $dataHelper = vcapp('VisualComposer\Helpers\Data');
        $this->assertTrue(is_object($dataHelper));

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

        $this->assertTrue(method_exists($dataHelper, 'arraySearch'), 'arraySearch should exist in $dataHelper');
        $this->assertEquals(
            $dataHelper->arraySearch($arr, 'test', 5),
            [
                'test' => 5,
                'test2' => 6,
            ],
            'Value should not be false'
        );
        $this->assertEquals($dataHelper->arraySearchKey($arr, 'test'), 0, 'Value should not be false');
        $this->assertEquals(
            $dataHelper->arraySearchKey($arr, 'test', true),
            $arr[0]['test'],
            'Value should be 1'
        );
    }

    public function testRequestHelper()
    {
        /**
         * @var $helper VisualComposer\Helpers\Request
         */
        $helper = vcapp('VisualComposer\Helpers\Request');
        $this->assertTrue(is_object($helper), 'request helper should be an object');
        $helper->setData(
            $this->data
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
            $helper->input(),
            'it should be equals to this->data'
        );
        $this->assertEquals(
            $this->data,
            $helper->input(),
            'it should be equals to this->data'
        );

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

        $helper->setData(
            $this->data
        );
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
