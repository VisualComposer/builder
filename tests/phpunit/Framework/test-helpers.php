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
         * @var $events VisualComposer\Helpers\Events
         */
        $events = vcapp('VisualComposer\Helpers\Events');
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
        /** @var \VisualComposer\Framework\Illuminate\Filters\Dispatcher $filterHelper */
        $filterHelper = vchelper('Filters');
        $filterHelper->listen(
            'vcv:helpers:views:render:path',
            $callback
        );
        $content = vcview('');
        $this->assertEquals('This is template for test!', $content);

        $content = vcview('', ['data' => ' DATA!']);
        $this->assertEquals('This is template for test! DATA!', $content);
        $filterHelper->forget('vcv:helpers:views:render:path');
    }
}
