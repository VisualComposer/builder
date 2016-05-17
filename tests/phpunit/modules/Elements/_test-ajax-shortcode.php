<?php
namespace Tests\PhpUnit\Modules\Elements;

class AjaxShortcodeTest extends \WP_UnitTestCase
{
    public function testRender()
    {
        /** @var \VisualComposer\Framework\Illuminate\Filters\Dispatcher $filterHelper */
        $filterHelper = vchelper('Filters');
        /** @var \VisualComposer\Helpers\Request $requestHelper */
        $requestHelper = vchelper('Request');
        $requestHelper->setData(['vcv-shortcode-string' => 'Hello World!']);
        $output = $filterHelper->fire('vcv:ajax:elements:ajaxShortcodeRender');
        $this->assertEquals('Hello World!', $output);
    }
}
