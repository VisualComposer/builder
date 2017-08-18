<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

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
            ->deleteTransient('siteAuthToken')
            ->set('siteAuthRefreshToken', '')
            ->set('vcv:activation:request', '')
            ->set('siteAuthTokenTtl', '')
            ->deleteTransient('vcv:hub:download:json');

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
    public function setIsSiteRegistered()
    {
        $this->optionsHelper->set(
            'siteRegistered',
            1
        );

        return true;
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
    public function createToken($id)
    {
        $loggerHelper = vchelper('Logger');
        $result = wp_remote_get(
            VCV_TOKEN_URL,
            [
                'body' => [
                    'hoster_id' => 'account',
                    'id' => $id,
                ],
            ]
        );
        if (wp_remote_retrieve_response_code($result) === 200) {
            $body = json_decode($result['body'], true);
            if ($body['success']) {
                $token = $body['data']['token'];
                $this->setToken($token);

                return $token;
            }
        }

        $message = __('Token generation failed', 'vcwb');
        if (is_wp_error($result)) {
            $resultDetails = $result->get_error_message();
            if ("http_request_failed" === $result->get_error_code()) {
                $message.= '. ';
                $message.= __('Possibly the process exceeded the timeout of 5 seconds', 'vcwb');
            }
        } else {
            $resultDetails = $result['body'];
        }

        $loggerHelper->log(
            $message,
            [
                'result' => $resultDetails,
            ]
        );

        return false;
        //  $result = wp_remote_post(
        //      VCV_ACCOUNT_URL . '/token',
        //      [
        //          'body' => [
        //              'code' => $code,
        //              'grant_type' => 'authorization_code',
        //              'client_secret' => $this->optionsHelper->get('siteSecret'),
        //              'redirect_uri' => $this->urlHelper->ajax(['vcv-action' => 'account:token:api']),
        //              'client_id' => $this->optionsHelper->get('siteId'),
        //          ],
        //      ]
        //  );
        //  if (is_array($result) && 200 == $result['response']['code']) {
        //      $body = json_decode($result['body']);
        //      // @codingStandardsIgnoreLine
        //      if ($body->access_token) {
        //          $this->setToken($body);
        //
        //          // @codingStandardsIgnoreLine
        //          return $body->access_token;
        //      }
        //  } else {
        //      // TODO: Handle error.
        //      throw new Exception('HTTP request for getting token failed.');
        //  }
        //
        //  return false;
    }

    /**
     * @return bool|string
     */
    public function getToken($id)
    {
        $token = $this->optionsHelper->getTransient('siteAuthToken');
        if (!$token) {
            $token = $this->createToken($id);
            $this->setToken($token);
        }

        return $token;
    }

    public function setSiteAuthorized()
    {
        return $this->optionsHelper->set(
            'siteAuthState',
            1
        );
    }

    /**
     * @param $token
     *
     * @return string
     */
    public function setToken($token)
    {
        // @codingStandardsIgnoreStart
        return $this->optionsHelper->setTransient('siteAuthToken', $token, 3600);
        //        $this->setSiteAuthorized()->set(
        //            'siteAuthToken',
        //            $body->access_token
        //        )->set(
        //            'siteAuthRefreshToken',
        //            $body->refresh_token
        //        )->set(
        //            'siteAuthTokenTtl',
        //            current_time('timestamp')
        //        );

        // @codingStandardsIgnoreEnd

        // return true;
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
    protected function getTokenActivationUrl()
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
