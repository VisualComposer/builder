<?php

class TokenTest extends WP_UnitTestCase
{
    public function testGetToken()
    {
        $licenseHelper = vchelper('License');
        $this->assertFalse($licenseHelper->isPremiumActivated());
        $this->assertFalse($licenseHelper->isFreeActivated());
        $this->assertFalse($licenseHelper->isAnyActivated());

        $tokenHelper = vchelper('Token');
        $this->assertEquals('free-token', $tokenHelper->getToken());

        $licenseHelper->setKey('test');
        $licenseHelper->setType('free');
        $this->assertEquals('free-token', $tokenHelper->getToken());

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
