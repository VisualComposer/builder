<?php

class HelpersLicenseTest extends WP_UnitTestCase
{
    /**
     * By changing these properties we can break BC.
     */
    public function testProperties()
    {
        /** @var \VisualComposer\Helpers\License $helper */
        $helper = vchelper('License');

        $this->assertEquals('license-key', $helper->getKeyOptionName());
        $this->assertEquals('license-type', $helper->getTypeOptionName());
        $this->assertEquals('license-key-token', $helper->getKeyTokenOptionName());
    }

    public function testIsActivated()
    {
        /** @var \VisualComposer\Helpers\License $helper */
        $helper = vchelper('License');

        /** @var \VisualComposer\Helpers\Options $optionsHelper */
        $optionsHelper = vchelper('Options');

        $this->assertFalse($helper->isActivated());

        $helper->setKey('foo-bar', $optionsHelper);

        $this->assertTrue($helper->isActivated());
    }
}
