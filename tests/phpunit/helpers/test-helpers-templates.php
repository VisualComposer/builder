<?php

class HelpersTemplatesTest extends WP_UnitTestCase
{
    public function testHelpersTemplates()
    {
        /**
         * @var $helper VisualComposer\Helpers\Templates
         */
        $helper = vcapp('VisualComposer\Helpers\Templates');
        $this->assertTrue(is_object($helper), 'Templates helper should be an object');
        $this->assertTrue(method_exists($helper, 'render'), 'render method should exists');

        /** @var \VisualComposer\Framework\Illuminate\Filters\Dispatcher $filterHelper */
        $filterHelper = vchelper('Filters');
        $filterHelper->listen(
            'vcv:helpers:templates:render:path',
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

        $this->assertEquals($helper, vcapp('VisualComposer\Helpers\Templates'));
        $this->assertEquals($helper, vcapp('TemplatesHelper'));
        $this->assertEquals(vcapp('VisualComposer\Helpers\Templates'), vcapp('TemplatesHelper'));
        $filterHelper->forget('vcv:helpers:templates:render:path');
    }

    public function testHelpersDependencyInjection()
    {
        /**
         * @var $helper VisualComposer\Helpers\Templates
         */
        $helper = vcapp('VisualComposer\Helpers\Templates');

        $called = false;
        $teInstance = false;

        $data = function (\VisualComposer\Helpers\Templates $templates) use (&$called, &$teInstance) {
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
