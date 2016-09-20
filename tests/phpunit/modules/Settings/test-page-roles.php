<?php

class SettingsRolesPageTest extends WP_UnitTestCase
{
    public function testAddPage()
    {
        /** @var \VisualComposer\Modules\Settings\Pages\Roles $module */
        $module = vc_create_module_mock('\VisualComposer\Modules\Settings\Pages\Roles');
        $pages = [];
        $newPages = $module->call('addPage', [$pages]);
        $this->assertTrue(is_array($newPages));
        $this->assertTrue(!empty($newPages));
        $this->assertEquals('vcv-roles', $newPages[0]['slug']);
        $this->assertEquals($module->getSlug(), $newPages[0]['slug']);
        $this->assertEquals(__('Role Manager', 'vc5'), $newPages[0]['title']);
        $this->assertTrue($newPages[0]['controller'] instanceof \VisualComposer\Modules\Settings\Pages\Roles);
    }

    public function testGetParts()
    {
        $parts = [
            'post_types',
            'backend_editor',
            'frontend_editor',
            'post_settings',
            'settings',
            'templates',
        ];

        /** @var \VisualComposer\Modules\Settings\Pages\Roles $module */
        $module = vcapp('\VisualComposer\Modules\Settings\Pages\Roles');
        $this->assertEquals($parts, $module->getParts());
    }

    public function testGetPartCapability()
    {
        /** @var \VisualComposer\Modules\Settings\Pages\Roles $module */
        $module = vcapp('\VisualComposer\Modules\Settings\Pages\Roles');

        // TODO: Remove this and refactor
        // Custom for settings
        $this->assertEquals('manage_options', $module->getPartCapability('settings'));
        $this->assertEquals(
            [
                'edit_posts',
                'edit_pages',
            ],
            $module->getPartCapability('any_other')
        );

        $this->assertEquals(
            [
                'edit_posts',
                'edit_pages',
            ],
            $module->getPartCapability('templates')
        );
    }

    public function testGetExcludedPostTypes()
    {

        /** @var \VisualComposer\Modules\Settings\Pages\Roles $module */
        $module = vcapp('\VisualComposer\Modules\Settings\Pages\Roles');
        $this->assertEquals(
            [
                'attachment',
                'revision',
                'nav_menu_item',
                'mediapage',
            ],
            $module->getExcludedPostTypes()
        );
    }
}
