<?php

class SettingsGeneralPageTest extends WP_UnitTestCase
{
    public function testAddPage()
    {
        /** @var \VisualComposer\Modules\Settings\Pages\General $module */
        $module = vc_create_module_mock('\VisualComposer\Modules\Settings\Pages\General');
        $pages = [];
        $newPages = $module->call('addPage', [$pages]);
        $this->assertTrue(is_array($newPages));
        $this->assertTrue(!empty($newPages));
        $this->assertEquals('vcv-general', $newPages[0]['slug']);
        $this->assertEquals($module->getSlug(), $newPages[0]['slug']);
        $this->assertEquals(__('General Settings', 'vc5'), $newPages[0]['title']);
        $this->assertTrue($newPages[0]['controller'] instanceof \VisualComposer\Modules\Settings\Pages\General);
    }

    public function testExcludedFontsSubsets()
    {
        /** @var \VisualComposer\Modules\Settings\Pages\General $module */
        $module = vc_create_module_mock('\VisualComposer\Modules\Settings\Pages\General');

        /** @see \VisualComposer\Modules\Settings\Pages\General::getGoogleFontsSubsetsExcluded */
        $this->assertEquals([], $module->call('getGoogleFontsSubsetsExcluded'));

        /** \VisualComposer\Modules\Settings\Pages\General::setGoogleFontsSubsetsExcluded */
        $this->assertTrue($module->call('setGoogleFontsSubsetsExcluded', [['vietnamese']]));
        $this->assertFalse($module->call('setGoogleFontsSubsetsExcluded', ['wrong']));

        /** @see \VisualComposer\Modules\Settings\Pages\General::getGoogleFontsSubsetsExcluded */
        $this->assertEquals(['vietnamese'], $module->call('getGoogleFontsSubsetsExcluded'));

        $this->assertEquals(
            [
                ['title' => 'latin', 'checked' => true],
                ['title' => 'cyrillic', 'checked' => true],
                ['title' => 'latin-ext', 'checked' => true],
                ['title' => 'greek', 'checked' => true],
                ['title' => 'cyrillic-ext', 'checked' => true],
                ['title' => 'greek-ext', 'checked' => true],
            ],
            $module->call('getSubsets', ['vietnamese'])
        );
    }

    public function testFontsSubsets()
    {
        /** @var \VisualComposer\Modules\Settings\Pages\General $module */
        $module = vc_create_module_mock('\VisualComposer\Modules\Settings\Pages\General');

        /** @see \VisualComposer\Modules\Settings\Pages\General::getGoogleFontsSubsets */
        $this->assertEquals(
            [
                'latin',
                'vietnamese',
                'cyrillic',
                'latin-ext',
                'greek',
                'cyrillic-ext',
                'greek-ext',
            ],
            $module->call('getGoogleFontsSubsets')
        );
    }

    public function testSanitizeGoogleFontsSubsetsFieldCallback()
    {
        /** @var \VisualComposer\Modules\Settings\Pages\General $module */
        $module = vc_create_module_mock('\VisualComposer\Modules\Settings\Pages\General');

        /** \VisualComposer\Modules\Settings\Pages\General::setGoogleFontsSubsetsExcluded */
        $module->call('setGoogleFontsSubsetsExcluded', [['vietnamese']]);

        /** @see \VisualComposer\Modules\Settings\Pages\General::sanitizeGoogleFontsSubsetsFieldCallback */
        // Should return empty, because vietnamese is excluded
        $this->assertEquals([], $module->call('sanitizeGoogleFontsSubsetsFieldCallback', [['vietnamese']]));

        $this->assertEquals(
            ['greek'],
            $module->call('sanitizeGoogleFontsSubsetsFieldCallback', [['vietnamese', 'greek']])
        );

        $this->assertEquals(
            ['greek'],
            $module->call(
                'sanitizeGoogleFontsSubsetsFieldCallback',
                [['vietnamese', 'greek', 'any other']]
            )
        );
    }
}
