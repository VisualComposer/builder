<?php

class LazyLoadTest extends WP_UnitTestCase
{
    /**
     * @throws \ReflectionException
     */
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

    /**
     * @throws \ReflectionException
     */
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

    /**
     * @throws \ReflectionException
     */
    public function testRenderToggle() {
        wp_set_current_user(1);

        $this->enableLazyLoad('1');

        $optionsHelper = vchelper('Options');

        $module = vc_create_module_mock('\VisualComposer\Modules\Settings\Fields\LazyLoad');
        $payload = [
            'value' => true,
            'optionsHelper' => $optionsHelper,
        ];
        $result = $module->call('renderToggle', $payload);

        $pattern = '|<input type="checkbox" value="1" name="vcv-settings-lazy-load-enabled" checked="checked" />|';
        $this->assertMatchesRegularExpression($pattern, $result);

        $this->enableLazyLoad('');

        $optionsHelper = vchelper('Options');

        $module = vc_create_module_mock('\VisualComposer\Modules\Settings\Fields\LazyLoad');
        $payload = [
            'value' => true,
            'optionsHelper' => $optionsHelper,
        ];
        $result = $module->call('renderToggle', $payload);

        $pattern = '|<input type="checkbox" value="1" name="vcv-settings-lazy-load-enabled"  />|';
        $this->assertMatchesRegularExpression($pattern, $result);
    }

    /**
     * Enable lazy load settings.
     *
     * @param string $value
     *
     * @throws \ReflectionException
     */
    public function enableLazyLoad($value) {
        $module = vc_create_module_mock('\VisualComposer\Modules\Settings\Fields\LazyLoad');
        $module->call('buildPage');

        $requestHelper = vchelper('Request');
        $requestHelper->setData(
            [
                'vcv-page-slug' => 'vcv-settings',
                'vcv-settings-lazy-load-enabled' => $value,
            ]
        );

        $module = vc_create_module_mock('\VisualComposer\Modules\Settings\SettingsController');
        $payload = [
            'response' => [],
            'payload' => [],
            'requestHelper' => $requestHelper,
            'isExit' => false,
        ];
        $module->call('saveSettings', $payload);
    }
}
