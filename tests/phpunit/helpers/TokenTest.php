<?php

class TokenTest extends WP_UnitTestCase
{
    protected $testTokenLicense_requestCalled;

    public function testGetToken()
    {
        $licenseHelper = vchelper('License');
        $this->assertFalse($licenseHelper->isPremiumActivated());

        $tokenHelper = vchelper('Token');
        // By default if nothing activated then token unable to get
        // Since VC-1253 we always fetch free-release even if not activated
        // Need to show HUB teasers
        $this->assertEquals('free-token', $tokenHelper->getToken());

        $licenseHelper->setKey('test');
        $licenseHelper->setType('free');
        $this->assertEquals('free-token', $tokenHelper->getToken());

        // If no license-key then we cannot get any token. it will be FALSE
        $licenseHelper->setType('premium');
        $this->assertFalse($tokenHelper->getToken());
        $this->assertEquals(
            'Couldn\'t find a valid Visual Composer Website Builder license.',
            vchelper('Logger')->all()
        );

        $licenseHelper->setType('');
        $licenseHelper->setKey('');
    }
}
