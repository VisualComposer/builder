<?php

class TestMainPage extends WP_UnitTestCase
{
    public function testMainPageSlug()
    {
        $licenseHelper = vchelper('License');

        // Nothing activated
        $licenseHelper->setKey('');
        $licenseHelper->setType('');
        wp_set_current_user(0); // log out
        $this->assertEquals(
            'vcv-getting-started',
            vcapp(\VisualComposer\Modules\Settings\Pages\Settings::class)->getMainPageSlug()
        );

        wp_set_current_user(1); // user admin
        $this->assertEquals(
            'vcv-settings',
            vcapp(\VisualComposer\Modules\Settings\Pages\Settings::class)->getMainPageSlug()
        );

        wp_set_current_user(0); // log out
        // Activated free license
        $licenseHelper->setKey('test');
        $licenseHelper->setType('free');
        $this->assertEquals(
            'vcv-getting-started',
            vcapp(\VisualComposer\Modules\Settings\Pages\Settings::class)->getMainPageSlug()
        );

        // Activated premium license
        $licenseHelper->setKey('test');
        $licenseHelper->setType('premium');
        $this->assertTrue($licenseHelper->isPremiumActivated(), 'isPremiumActivated');
        $this->assertTrue($licenseHelper->isAnyActivated(), 'isAnyActivated');

        $this->assertEquals(
            'vcv-getting-started',
            vcapp(\VisualComposer\Modules\Settings\Pages\Settings::class)->getMainPageSlug()
        );

        wp_set_current_user(1); // super user
        $this->assertEquals(
            'vcv-settings',
            vcapp(\VisualComposer\Modules\Settings\Pages\Settings::class)->getMainPageSlug()
        );
    }
}
