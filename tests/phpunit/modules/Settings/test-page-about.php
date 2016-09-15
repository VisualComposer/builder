<?php

class SettingsAboutPageTest extends WP_UnitTestCase
{
    public function testGetTabs()
    {
        /** @var \VisualComposer\Modules\Settings\Pages\About $module */
        $module = vcapp('\VisualComposer\Modules\Settings\Pages\About');
        $tabs = $module->getTabs();
        $this->assertTrue(is_array($tabs));
        $this->assertTrue(!empty($tabs));
        $this->assertEquals(
            [
                [
                    'slug' => 'vcv-main',
                    'title' => __('What\'s New', 'vc5'),
                    'view' => 'settings/pages/about/partials/main',
                ],
                [
                    'slug' => 'vcv-faq',
                    'title' => __('FAQ', 'vc5'),
                    'view' => 'settings/pages/about/partials/faq',
                ],
                [
                    'slug' => 'vcv-resources',
                    'title' => __('Resources', 'vc5'),
                    'view' => 'settings/pages/about/partials/resources',
                ],
            ],
            $tabs
        );
    }

    public function testAddPage()
    {
        /** @var \VisualComposer\Modules\Settings\Pages\About $module */
        $module = vc_create_module_mock('\VisualComposer\Modules\Settings\Pages\About');
        $pages = [];
        $newPages = $module->call('addPage', [$pages]);
        $this->assertTrue(is_array($newPages));
        $this->assertTrue(!empty($newPages));
        $this->assertEquals('vcv-about', $newPages[0]['slug']);
        $this->assertEquals(__('About', 'vc5'), $newPages[0]['title']);
        $this->assertEquals('standalone', $newPages[0]['layout']);
        $this->assertFalse($newPages[0]['showTab']);
        $this->assertTrue($newPages[0]['controller'] instanceof \VisualComposer\Modules\Settings\Pages\About);
    }

    public function testTemplate()
    {
        /** @var \VisualComposer\Modules\Settings\Pages\About $module */
        $module = vc_create_module_mock('\VisualComposer\Modules\Settings\Pages\About');

        $this->assertEquals([], $module->getTemplateArgs());
        $module->setTemplateArgs(['test' => 1]);
        $this->assertEquals(['test' => 1], $module->getTemplateArgs());

        $this->assertEquals('settings/pages/about/index', $module->getTemplatePath());
        $module->setTemplatePath('settings/pages/about/index2');
        $this->assertEquals('settings/pages/about/index2', $module->getTemplatePath());

        $this->assertEquals('vcv-about', $module->getSlug());
        $module->setSlug('vcv-about-2');
        $this->assertEquals('vcv-about-2', $module->getSlug());

        $module->call('beforeRender');
        $newArgs = $module->getTemplateArgs();
        $this->assertTrue(array_key_exists('tabs', $newArgs));
        $this->assertTrue(array_key_exists('activeTabSlug', $newArgs));
        $this->assertTrue(array_key_exists('hasAccessToSettings', $newArgs));
    }
}
