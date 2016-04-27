<?php

class LicenseControllerTest extends WP_UnitTestCase
{
    /**
     * By changing these properties we can break BC.
     */
    public function testProperties()
    {
        /** @var $module \VisualComposer\Modules\License\Controller */
        $module = vc_create_module_mock('\VisualComposer\Modules\License\Controller');

        $prop = new ReflectionProperty($module, 'licenseKeyOption');
        $prop->setAccessible(true);
        $this->assertEquals('license_key', $prop->getvalue($module));

        $prop = new ReflectionProperty($module, 'licenseKeyTokenOption');
        $prop->setAccessible(true);
        $this->assertEquals('license_key_token', $prop->getvalue($module));

        $prop = new ReflectionProperty($module, 'activationHost');
        $prop->setAccessible(true);
        $this->assertEquals('https://account.visualcomposer.io', $prop->getvalue($module));
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
