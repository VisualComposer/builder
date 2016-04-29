<?php

class FrameworkHelpersTest extends WP_UnitTestCase
{
    public function testVcApp()
    {
        $this->assertTrue(is_object(vcapp()));
        $this->assertEquals(vcapp(), vcapp());
        $this->assertEquals(VCV_PLUGIN_DIR_PATH, vcapp()->path());
    }

    public function testVcEvent()
    {
        /**
         * @var $events VisualComposer\Framework\Illuminate\Contracts\Events\Dispatcher
         */
        $events = vchelper('Events');
        $called = false;
        $events->listen(
            'test',
            function () use (&$called) {
                $called = true;
            }
        );
        vcevent('test');
        $this->assertTrue($called, 'event must be called');
    }

    public function testVcHelper()
    {
        /** @var  \VisualComposer\Helpers\Str $helper */
        $helper = vchelper('Str');

        $this->assertTrue($helper->endsWith('visual composer rocks', 'rocks'));
    }

    public function testVcView()
    {
        $callback = function () {
            $path = rtrim(__DIR__, '/\\') . '/template-for-test.php';
            $realpath = realpath($path);

            return $realpath;
        };
        add_filter(
            'vcv:helpers:templates:render:path',
            $callback
        );
        ob_start();
        vcview('');
        $content = ob_get_clean();
        $this->assertEquals('This is template for test!', $content);

        ob_start();
        $returnValue = vcview('', ['data' => ' DATA!']);
        $content = ob_get_clean();
        $this->assertEquals('This is template for test! DATA!', $content);
        $this->assertEquals($returnValue, $content);
        remove_filter('vcv:helpers:templates:render:path', $callback);
    }
}