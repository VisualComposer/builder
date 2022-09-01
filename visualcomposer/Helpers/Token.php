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
     * @return bool|string|array
     */
    public function getToken()
    {
        $licenseHelper = vchelper('License');
        if ($licenseHelper->isPremiumActivated()) {
            $body = [
                'hoster_id' => 'account',
                'id' => VCV_PLUGIN_URL,
                'domain' => get_site_url(),
                'url' => VCV_PLUGIN_URL,
                'vcv-version' => VCV_VERSION,
            ];
            $body['license-key'] = $licenseHelper->getKey();
            $url = vcvenv('VCV_TOKEN_URL');
            if (defined('VCV_AUTHOR_API_KEY') && $licenseHelper->isThemeActivated()) {
                $body['author_api_key'] = constant('VCV_AUTHOR_API_KEY');
                $url = vcvenv('VCV_THEME_TOKEN_URL');
            }
            $url = vchelper('Url')->query($url, $body);

            $result = wp_remote_get(
                $url,
                [
                    'timeout' => 30,
                ]
            );

            return $this->getTokenResponse($result);
        }

        return 'free-token';
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
        $optionsHelper = vchelper('Options');

        $body = [];
        if (is_array($result) && isset($result['body'])) {
            $body = json_decode($result['body'], true);
        }

        if ($body && isset($body['error']['type'], $body['error']['code'])) {
            $code = $body['error']['code'];
            $licenseHelper->setKey('');
            $licenseHelper->setType('');
            $licenseHelper->setExpirationDate('');
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
                if (isset($body['data']['license_type'])) {
                    $previousType = $licenseHelper->getType();
                    $licenseType = $body['data']['license_type'];
                    if ($previousType !== $licenseType) {
                        $optionsHelper->deleteTransient('lastBundleUpdate');
                        $licenseHelper->setType($licenseType);
                        $licenseHelper->updateUsageDate(true);
                    }
                    $licenseHelper->setExpirationDate($body['data']['expiration']);
                    $licenseHelper->updateUsageDate();
                }

                $this->checkLicenseExpiration($body['data'], $noticeHelper);

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
        if (isset($data['expiration'])) {
            // if soon (<7 days) then show warning
            if ($data['expiration'] !== 'lifetime' && (int)$data['expiration'] < (time() + WEEK_IN_SECONDS)) {
                $message = sprintf(
                    // translators: %s: date
                    __('Your Visual Composer Website Builder License will expire soon - %s', 'visualcomposer'),
                    gmdate(
                        get_option('date_format') . ' ' . get_option('time_format'),
                        $data['expiration']
                    )
                );
                $noticeHelper->addNotice('license:expiration', $message);
            } else {
                $noticeHelper->removeNotice('license:expiration');
            }
        }
    }
}
