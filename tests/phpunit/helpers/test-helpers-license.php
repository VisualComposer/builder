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

    public function testKey()
    {
        /** @var \VisualComposer\Helpers\License $helper */
        $helper = vchelper('License');

        vcapp()->call([$helper, 'setKey'], ['test']);
        $this->assertEquals('test', vcapp()->call([$helper, 'getKey']));
        $this->assertTrue(vcapp()->call([$helper, 'isValid'], ['test']));
        $this->assertFalse(vcapp()->call([$helper, 'isValid'], ['testFalse']));
    }

    public function testKeyToken()
    {
        /** @var \VisualComposer\Helpers\License $helper */
        $helper = vchelper('License');

        vcapp()->call([$helper, 'setKeyToken'], ['testToken']);
        $this->assertEquals('testToken', vcapp()->call([$helper, 'getKeyToken']));
    }

    public function testType()
    {
        /** @var \VisualComposer\Helpers\License $helper */
        $helper = vchelper('License');

        vcapp()->call([$helper, 'setType'], ['mega']);
        $this->assertEquals('mega', vcapp()->call([$helper, 'getType']));
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

    public function testIsValidFormat()
    {
        $this->assertTrue(vchelper('License')->isValidFormat('c634fef7-6195-4a77-a3c9-d888b90d235e'));
        $this->assertFalse(vchelper('License')->isValidFormat('xxxx-xxxx'));
    }

    public function testGenerateNewKeyToken()
    {
        /** @var \VisualComposer\Helpers\License $helper */
        $helper = vchelper('License');
        $token = $helper->newKeyToken();
        $this->assertNotEmpty($token);
        $this->assertEquals($token, $helper->getKeyToken(vchelper('Options')));
        $this->assertTrue($helper->isValidToken(sha1($token)));
        $this->assertTrue($helper->isValidToken(sha1($token), 0));
        $this->assertFalse($helper->isValidToken(sha1($token), -1));

        $this->assertFalse($helper->isValidToken('invalid:)'));
    }
}
