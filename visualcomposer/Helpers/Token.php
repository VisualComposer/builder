<?php

namespace VisualComposer\Helpers;

// TODO: fix BUG @error
use VisualComposer\Framework\ContainerInner;
use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Class Token.
 */
class Token extends ContainerInner implements Helper
{
    /**
     * @param \VisualComposer\Helpers\Options $options
     *
     * @return bool
     */
    public function isRegistered(Options $options)
    {
        return !!$options->get(
            'site-registered'
        );
    }

    /**
     * @param $body
     * @param \VisualComposer\Helpers\Options $options
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
    }

    /**
     * @param $code
     * @param \VisualComposer\Helpers\Options $options
     *
     * @param \VisualComposer\Helpers\Url $urlHelper
     *
     * @return bool|string
     */
    public function generateToken($code, Options $options, Url $urlHelper)
    {
        $result = wp_remote_post(
            'http://test.account.visualcomposer.io/token',
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
            // TODO: handle error
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
            /** @see \VisualComposer\Helpers\Token::refreshToken */
            $token = $this->call('refreshToken');
        }

        return $token;
    }

    /**
     * @param \VisualComposer\Helpers\Options $options
     * @param \VisualComposer\Helpers\Url $urlHelper
     *
     * @return bool
     */
    private function refreshToken(Options $options, Url $urlHelper)
    {
        $refreshToken = $options->get('page-auth-refresh-token');
        $result = wp_remote_post(
            'http://test.account.visualcomposer.io/token',
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
            //
            $body = json_decode($result['body']);
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
        } else {
            // TODO: handle error
        }

        return false;
    }
}
