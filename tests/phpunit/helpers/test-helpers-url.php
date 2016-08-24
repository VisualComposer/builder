<?php

class HelpersUrlTest extends WP_UnitTestCase
{
    public function testUrlHelper()
    {
        /**
         * @var $helper VisualComposer\Helpers\Url
         */
        $helper = vcapp('VisualComposer\Helpers\Url');

        $this->assertTrue(is_object($helper), 'Url helper should be an object');
    }

    public function testAssetUrl()
    {
        /**
         * @var $helper VisualComposer\Helpers\Url
         */
        $helper = vcapp('VisualComposer\Helpers\Url');

        $this->assertTrue(method_exists($helper, 'assetUrl'), 'method assetUrl() should exist');

        $this->assertEquals(VCV_PLUGIN_URL . 'visualcomposer/resources/', $helper->assetUrl(''));

        $this->assertEquals(VCV_PLUGIN_URL . 'visualcomposer/resources/', $helper->assetUrl('/'));

        $this->assertEquals(VCV_PLUGIN_URL . 'visualcomposer/resources/test', $helper->assetUrl('//test'));
    }

    public function testTo()
    {
        /**
         * @var $helper VisualComposer\Helpers\Url
         */
        $helper = vcapp('VisualComposer\Helpers\Url');

        $this->assertTrue(method_exists($helper, 'to'), 'method to() should exist');

        $this->assertEquals(VCV_PLUGIN_URL, $helper->to(''));

        $this->assertEquals(VCV_PLUGIN_URL . 'test', $helper->to('//test'));
    }

    public function testAjax()
    {
        /**
         * @var $helper VisualComposer\Helpers\Url
         */
        $helper = vcapp('VisualComposer\Helpers\Url');

        $this->assertTrue(method_exists($helper, 'ajax'), 'method ajax() should exist');

        $this->assertEquals(rtrim(get_site_url(), '/\\') . '/?vcv-ajax=1', $helper->ajax(), 'ajax should return url');

        $this->assertEquals(
            rtrim(get_site_url(), '/\\') . '/?vcv-ajax=1&test=1',
            $helper->ajax(['test' => 1]),
            'ajax should return url'
        );
    }


    public function testUrlHelperDependencyInjection()
    {
        /**
         * @var $helper VisualComposer\Helpers\Url
         */
        $helper = vcapp('VisualComposer\Helpers\Url');

        $called = false;
        $teInstance = false;

        $data = function (\VisualComposer\Helpers\Url $url) use (&$called, &$teInstance) {
            $teInstance = $url;
            $called = true;
        };

        vcapp()->call($data);

        $this->assertTrue($called, 'closure should be called');

        $this->assertTrue(is_object($teInstance), 'teInstance should be injected');

        $this->assertEquals($helper, $teInstance, 'it should be same as $urlHelper');

        $this->assertTrue(method_exists($teInstance, 'to'), 'isNetworkPlugin method should exists');

        $this->assertEquals(VCV_PLUGIN_URL, $teInstance->to(''), 'to should return plugin url should exist');
    }
}
