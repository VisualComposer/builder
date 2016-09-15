<?php

class SettingsHubPageTest extends WP_UnitTestCase
{
    public function testAddPage()
    {
        /** @var \VisualComposer\Modules\Settings\Pages\Hub $module */
        $module = vc_create_module_mock('\VisualComposer\Modules\Settings\Pages\Hub');
        $pages = [];
        $newPages = $module->call('addPage', [$pages]);
        $this->assertTrue(is_array($newPages));
        $this->assertTrue(!empty($newPages));
        $this->assertEquals('vcv-hub', $newPages[0]['slug']);
        $this->assertEquals($module->getSlug(), $newPages[0]['slug']);
        $this->assertEquals(__('HUB', 'vc5'), $newPages[0]['title']);
        $this->assertTrue($newPages[0]['controller'] instanceof \VisualComposer\Modules\Settings\Pages\Hub);
    }

    public function testTemplate()
    {
        /** @var \VisualComposer\Modules\Settings\Pages\Hub $module */
        $module = vc_create_module_mock('\VisualComposer\Modules\Settings\Pages\Hub');

        $this->assertEquals('settings/pages/hub/index', $module->getTemplatePath());

        $module->call('beforeRender');
        $this->assertEquals([], $module->getTemplateArgs());
    }
}
