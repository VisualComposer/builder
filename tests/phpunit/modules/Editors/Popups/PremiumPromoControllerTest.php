<?php

class PremiumPromoControllerTest extends WP_UnitTestCase
{
    public function testSubmitPopupClose()
    {
        wp_set_current_user(1);

        $module = vc_create_module_mock('\VisualComposer\Modules\Editors\Popups\PremiumPromoController');
        $module->call('submitPopupClose');

        $optionsHelper = vchelper('Options');
        $inDbTime = $optionsHelper->get('premium-promo-popup-closed');

        $currentTime = time();

        $this->assertEquals($inDbTime, $currentTime);
    }

    public function testAddVariables()
    {
        $variables = vcfilter('vcv:editor:variables', []);

        $this->assertIsArray($variables);

        $dataHelper = vchelper('Data');
        $variableKeys = $dataHelper->arrayColumn($variables, 'key');

        $this->assertContains('VCV_SHOW_PREMIUM_PROMO_POPUP', $variableKeys);
    }
}
