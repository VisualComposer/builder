<?php

class HelpersViewsTest extends WP_UnitTestCase
{
    public function testHelpersViews()
    {
        /**
         * @var $helper VisualComposer\Helpers\Views
         */
        $helper = vcapp('VisualComposer\Helpers\Views');
        $this->assertTrue(is_object($helper), 'Views helper should be an object');
        $this->assertTrue(method_exists($helper, 'render'), 'render method should exists');

        /** @var \VisualComposer\Framework\Illuminate\Filters\Dispatcher $filterHelper */
        $filterHelper = vchelper('Filters');
        $filterHelper->listen(
            'vcv:helpers:views:render:path',
            function ($path) {
                if (strpos($path, 'test-helpers.php') > 0) {
                    return __DIR__ . '/template-for-test.php';
                }

                return $path;
            }
        );

        $this->assertEquals('This is template for test!', $helper->render('test-helpers.php', [], false));
        $this->assertEquals('This is template for test!', $helper->render('test-helpers', [], false));

        $this->assertEquals(
            'This is template for test! Cool!',
            $helper->render('test-helpers.php', ['data' => ' Cool!'], false)
        );

        $this->assertEquals($helper, vcapp('VisualComposer\Helpers\Views'));
        $this->assertEquals($helper, vcapp('ViewsHelper'));
        $this->assertEquals(vcapp('VisualComposer\Helpers\Views'), vcapp('ViewsHelper'));
        $filterHelper->forget('vcv:helpers:views:render:path');
    }

    public function testHelpersDependencyInjection()
    {
        /**
         * @var $helper VisualComposer\Helpers\Views
         */
        $helper = vcapp('VisualComposer\Helpers\Views');

        $called = false;
        $teInstance = false;

        $data = function (\VisualComposer\Helpers\Views $templates) use (&$called, &$teInstance) {
            $teInstance = $templates;
            $called = true;
        };
        vcapp()->call($data);

        $this->assertTrue($called, 'closure should be called');
        $this->assertTrue(is_object($teInstance), 'teInstance should be injected');
        $this->assertEquals($helper, $teInstance, 'it should be same as $templateHelper');
        $this->assertTrue(method_exists($teInstance, 'render'), 'render method should exists');
    }
}
