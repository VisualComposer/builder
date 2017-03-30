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
            ->set('siteRegistered', 0)
            ->set('siteId', '')
            ->set('siteSecret', '')
            ->set('siteAuthState', '')
            ->set('siteAuthToken', '')
            ->set('siteAuthRefreshToken', '')
            ->set('siteAuthTokenTtl', '');

        return true;
    }

    /**
     * @return bool
     */
    public function isSiteRegistered()
    {
        return (bool)$this->optionsHelper->get(
            'siteRegistered'
        );
    }

    /**
     * @return bool
     */
    protected function setIsSiteRegistered()
    {
        $this->optionsHelper->set(
            'siteRegistered',
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
            // @codingStandardsIgnoreLine
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
        // @codingStandardsIgnoreStart
        $this->optionsHelper->set(
            'siteId',
            $body->client_id
        )->set(
            'siteSecret',
            $body->client_secret
        );
        // @codingStandardsIgnoreEnd

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
                    'client_secret' => $this->optionsHelper->get('siteSecret'),
                    'redirect_uri' => $this->urlHelper->ajax(['vcv-action' => 'account:token:api']),
                    'client_id' => $this->optionsHelper->get('siteId'),
                ],
            ]
        );
        if (is_array($result) && 200 == $result['response']['code']) {
            $body = json_decode($result['body']);
            // @codingStandardsIgnoreLine
            if ($body->access_token) {
                $this->setToken($body);

                // @codingStandardsIgnoreLine
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
            $token = $this->optionsHelper->get('siteAuthToken');
            $ttl = current_time('timestamp') - (int)$this->optionsHelper->get('siteAuthTokenTtl');
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
        // @codingStandardsIgnoreStart
        $this->optionsHelper->set(
            'siteAuthState',
            1
        )->set(
            'siteAuthToken',
            $body->access_token
        )->set(
            'siteAuthRefreshToken',
            $body->refresh_token
        )->set(
            'siteAuthTokenTtl',
            current_time('timestamp')
        );
        // @codingStandardsIgnoreEnd

        return true;
    }

    /**
     * @throws \Exception
     *
     * @return bool
     */
    protected function refreshToken()
    {
        $refreshToken = $this->optionsHelper->get('siteAuthRefreshToken');
        $result = wp_remote_post(
            VCV_ACCOUNT_URL . '/token',
            [
                'body' => [
                    'grant_type' => 'refresh_token',
                    'client_secret' => $this->optionsHelper->get('siteSecret'),
                    'redirect_uri' => $this->urlHelper->ajax(['vcv-action' => 'api']),
                    'client_id' => $this->optionsHelper->get('siteId'),
                    'refresh_token' => $refreshToken,
                ],
            ]
        );
        if (is_array($result) && 200 == $result['response']['code']) {
            $body = json_decode($result['body']);
            // @codingStandardsIgnoreLine
            if ($body->access_token) {
                $this->setToken($body);

                // @codingStandardsIgnoreLine
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
        return (int)$this->optionsHelper->get('siteAuthState', 0) > 0;
    }

    /**
     * @return string
     */
    public function getTokenActivationUrl()
    {
        $clientId = esc_attr($this->optionsHelper->get('siteId'));
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
