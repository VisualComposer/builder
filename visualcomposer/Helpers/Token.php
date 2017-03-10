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
    /**
     * @var \VisualComposer\Helpers\Options
     */
    protected $optionsHelper;

    /**
     * @var \VisualComposer\Helpers\Url
     */
    protected $urlHelper;

    /**
     * Token constructor.
     *
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\Url $urlHelper
     */
    public function __construct(Options $optionsHelper, Url $urlHelper)
    {
        $this->optionsHelper = $optionsHelper;
        $this->urlHelper = $urlHelper;
    }

    /**
     * @return bool
     */
    public function reset()
    {
        $this->optionsHelper
            ->set('site-registered', 0)
            ->set('site-id', '')
            ->set('site-secret', '')
            ->set('site-auth-state', '')
            ->set('site-auth-token', '')
            ->set('site-auth-refresh-token', '')
            ->set('site-auth-token-ttl', '');

        return true;
    }

    /**
     * @return bool
     */
    public function isSiteRegistered()
    {
        return (bool)$this->optionsHelper->get(
            'site-registered'
        );
    }

    /**
     * @return bool
     */
    protected function setIsSiteRegistered()
    {
        $this->optionsHelper->set(
            'site-registered',
            1
        );

        return true;
    }

    /**
     * @return bool
     * @throws \Exception
     */
    public function createSecret()
    {
        /** @var Url $urlHelper */
        $url = $this->urlHelper->ajax(['vcv-action' => 'account:token:api']);
        $result = wp_remote_post(
            VCV_ACCOUNT_URL . '/register-app',
            ['body' => ['url' => $url]]
        );
        if (is_array($result) && 200 === $result['response']['code']) {
            $body = json_decode($result['body']);
            if (!empty($body) && isset($body->client_id, $body->client_secret)) {
                $this->setIsSiteRegistered();
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
     * @param $body
     *
     * @return bool
     */
    protected function setClientSecret($body)
    {
        $this->optionsHelper->set(
            'site-id',
            $body->client_id
        )->set(
            'site-secret',
            $body->client_secret
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
                    'redirect_uri' => $this->urlHelper->ajax(['vcv-action' => 'account:token:api']),
                    'client_id' => $this->optionsHelper->get('site-id'),
                ],
            ]
        );
        if (is_array($result) && 200 == $result['response']['code']) {
            $body = json_decode($result['body']);
            if ($body->access_token) {
                $this->setToken($body);

                return $body->access_token;
            }
        } else {
            // TODO: Handle error.
            throw new Exception('HTTP request for getting token failed.');
        }

        return false;
    }

    /**
     * @return bool|string
     */
    public function getToken()
    {
        if ($this->isSiteAuthorized()) {
            $token = $this->optionsHelper->get('site-auth-token');
            $ttl = current_time('timestamp') - (int)$this->optionsHelper->get('site-auth-token-ttl');
            if ($ttl > 3600) {
                $token = $this->refreshToken();
            }

            return $token;
        }

        return false;
    }

    /**
     * @param $body
     *
     * @return string
     */
    protected function setToken($body)
    {
        $this->optionsHelper->set(
            'site-auth-state',
            1
        )->set(
            'site-auth-token',
            $body->access_token
        )->set(
            'site-auth-refresh-token',
            $body->refresh_token
        )->set(
            'site-auth-token-ttl',
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
        $refreshToken = $this->optionsHelper->get('site-auth-refresh-token');
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
                $this->setToken($body);

                return $body->access_token;
            }
        } else {
            throw new Exception('HTTP request for refreshing token failed.');
        }

        return false;
    }

    /**
     * @return bool
     */
    public function isSiteAuthorized()
    {
        return (int)$this->optionsHelper->get('site-auth-state', 0) > 0;
    }

    /**
     * @return string
     */
    public function getTokenActivationUrl()
    {
        $clientId = esc_attr($this->optionsHelper->get('site-id'));
        $redirectUrl = rawurlencode($this->urlHelper->ajax(['vcv-action' => 'account:token:api']));
        $scope = 'user.read,elements.read';

        $url = sprintf(
            '%s/authorization?response_type=code&client_id=%s&redirect_uri=%s&scope=%s',
            VCV_ACCOUNT_URL,
            $clientId,
            $redirectUrl,
            $scope
        );

        return $url;
    }
}
