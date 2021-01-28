<?php

class TokenTest extends WP_UnitTestCase
{
    protected $testTokenLicense_requestCalled;

    public function testGetToken()
    {
        $licenseHelper = vchelper('License');
        $this->assertFalse($licenseHelper->isPremiumActivated());
        $this->assertFalse($licenseHelper->isAnyActivated());

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

    public function testTokenLicense()
    {
        $this->testTokenLicense_requestCalled = false;
        $expirationTime = time();
        $callback = function ($pre, $r, $url) use ($expirationTime) {
            $this->testTokenLicense_requestCalled = true;
            $this->assertStringContainsString('license-key', $url);
            $this->assertStringContainsString('testTokenLicense', $url);

            return [
                'body' => '{"status":"true","success":true,"data":{"token":"testTokenLicense","license":"testTokenLicense","price_id":"2","license_type":"premium","expiration":'
                    . $expirationTime . '}}',
                'response' => [
                    'code' => 200,
                    'message' => 'OK',
                ],
            ];
        };
        add_filter('pre_http_request', $callback, 10, 3);
        $tokenHelper = vchelper('Token');
        $licenseHelper = vchelper('License');

        $licenseHelper->setKey('testTokenLicense');
        $licenseHelper->setType('free');
        $this->assertEquals('free-token', $tokenHelper->getToken());

        $token = $tokenHelper->getToken(true);

        // Expect that license will be upgraded
        $this->assertTrue($this->testTokenLicense_requestCalled);
        $this->assertEquals($expirationTime, $licenseHelper->getExpirationDate());
        $this->assertEquals('premium', $licenseHelper->getType());
        $this->assertEquals('testTokenLicense', $licenseHelper->getKey());

        remove_filter('pre_http_request', $callback);

        $licenseHelper->setType('');
        $licenseHelper->setKey('');
    }
}
