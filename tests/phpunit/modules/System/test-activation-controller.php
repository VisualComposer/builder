<?php

class ActivationControllerTest extends WP_UnitTestCase
{
    public function testSetVersion()
    {
        /** @var $module \VisualComposer\Modules\System\Activation\Controller */
        $module = vcapp('SystemActivationController');

        /** @var \VisualComposer\Helpers\Options $optionsHelper */
        $optionsHelper = vchelper('Options');
        $optionsHelper->set('version', 222);
        $this->assertEquals(222, $optionsHelper->get('version'));

        /** @see \VisualComposer\Modules\System\Activation\Controller::setVersion */
        vcapp()->call([$module, 'setVersion']);
        $this->assertEquals(VCV_VERSION, $optionsHelper->get('version'));
    }

    public function testSetVersionViaMock()
    {
        /** @var $mock \VisualComposer\Modules\System\Activation\Controller|\VisualComposer\Application */
        $mock = vc_create_module_mock('\VisualComposer\Modules\System\Activation\Controller');

        /** @var \VisualComposer\Helpers\Options $optionsHelper */
        $optionsHelper = vchelper('Options');
        $optionsHelper->set('version', 111);
        $this->assertEquals(111, $optionsHelper->get('version'));

        /** @see \VisualComposer\Modules\System\Activation\Controller::setVersion */
        $mock->call('setVersion');
        $this->assertEquals(VCV_VERSION, $optionsHelper->get('version'));
    }
}
