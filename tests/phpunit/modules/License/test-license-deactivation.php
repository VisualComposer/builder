<?php

class LicenseDeactivationTest extends WP_UnitTestCase
{
    protected $testLicenseDeactivation_redirectCalled = false;

    protected $testLicenseDeactivation_anotherRedirectCalled = false;

    protected $testLicenseDeactivationNotAuth_redirectCalled = false;

    protected $testLicenseDeactivationNotAuth_anotherRedirectCalled = false;

    public function testLicenseDeactivation()
    {
        $licenseHelper = vchelper('License');
        $this->assertFalse($licenseHelper->getType());
        $this->assertFalse($licenseHelper->getKey());
        $this->assertFalse($licenseHelper->getExpirationDate());

        $licenseHelper->setKey('testLicenseDeactivation');
        $licenseHelper->setType('premium');
        $licenseHelper->setExpirationDate(time() + WEEK_IN_SECONDS);

        wp_set_current_user(1);
        $redirectCallback = function ($location) {
            if (strpos($location, 'page=vcv-getting-started') !== false) {
                $this->testLicenseDeactivation_redirectCalled = true;

                return false;
            }
            $this->testLicenseDeactivation_anotherRedirectCalled = $location;

            return $location;
        };
        add_filter('wp_redirect', $redirectCallback, 10, 3);
        $this->expectException(Exception::class);

        vcfilter('vcv:ajax:license:deactivate:adminNonce');

        $this->assertTrue($this->testLicenseDeactivation_redirectCalled);
        $this->assertFalse(
            $this->testLicenseDeactivation_anotherRedirectCalled,
            'Location: ' . $this->testLicenseDeactivation_anotherRedirectCalled
        );
        $this->assertFalse($licenseHelper->getType());
        $this->assertFalse($licenseHelper->getKey());
        $this->assertFalse($licenseHelper->getExpirationDate());
        remove_filter('wp_redirect', $redirectCallback);
    }

    public function testLicenseDeactivationNotAuth()
    {
        $licenseHelper = vchelper('License');
        $this->assertFalse($licenseHelper->getType());
        $this->assertFalse($licenseHelper->getKey());
        $this->assertFalse($licenseHelper->getExpirationDate());

        $licenseHelper->setKey('testLicenseDeactivationNotAuth');
        $licenseHelper->setType('premium');
        $expiration = time() + WEEK_IN_SECONDS;
        $licenseHelper->setExpirationDate($expiration);

        wp_set_current_user(0); // not auth
        $redirectCallback = function ($location) {
            // If no access then expect redirect to vcv-settings without any action
            if (strpos($location, 'page=vcv-settings') !== false) {
                $this->testLicenseDeactivationNotAuth_redirectCalled = true;

                return false;
            }
            $this->testLicenseDeactivationNotAuth_anotherRedirectCalled = $location;

            return $location;
        };
        add_filter('wp_redirect', $redirectCallback, 10, 3);
        $this->expectException(Exception::class);

        vcfilter('vcv:ajax:license:deactivate:adminNonce');

        $this->assertTrue($this->testLicenseDeactivationNotAuth_redirectCalled);
        $this->assertFalse(
            $this->testLicenseDeactivationNotAuth_anotherRedirectCalled,
            'Location:' . $this->testLicenseDeactivationNotAuth_anotherRedirectCalled
        );
        $this->assertEquals('premium', $licenseHelper->getType());
        $this->assertEquals('testLicenseDeactivationNotAuth', $licenseHelper->getKey());
        $this->assertEquals($expiration, $licenseHelper->getExpirationDate());
        remove_filter('wp_redirect', $redirectCallback);
    }
}
