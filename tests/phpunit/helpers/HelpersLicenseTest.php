<?php

class HelpersLicenseTest extends WP_UnitTestCase
{
    public function testKey()
    {
        /** @var \VisualComposer\Helpers\License $helper */
        $helper = vchelper('License');

        vcapp()->call([$helper, 'setKey'], ['test']);
        $this->assertEquals('test', vcapp()->call([$helper, 'getKey']));

        vcapp()->call([vcapp('LicenseHelper'), 'setKey'], ['test2']);
        $this->assertEquals('test2', vcapp()->call([vcapp('LicenseHelper'), 'getKey']));
    }

    public function testIsActivated()
    {
        /** @var \VisualComposer\Helpers\License $helper */
        $helper = vchelper('License');

        /** @var \VisualComposer\Helpers\Options $optionsHelper */
        $optionsHelper = vchelper('Options');
        $helper->setKey(false, $optionsHelper);

        $helper->setKey('foo-bar', $optionsHelper);
        $helper->setType('free', $optionsHelper);

        $this->assertFalse($helper->isPremiumActivated());

        //reset
        $helper->setKey(false, $optionsHelper);
        $helper->setType(false, $optionsHelper);
    }
}
