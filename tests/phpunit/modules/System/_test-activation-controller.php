<?php
namespace Tests\PhpUnit\Modules\System;

class ActivationControllerTest extends \WP_UnitTestCase
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
        do_action('activate_' . VCV_PLUGIN_BASE_NAME);
        $this->assertEquals(VCV_VERSION, $optionsHelper->get('version'));
    }
}
