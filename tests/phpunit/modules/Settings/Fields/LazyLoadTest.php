<?php

use VisualComposer\Modules\Settings\Fields\LazyLoad;
use VisualComposer\Modules\Settings\SettingsController;

class LazyLoadTest extends WP_UnitTestCase
{
    public function testBuildPage()
    {
        wp_set_current_user(1);

        $this->enableLazyLoad('1');

        $optionsHelper = vchelper('Options');
        $this->assertSame('1', $optionsHelper->get('settings-lazy-load-enabled'));

        $this->enableLazyLoad('');

        $this->assertSame('', $optionsHelper->get('settings-lazy-load-enabled'));

        $requestHelper = vchelper('Request');
        $requestHelper->setData([]);
    }

    public function testUnsetOptions()
    {
        wp_set_current_user(1);

        $this->enableLazyLoad('1');

        vcevent('vcv:system:factory:reset');

        $optionsHelper = vchelper('Options');

        $this->assertSame( false, $optionsHelper->get('settings-lazy-load-enabled'));

        $requestHelper = vchelper('Request');
        $requestHelper->setData([]);
    }

    public function testRenderToggle() {
        wp_set_current_user(1);

        $this->enableLazyLoad('1');

        $optionsHelper = vchelper('Options');

        $result = vcapp(LazyLoad::class)->renderToggle(true, $optionsHelper);

        $pattern = '|<input type="checkbox" value="1" name="vcv-settings-lazy-load-enabled" checked="checked" />|';
        $this->assertMatchesRegularExpression($pattern, $result);

        $this->enableLazyLoad('');

        $optionsHelper = vchelper('Options');

        $result = vcapp(LazyLoad::class)->renderToggle(true, $optionsHelper);

        $pattern = '|<input type="checkbox" value="1" name="vcv-settings-lazy-load-enabled"  />|';
        $this->assertMatchesRegularExpression($pattern, $result);
    }

    /**
     * Enable lazy load settings.
     *
     * @param string $value
     */
    public function enableLazyLoad($value) {
        vcapp(LazyLoad::class)->buildPage();

        $requestHelper = vchelper('Request');
        $requestHelper->setData(
            [
                'vcv-page-slug' => 'vcv-settings',
                'vcv-settings-lazy-load-enabled' => $value,
            ]
        );

        vcapp(SettingsController::class)->saveSettings(
            [], [], $requestHelper, false
        );
    }
}
