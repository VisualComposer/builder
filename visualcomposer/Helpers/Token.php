<?php

namespace VisualComposer\Helpers;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Class Token.
 */
class Token extends Container implements Helper
{
    /**
     * @param \VisualComposer\Helpers\Options $options
     *
     * @return bool
     */
    public function isRegistered(Options $options)
    {
        return (bool)$options->get(
            'site-registered'
        );
    }

    /**
     * @param $body
     * @param \VisualComposer\Helpers\Options $options
     *
     * @return bool
     */
    public function registerSite($body, Options $options)
    {
        $options->set(
            'site-registered',
            1
        )->set(
            'site-id',
            $body['client_id']
        )->set(
            'site-secret',
            $body['client_secret']
        );

        return true;
    }

    /**
     * @param $code
     * @param \VisualComposer\Helpers\Options $options
     *
     * @param \VisualComposer\Helpers\Url $urlHelper
     *
     * @return bool|string
     * @throws \Exception
     */
    public function generateToken($code, Options $options, Url $urlHelper)
    {
        $result = wp_remote_post(
            VCV_ACCOUNT_URL . '/token',
            [
                'body' => [
                    'code' => $code,
                    'grant_type' => 'authorization_code',
                    'client_secret' => $options->get('site-secret'),
                    'redirect_uri' => $urlHelper->ajax(['vcv-action' => 'api']),
                    'client_id' => $options->get('site-id'),
                ],
            ]
        );
        if (is_array($result) && 200 == $result['response']['code']) {
            $body = json_decode($result['body']);
            if ($body->access_token) {
                /** @see \VisualComposer\Helpers\Token::saveToken */
                return $this->call('saveToken', [$body]);
            }
        } else {
            // TODO: Handle error.
            throw new \Exception('HTTP request for getting token failed.');
        }

        return false;
    }

    /**
     * @param $body
     * @param \VisualComposer\Helpers\Options $options
     *
     * @return string
     */
    private function saveToken($body, Options $options)
    {
        $options->set(
            'page-auth-state',
            1
        )->set(
            'page-auth-token',
            $body->access_token
        )->set(
            'page-auth-refresh-token',
            $body->refresh_token
        )->set(
            'page-auth-token-ttl',
            current_time('timestamp')
        );

        return $body->access_token;
    }

    /**
     * @param \VisualComposer\Helpers\Options $options
     *
     * @return bool|string
     */
    public function getToken(Options $options)
    {
        $token = $options->get('page-auth-token');
        $ttl = current_time('timestamp') - (int)$options->get('page-auth-token-ttl');
        if ($ttl > 3600) {
            try {
                /** @see \VisualComposer\Helpers\Token::refreshToken */
                $token = $this->call('refreshToken');
            } catch (\Exception $e) {
                $token = '';
            }
        }

        return $token;
    }

    /**
     * @param \VisualComposer\Helpers\Options $options
     * @param \VisualComposer\Helpers\Url $urlHelper
     *
     * @throws \Exception
     *
     * @return bool
     */
    private function refreshToken(Options $options, Url $urlHelper)
    {
        $refreshToken = $options->get('page-auth-refresh-token');
        $result = wp_remote_post(
            VCV_ACCOUNT_URL . '/token',
            [
                'body' => [
                    'grant_type' => 'refresh_token',
                    'client_secret' => $options->get('site-secret'),
                    'redirect_uri' => $urlHelper->ajax(['vcv-action' => 'api']),
                    'client_id' => $options->get('site-id'),
                    'refresh_token' => $refreshToken,
                ],
            ]
        );
        if (is_array($result) && 200 == $result['response']['code']) {
            $body = json_decode($result['body']);
            if ($body->access_token) {
                $options->set(
                    'page-auth-state',
                    1
                )->set(
                    'page-auth-token',
                    $body->access_token
                )->set(
                    'page-auth-refresh-token',
                    $body->refresh_token
                )->set(
                    'page-auth-token-ttl',
                    current_time('timestamp')
                );

                return $body->access_token;
            }
        } else {
            throw new \Exception('HTTP request for refreshing token failed.');
        }

        return false;
    }
}
