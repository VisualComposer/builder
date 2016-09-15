<?php

class SettingsLicensePageTest extends WP_UnitTestCase
{
    public function testAddPage()
    {
        /** @var \VisualComposer\Modules\Settings\Pages\License $module */
        $module = vc_create_module_mock('\VisualComposer\Modules\Settings\Pages\License');
        $pages = [];
        $newPages = $module->call('addPage', [$pages]);
        $this->assertTrue(is_array($newPages));
        $this->assertTrue(!empty($newPages));
        $this->assertEquals('vcv-license', $newPages[0]['slug']);
        $this->assertEquals($module->getSlug(), $newPages[0]['slug']);
        $this->assertEquals(__('Product License', 'vc5'), $newPages[0]['title']);
        $this->assertTrue($newPages[0]['controller'] instanceof \VisualComposer\Modules\Settings\Pages\License);
    }

    public function testTemplate()
    {
        /** @var \VisualComposer\Modules\Settings\Pages\License $module */
        $module = vc_create_module_mock('\VisualComposer\Modules\Settings\Pages\License');

        $this->assertEquals('settings/pages/license/index', $module->getTemplatePath());

        $module->call('beforeRender');
        $this->assertEquals([], $module->getTemplateArgs());
    }

    public function testRender()
    {
        /** @var \VisualComposer\Modules\Settings\Pages\License $module */
        $module = vc_create_module_mock('\VisualComposer\Modules\Settings\Pages\License');

        $output = $module->call('render');
        $this->assertTrue(strpos($output, 'vc_settings-activation-deactivation') !== false);
    }
}
