<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

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
            ->delete('siteAuthTokenTtl')
            ->delete('license-key')
            ->delete('license-key-token');

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

    public function setIsSiteRegistered()
    {
        return $this->optionsHelper->set(
            'siteRegistered',
            1
        );
    }

    /**
     * @param $id
     *
     * @return bool|string|array
     */
    public function createToken($id = '')
    {
        if (!$id) {
            $id = vchelper('Options')->get('hubTokenId');
        }
        $licenseHelper = vchelper('License');
        $requestHelper = vchelper('Request');
        $body = [
            'hoster_id' => 'account',
            'id' => $id,
            'domain' => get_site_url(),
            'url' => VCV_PLUGIN_URL,
        ];
        if ('account' !== vcvenv('VCV_ENV_ADDONS_ID')) {
            $body = apply_filters('vcv:create:token:attributes', $body);
        }
        if ($requestHelper->input('category') && 'account' !== vcvenv('VCV_ENV_ADDONS_ID')) {
            $body['category'] = $requestHelper->input('category');
            vchelper('Options')->set('activation-category', $requestHelper->input('category'));
        }
        if ($licenseHelper->isActivated()) {
            $body['license-key'] = $licenseHelper->getKey();
        }
        $result = wp_remote_get(
            VCV_TOKEN_URL,
            [
                'timeout' => 30,
                'body' => $body,
            ]
        );

        return $this->getTokenResponse($result);
    }

    /**
     * @param $id
     *
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

    /**
     * @param $result
     *
     * @return array|bool
     */
    protected function getTokenResponse($result)
    {
        $loggerHelper = vchelper('Logger');
        $licenseHelper = vchelper('License');
        $noticeHelper = vchelper('Notice');
        if (!vcIsBadResponse($result)) {
            $body = json_decode($result['body'], true);
            if (is_array($body) && $body['success']) {
                $token = $body['data']['token'];
                $this->setToken($token);

                $this->checkLicenseExpiration($body, $noticeHelper, $loggerHelper);

                return $token;
            }

            if (is_array($body) && isset($body['error'], $body['error']['type'], $body['error']['code'])) {
                $licenseHelper->setKey('');
                $loggerHelper->log(
                    $licenseHelper->licenseErrorCodes($body['error']['code']),
                    [
                        'result' => is_wp_error($body) ? 'wp error' : $body,
                    ]
                );

                $loggerHelper->logNotice(
                    'license:expiration',
                    $licenseHelper->licenseErrorCodes($body['error']['code'])
                );

                return ['status' => false, 'code' => $body['error']['code']];
            }
        } else {
            $message = __('Token generation failed', 'vcwb');
            if (is_wp_error($result)) {
                /** @var \WP_Error $result */
                $resultDetails = $result->get_error_message();
                $message .= '. ';
                $message .= implode('. ', $result->get_error_messages());
                if ("http_request_failed" === $result->get_error_code()) {
                    $message .= '. ';
                    $message .= __('Request timeout of 30 seconds exceeded #10011', 'vcwb');
                }
                $message .= ' #10004';
            } else {
                // @codingStandardsIgnoreLine
                $resultDetails = @json_decode($result['body'], 1);
                if (is_array($resultDetails) && isset($resultDetails['message'])) {
                    $message = $resultDetails['message'] . ' #10005';
                }
            }

            $loggerHelper->log(
                $message,
                [
                    'result' => $resultDetails,
                ]
            );

            if (is_array($result) && isset($result['body'])) {
                $response = json_decode($result['body'], true);
                if (is_array($response)
                    && isset($response['error'], $response['error']['type'], $response['error']['code'])) {
                    $licenseHelper->setKey('');
                    $loggerHelper->log(
                        $licenseHelper->licenseErrorCodes($response['error']['code']),
                        [
                            'result' => $response,
                        ]
                    );
                    $loggerHelper->logNotice(
                        'license:expiration',
                        $licenseHelper->licenseErrorCodes($response['error']['code'])
                    );

                    return ['status' => false, 'code' => $response['error']['code']];
                }
            }
        }

        return false;
    }

    /**
     * @param $body
     * @param $noticeHelper
     * @param $loggerHelper
     */
    protected function checkLicenseExpiration($body, $noticeHelper, $loggerHelper)
    {
        if (isset($body['data']['license_expires_soon']) && $body['data']['license_expires_soon']) {
            $message = sprintf(
                __('Your Visual Composer Website Builder License will expire soon - %s', 'vcwb'),
                date(
                    get_option('date_format') . ' ' . get_option('time_format'),
                    strtotime($body['data']['license_expires_at']['date'])
                )
            );
            $noticeHelper->addNotice('license:expiration', $message);
        } else {
            if (isset($body['data']['license_expires_at'])) {
                $noticeHelper->removeNotice('license:expiration');
                $loggerHelper->removeLogNotice('license:expiration');
            }
        }
    }
}
