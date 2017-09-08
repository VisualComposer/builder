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

    public function testKeyToken()
    {
        /** @var \VisualComposer\Helpers\License $helper */
        $helper = vchelper('License');

        vcapp()->call([$helper, 'setKeyToken'], ['testToken']);
        $this->assertEquals('testToken', vcapp()->call([$helper, 'getKeyToken']));
    }

    public function testIsActivated()
    {
        /** @var \VisualComposer\Helpers\License $helper */
        $helper = vchelper('License');

        /** @var \VisualComposer\Helpers\Options $optionsHelper */
        $optionsHelper = vchelper('Options');
        $helper->setKey(false, $optionsHelper);

        $this->assertFalse($helper->isActivated());

        $helper->setKey('foo-bar', $optionsHelper);

        $this->assertTrue($helper->isActivated());

        //reset
        $helper->setKey(false, $optionsHelper);

    }

    public function testGenerateNewKeyToken()
    {
        wp_set_current_user(1);
        /** @var \VisualComposer\Helpers\License $helper */
        $helper = vchelper('License');
        $token = $helper->newKeyToken();
        $this->assertNotEmpty($token);
        $this->assertEquals($token, $helper->getKeyToken(vchelper('Options')));
        $this->assertTrue($helper->isValidToken(sha1($token)));
        $this->assertFalse($helper->isValidToken(sha1($token), -1));

        $this->assertFalse($helper->isValidToken('invalid:)'));
    }
}
