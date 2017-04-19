<?php

class HelpersTokenTest extends WP_UnitTestCase
{
    public function testTokenHelper()
    {
        /** @var $helper VisualComposer\Helpers\Token */
        $helper = vchelper('Token');

        $this->assertTrue(is_object($helper), 'Token helper should be an object');
    }

    public function testTokenLifecycle()
    {
        /** @var $helper VisualComposer\Helpers\Token */
        $helper = vchelper('Token');
        /** @var $optionsHelper VisualComposer\Helpers\Options */
        $optionsHelper = vchelper('Options');
        delete_option('vcv-site-auth-token');
        delete_option('vcv-site-auth-refresh-token');
        remove_all_filters('pre_http_request');
        add_filter('pre_http_request', [$this, 'overrideGenerateTokenRequest'], 10, 3);

        $this->assertFalse($optionsHelper->get('site-auth-token'));
        $this->assertFalse($optionsHelper->get('site-auth-refresh-token'));

        $code = 'test-code';
        $accessToken = vcapp()->call([$helper, 'createToken'], [$code]);
        $this->assertEquals('test-access-token-1', $accessToken);

        $this->assertEquals('test-access-token-1', $helper->getToken());

        remove_filter('pre_http_request', [$this, 'overrideGenerateTokenRequest']);
    }

    /**
     * @expectedException \Exception
     */
    public function testTokenLifeCycleException()
    {
        /** @var $helper VisualComposer\Helpers\Token */
        $helper = vchelper('Token');
        /** @var $optionsHelper VisualComposer\Helpers\Options */
        $optionsHelper = vchelper('Options');

        // Test failed http request.
        // Force token to be expired.
        $optionsHelper->set('site-auth-token-ttl', '-1');

        add_filter('pre_http_request', '__return_true', 100);

        $code = 'test-code';
        $this->assertFalse($helper->getToken($optionsHelper));
        $this->assertFalse(vcapp()->call([$helper, 'generateToken'], [$code]));
        remove_filter('pre_http_request', '__return_true');
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
     *
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
                // Should not happen.
                $access_token = 'test-access-token-?';
                $refresh_token = 'test-refresh-token-?';
        }

        $response = [
            'response' => [
                'code' => 200,
            ],
            'body' => json_encode(
                [
                    'access_token' => $access_token,
                    'refresh_token' => $refresh_token,
                ]
            ),
        ];

        return $response;
    }
}
