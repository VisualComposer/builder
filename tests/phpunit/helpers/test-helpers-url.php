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

    public function testAjaxQuestion()
    {
        /**
         * @var $helper VisualComposer\Helpers\Url
         */
        $helper = vcapp('VisualComposer\Helpers\Url');
        $filter = function ($url) {
            return $url . '/?some=1';
        };
        add_filter('site_url', $filter);

        $this->assertEquals(
            rtrim(get_site_url(), '/\\') . '&vcv-ajax=1&test2=2',
            $helper->ajax(['test2' => 2]),
            'ajax should return url with amp not question'
        );

        remove_filter('site_url', $filter);
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

    public function testCurrent()
    {
        $helper = vchelper('Url');
        $url = $helper->current();
        $this->assertEquals(get_site_url(), $url);
    }

    public function testRedirect()
    {
        /** @var \VisualComposer\Helpers\Url $helper */
        $helper = $this->getMockBuilder('\VisualComposer\Helpers\Url')->setMethods(
            ['terminate']
        )->getMock();
        $helper->method('terminate')->will($this->returnValue(false));
        $callback = function () {
            return false;
        };

        // Assert To Redirect when logged-out
        add_filter('wp_redirect', $callback);
        wp_set_current_user(0);
        $false = $helper->redirectIfUnauthorized();
        remove_filter('wp_redirect', $callback);
        $this->assertFalse($false);

        // Assert to Ok when inside
        wp_set_current_user(1);
        add_filter('wp_redirect', $callback);
        $true = $helper->redirectIfUnauthorized();
        remove_filter('wp_redirect', $callback);
        $this->assertTrue($true);
    }
}
