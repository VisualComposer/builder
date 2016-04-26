<?php

class HelpersTokenTest extends WP_UnitTestCase
{
    public function testTokenHelper()
    {
        /**
         * @var $helper VisualComposer\Helpers\Token
         */
        $helper = vcapp('VisualComposer\Helpers\Token');

        $this->assertTrue(is_object($helper), 'Token helper should be an object');
    }

    public function testIsRegisteredAndRegisterSite()
    {
        /**
         * @var $helper VisualComposer\Helpers\Token
         */
        $helper = vcapp('VisualComposer\Helpers\Token');

        /**
         * @var $helper VisualComposer\Helpers\Options
         */
        $optionsHelper = vcapp('VisualComposer\Helpers\Options');

        $this->assertFalse($helper->isRegistered($optionsHelper));

        $body = ['client_id' => 'foo', 'client_secret' => 'bar'];
        $ret = $helper->registerSite($body, $optionsHelper);
        $this->assertNull($ret);

        $this->assertTrue($helper->isRegistered($optionsHelper));
    }

    public function testTokenLifecycle()
    {
        /**
         * @var $helper VisualComposer\Helpers\Token
         */
        $helper = vcapp('VisualComposer\Helpers\Token');

        /**
         * @var $helper VisualComposer\Helpers\Options
         */
        $optionsHelper = vcapp('VisualComposer\Helpers\Options');

        /**
         * @var $helper VisualComposer\Helpers\Url
         */
        $urlHelper = vcapp('VisualComposer\Helpers\Url');

        add_filter('pre_http_request', [$this, 'overrideGenerateTokenRequest'], 10, 3);

        $this->assertFalse($optionsHelper->get('page-auth-token'));
        $this->assertFalse($optionsHelper->get('page-auth-refresh-token'));

        $code = 'test-code';
        $access_token = $helper->generateToken($code, $optionsHelper, $urlHelper);
        $this->assertEquals('test-access-token-1', $access_token);

        $this->assertEquals('test-access-token-1', $helper->getToken($optionsHelper));

        // force token to be expired

        $optionsHelper->set('page-auth-token-ttl', '-1');

        $this->assertEquals('test-access-token-2', $helper->getToken($optionsHelper));

        // test failed http request

        remove_filter('pre_http_request', [$this, 'overrideGenerateTokenRequest'], 10, 3);

        add_filter('pre_http_request', '__return_true', 100);

        // force token tp be expired
        $optionsHelper->set('page-auth-token-ttl', '-1');

        $this->assertFalse($helper->getToken($optionsHelper));
        $this->assertFalse($helper->generateToken($code, $optionsHelper, $urlHelper));
    }

    /**
     * Override token request request
     *
     * There are two types of requests - token request and token refresh so we return
     * two different tokens to test both scenarios.
     *
     * @param bool $false
     * @param array|null $args
     * @param string|null $url
     * @return mixed False, to continue request as is, true to block it and array to change it
     */
    public function overrideGenerateTokenRequest($false, $args = null, $url = null)
    {
        $this->assertEquals('http://test.account.visualcomposer.io/token', $url);

        switch ($args['body']['grant_type']) {
            case 'authorization_code':
                $access_token = 'test-access-token-1';
                $refresh_token = 'test-refresh-token-1';
                break;

            case 'refresh_token':
                $access_token = 'test-access-token-2';
                $refresh_token = 'test-refresh-token-2';
                break;

            default:
                // should not happen
                $access_token = 'test-access-token-?';
                $refresh_token = 'test-refresh-token-?';
        }

        return [
            'response' => [
                'code' => 200
            ],
            'body' => json_encode([
                'access_token' => $access_token,
                'refresh_token' => $refresh_token
            ])
        ];
    }

}
