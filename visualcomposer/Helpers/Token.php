<?php

namespace VisualComposer\Helpers;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Class Token.
 */
class Token extends Container implements Helper
{
    protected $optionsHelper;

    protected $urlHelper;

    public function __construct(Options $optionsHelper, Url $urlHelper)
    {
        $this->optionsHelper = $optionsHelper;
        $this->urlHelper = $urlHelper;
    }

    /**
     * @return bool
     */
    public function isRegistered()
    {
        return (bool)$this->optionsHelper->get(
            'site-registered'
        );
    }

    /**
     * @param $body
     *
     * @return bool
     */
    public function registerSite($body)
    {
        $this->optionsHelper->set(
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
     *
     * @return bool|string
     * @throws \Exception
     */
    public function generateToken($code)
    {
        $result = wp_remote_post(
            VCV_ACCOUNT_URL . '/token',
            [
                'body' => [
                    'code' => $code,
                    'grant_type' => 'authorization_code',
                    'client_secret' => $this->optionsHelper->get('site-secret'),
                    'redirect_uri' => $this->urlHelper->ajax(['vcv-action' => 'api']),
                    'client_id' => $this->optionsHelper->get('site-id'),
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
     *
     * @return string
     */
    private function saveToken($body)
    {
        $this->optionsHelper->set(
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
     * @return bool|string
     */
    public function getToken()
    {
        $token = $this->optionsHelper->get('page-auth-token');
        $ttl = current_time('timestamp') - (int)$this->optionsHelper->get('page-auth-token-ttl');
        if ($ttl > 3600) {
            try {
                /** @see \VisualComposer\Helpers\Token::refreshToken */
                $token = $this->call('refreshToken');
            } catch (\Exception $e) {
                $token = false;
            }
        }

        return $token;
    }

    /**
     * @throws \Exception
     *
     * @return bool
     */
    private function refreshToken()
    {
        $refreshToken = $this->optionsHelper->get('page-auth-refresh-token');
        $result = wp_remote_post(
            VCV_ACCOUNT_URL . '/token',
            [
                'body' => [
                    'grant_type' => 'refresh_token',
                    'client_secret' => $this->optionsHelper->get('site-secret'),
                    'redirect_uri' => $this->urlHelper->ajax(['vcv-action' => 'api']),
                    'client_id' => $this->optionsHelper->get('site-id'),
                    'refresh_token' => $refreshToken,
                ],
            ]
        );
        if (is_array($result) && 200 == $result['response']['code']) {
            $body = json_decode($result['body']);
            if ($body->access_token) {
                $this->optionsHelper->set(
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
