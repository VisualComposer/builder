<?php

class SettingsAboutPageTest extends WP_UnitTestCase
{
    public function testGetTabs()
    {
        /** @var \VisualComposer\Modules\Settings\Pages\About $module */
        $module = vcapp('\VisualComposer\Modules\Settings\Pages\About');
        vchelper('Token')->setSiteAuthorized();
        $tabs = $module->getTabs();
        $this->assertTrue(is_array($tabs));
        $this->assertTrue(!empty($tabs));
        $this->assertEquals(
            [
                [
                    'slug' => 'vcv-main',
                    'title' => __('What\'s New', 'vcwb'),
                    'view' => 'settings/pages/about/partials/main',
                ],
                [
                    'slug' => 'vcv-faq',
                    'title' => __('FAQ', 'vcwb'),
                    'view' => 'settings/pages/about/partials/faq',
                ],
                [
                    'slug' => 'vcv-resources',
                    'title' => __('Resources', 'vcwb'),
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
        $this->assertEquals(__('About', 'vcwb'), $newPages[0]['title']);
        $this->assertEquals('standalone', $newPages[0]['layout']);
        $this->assertFalse($newPages[0]['showTab']);
        $this->assertTrue($newPages[0]['controller'] instanceof \VisualComposer\Modules\Settings\Pages\About);
    }
}
