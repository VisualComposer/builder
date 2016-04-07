<?php

namespace VisualComposer\Helpers;

// @todo fix BUG @error
use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Helper;
//use VisualComposer\Helpers\Curl\Curl;
use VisualComposer\Helpers\Options;

/**
 * Class Token
 */
class Token extends Container implements Helper
{
    /**
     * @param $code
     * @param \VisualComposer\Helpers\Curl\Curl $curl
     * @todo Fix CURL @error
     * @return bool|string
     */
    public function generateToken($code, Curl $curl)
    {
        $curlRequest = $curl->newRequest(
            'post',
            'http://test.account.visualcomposer.io/token',
            [
                'code' => $code,
                'grant_type' => 'authorization_code',
                'client_secret' => 'pSGoYIIXOz0qGh0cpgKHCHksA1nd8g3GnC07ybKj',
                'redirect_uri' => 'http://wp-test.dev/wp-content/plugins/vc-five/ajax.php?action=api',
                'client_id' => 'pasha-test',
            ]
        );
        $responseJson = json_decode($curlRequest->send()->body);
        if ($responseJson->access_token) {
            /** @see \VisualComposer\Helpers\Token::saveToken */
            return $this->call('saveToken', [$responseJson]);
        }

        return false;
    }

    /**
     * @param $data
     * @param \VisualComposer\Helpers\Options $options
     *
     * @return string
     */
    private function saveToken($data, Options $options)
    {
        $options->set(
            'page-auth-state',
            1
        )->set(
            'page-auth-token',
            $data->access_token
        )->set(
            'page-auth-refresh-token',
            $data->refresh_token
        )->set(
            'page-auth-token-ttl',
            current_time('timestamp')
        );

        return $data->access_token;
    }

    /**
     * @return string|bool
     */
    public function getToken()
    {
        /** @var Options $options */
        $options = vchelper('Options');
        $token = $options->get('page-auth-token');
        $ttl = current_time('timestamp') - (int)$options->get('page-auth-token-ttl');
        if ($ttl > 3600) {
            /** @see \VisualComposer\Helpers\Token::refreshToken */
            $token = $this->call('refreshToken');
        }

        return $token;
    }

    /**
     * @param \VisualComposer\Helpers\Options $options
     * @param \VisualComposer\Helpers\Curl\Curl $curl
     * @todo FIX Curl @error
     * @return bool
     */
    private function refreshToken(Options $options, Curl $curl)
    {
        $refreshToken = $options->get('page-auth-refresh-token');
        $curlRequest = $curl->newRequest(
            'post',
            'http://test.account.visualcomposer.io/token',
            [
                'grant_type' => 'refresh_token',
                'client_secret' => 'pSGoYIIXOz0qGh0cpgKHCHksA1nd8g3GnC07ybKj',
                'redirect_uri' => 'http://wp-test.dev/wp-content/plugins/vc-five/ajax.php?action=api',
                'client_id' => 'pasha-test',
                'refresh_token' => $refreshToken,
            ]
        );
        $responseJson = json_decode($curlRequest->send()->body);
        if ($responseJson->access_token) {
            $options->set(
                'page-auth-state',
                1
            )->set(
                'page-auth-token',
                $responseJson->access_token
            )->set(
                'page-auth-refresh-token',
                $responseJson->refresh_token
            )->set(
                'page-auth-token-ttl',
                current_time('timestamp')
            );

            return $responseJson->access_token;
        }

        return false;
    }
}
