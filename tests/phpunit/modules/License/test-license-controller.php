<?php

class LicenseControllerTest extends WP_UnitTestCase
{
    /**
     * By changing these properties we can break BC.
     */
    public function testProperties()
    {
        /** @var $module \VisualComposer\Modules\License\Controller */
        $module = vcapp('LicenseController');

        $this->assertEquals('license_key', $module->getLicenseKeyOption());
        $this->assertEquals('license_key_token', $module->getLicenseKeyTokenOption());
        $this->assertEquals('https://account.visualcomposer.io', $module->getActivationHost());
    }

    public function testIsActivated()
    {
        /** @var $module \VisualComposer\Modules\License\Controller */
        $module = vc_create_module_mock('\VisualComposer\Modules\License\Controller');

        /** @var \VisualComposer\Helpers\Options $optionsHelper */
        $optionsHelper = vchelper('Options');

        $this->assertFalse($module->isActivated());

        $optionsHelper->set('license_key', 'foo-bar');

        $this->assertTrue($module->isActivated());
    }

}
