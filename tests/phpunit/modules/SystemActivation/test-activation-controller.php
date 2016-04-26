<?php

class ActivationControllerTest extends WP_UnitTestCase
{
    public function test_setVersion()
    {
        /** @var $mock \VisualComposer\Application */
        $mock = vc_create_module_mock('\VisualComposer\Modules\System\Activation\Controller');

        $optionsHelper = vchelper('Options');
        $optionsHelper->set('version', 111);
        $this->assertEquals(111, $optionsHelper->get('version'));

        $mock->call('setVersion');
        $this->assertEquals(VCV_VERSION, $optionsHelper->get('version'));
    }
}
