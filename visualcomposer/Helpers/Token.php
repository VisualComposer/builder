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
            ->deleteTransient('vcv:activation:request')
            ->deleteTransient('vcv:hub:action:request')
            ->delete('siteAuthRefreshToken')
            ->delete('siteAuthTokenTtl')
            ->delete('lastBundleUpdate')
            ->delete('license-key')
            ->delete('license-key-token');

        return true;
    }

    /**
     * @param string $id
     *
     * @return bool|string|array
     */
    public function getToken($id = '')
    {
        if (!$id) {
            $id = vchelper('Options')->get('hubTokenId');
        }
        $licenseHelper = vchelper('License');
        $body = [
            'hoster_id' => 'account',
            'id' => $id,
            'domain' => get_site_url(),
            'url' => VCV_PLUGIN_URL,
            'vcv-version' => VCV_VERSION,
        ];
        if ($licenseHelper->isActivated()) {
            $body['license-key'] = $licenseHelper->getKey();
        } else {
            $token = 'free-token';

            return $token;
        }

        $url = $licenseHelper->isActivated() ? vcvenv('VCV_PREMIUM_TOKEN_URL') : vcvenv('VCV_TOKEN_URL');
        $url = vchelper('Url')->query($url, $body);
        $result = wp_remote_get(
            $url,
            [
                'timeout' => 30,
            ]
        );

        return $this->getTokenResponse($result);
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
     * @param $result
     *
     * @return string|bool
     */
    protected function getTokenResponse($result)
    {
        $loggerHelper = vchelper('Logger');
        $noticeHelper = vchelper('Notice');
        $licenseHelper = vchelper('License');

        $body = [];
        if (is_array($result) && isset($result['body'])) {
            $body = json_decode($result['body'], true);
        }

        if ($body && isset($body['error'], $body['error']['type'], $body['error']['code'])) {
            $code = $body['error']['code'];
            $licenseHelper->setKey('');
            $loggerHelper->log(
                $licenseHelper->licenseErrorCodes($code),
                [
                    'result' => $body,
                ]
            );
            $noticeHelper->addNotice(
                'license:expiration',
                $licenseHelper->licenseErrorCodes($code)
            );

            return false;
        }

        if (!empty($body) && !vcIsBadResponse($result)) {
            if (is_array($body) && isset($body['data'], $body['success']) && $body['success']) {
                $token = $body['data']['token'];
                $this->call('checkLicenseExpiration', ['data' => $body['data']]);

                return $token;
            }
        }

        return false;
    }

    /**
     * @param $data
     * @param \VisualComposer\Helpers\Notice $noticeHelper
     */
    protected function checkLicenseExpiration($data, Notice $noticeHelper)
    {
        if (isset($data['license_expires_soon']) && $data['license_expires_soon']) {
            $message = sprintf(
                __('Your Visual Composer Website Builder License will expire soon - %s', 'vcwb'),
                date(
                    get_option('date_format') . ' ' . get_option('time_format'),
                    strtotime($data['license_expires_at']['date'])
                )
            );
            $noticeHelper->addNotice('license:expiration', $message);
        } else {
            if (isset($data['license_expires_at'])) {
                $noticeHelper->removeNotice('license:expiration');
            }
        }
    }
}
