<?php

namespace VisualComposer\Helpers;

use Exception;
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

    public function createSecret()
    {
        /** @var Url $urlHelper */
        $url = $this->urlHelper->ajax(['vcv-action' => 'api']);
        $result = wp_remote_post(
            VCV_ACCOUNT_URL . '/register-app',
            ['body' => ['url' => $url]]
        );
        if (is_array($result) && 200 === $result['response']['code']) {
            $body = json_decode($result['body'], true);
            if (!empty($body) && isset($body['client_id'], $body['client_secret'])) {
                $this->setSiteRegistered();
                $this->setClientSecret($body);

                return true;
            }
        } else {
            // TODO: Handle error.
            throw new Exception('HTTP request for registering app failed.');
        }

        return false;
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

    protected function setSiteRegistered()
    {
        return $this->optionsHelper->set(
            'site-registered',
            1
        );
    }

    /**
     * @param $body
     *
     * @return bool
     */
    protected function setClientSecret($body)
    {
        $this->optionsHelper->set(
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
    public function createToken($code)
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
                /** @see \VisualComposer\Helpers\Token::setToken */
                return $this->call('setToken', [$body]);
            }
        } else {
            // TODO: Handle error.
            throw new \Exception('HTTP request for getting token failed.');
        }

        return false;
    }

    /**
     * @return bool|string
     */
    public function getToken()
    {
        $token = $this->optionsHelper->get('page-auth-token');
        $ttl = current_time('timestamp') - (int)$this->optionsHelper->get('page-auth-token-ttl');
        if ($ttl > 3600) {
            /** @see \VisualComposer\Helpers\Token::refreshToken */
            $token = $this->call('refreshToken');
        }

        return $token;
    }

    /**
     * @param $body
     *
     * @return string
     */
    protected function setToken($body)
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

        return true;
    }

    /**
     * @throws \Exception
     *
     * @return bool
     */
    protected function refreshToken()
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
