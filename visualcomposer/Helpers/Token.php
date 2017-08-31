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
            ->delete('siteRegistered')
            ->delete('siteId')
            ->delete('siteSecret')
            ->delete('siteAuthState')
            ->deleteTransient('siteAuthToken')
            ->delete('siteAuthRefreshToken')
            ->delete('vcv:activation:request')
            ->delete('siteAuthTokenTtl');

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
     * @param $id
     * @return bool|string
     */
    public function createToken($id)
    {
        $loggerHelper = vchelper('Logger');
        $result = wp_remote_get(
            VCV_TOKEN_URL,
            [
                'timeout' => 10,
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
                $message .= '. ';
                $message .= __('Possibly the process exceeded the timeout of 5 seconds', 'vcwb');
            }
        } else {
            // @codingStandardsIgnoreLine
            $resultDetails = @json_decode($result['body'], 1);
            if (is_array($resultDetails) && isset($resultDetails['message'])) {
                $message = $resultDetails['message'];
            }
        }

        $loggerHelper->log(
            $message,
            [
                'result' => $resultDetails,
            ]
        );

        return false;
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
     * @return bool
     */
    public function isSiteAuthorized()
    {
        return (int)$this->optionsHelper->get('siteAuthState', 0) > 0;
    }

    /**
     * @param $token
     *
     * @return string
     */
    public function setToken($token)
    {
        return $this->optionsHelper->setTransient('siteAuthToken', $token, 3600);
    }
}
