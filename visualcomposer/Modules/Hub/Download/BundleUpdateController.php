<?php

namespace VisualComposer\Modules\Hub\Download;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\EventsFilters;

class BundleUpdateController extends Container implements Module
{
    use EventsFilters;

    public function __construct(Token $tokenHelper)
    {
        if (vcvenv('VCV_ENV_HUB_DOWNLOAD') && $tokenHelper->isSiteAuthorized()) {
            $this->addEvent('vcv:admin:inited vcv:system:activation:hook', 'checkForUpdate');
            $this->addFilter('vcv:editors:frontend:render', 'checkForUpdate', -1);
            $this->addFilter('vcv:ajax:bundle:update:finished:adminNonce', 'setUpdateDone');
        }
        $this->addEvent('vcv:system:factory:reset', 'unsetOptions');
    }

    protected function checkForUpdate(Options $optionsHelper, $response = '')
    {
        if ($optionsHelper->getTransient('lastBundleUpdate') < time()) {
            $result = $this->checkVersion();
            if (!vcIsBadResponse($result)) {
                $optionsHelper->setTransient('lastBundleUpdate', time() + DAY_IN_SECONDS);
            }
        }

        return $response;
    }

    protected function checkVersion()
    {
        $optionsHelper = vchelper('Options');
        $hubBundleHelper = vchelper('HubBundle');
        $licenseHelper = vchelper('License');
        $tokenHelper = vchelper('Token');
        $token = $tokenHelper->createToken($optionsHelper->get('hubTokenId'));
        if (!vcIsBadResponse($token)) {
            $url = $hubBundleHelper->getJsonDownloadUrl(['token' => $token]);
            $json = $this->readBundleJson($url);
            if ($json) {
                return $this->processJson($json);
            } else {
                return ['status' => false];
            }
        } elseif ($licenseHelper->isActivated() && isset($token['code'])) {
            $licenseHelper->setKey('');
            if (!$optionsHelper->getTransient('premium:deactivated')
                && !$optionsHelper->getTransient(
                    'premium:deactivated:time'
                )) {
                $optionsHelper->setTransient('premium:deactivated', $token['code']);
                $optionsHelper->setTransient('premium:deactivated:time', time());
            }
        }

        return ['status' => false];
    }

    protected function setUpdateDone($response, $payload, Request $requestHelper, Options $optionsHelper)
    {
        $currentTransient = $optionsHelper->getTransient('vcv:hub:update:request');
        if ($currentTransient) {
            if ($currentTransient !== $requestHelper->input('time')) {
                return ['status' => false];
            } else {
                // Reset bundles from activation
                $optionsHelper->deleteTransient('vcv:activation:request');
                $optionsHelper->deleteTransient('vcv:hub:update:request');
            }
        }
        $optionsHelper->set('bundleUpdateRequired', false);

        return [
            'status' => true,
        ];
    }

    protected function readBundleJson($url)
    {
        $result = false;
        if ($url && !is_wp_error($url)) {
            $response = wp_remote_get($url);
            if (!vcIsBadResponse($response)) {
                $result = json_decode($response['body'], true);
            } else {
                $loggerHelper = vchelper('Logger');
                $loggerHelper->log('Failed to download updates list', [
                    'body' => $response['body'],
                ]);
            }
        }

        return $result;
    }

    /**
     * @param $json
     * @return bool|array
     */
    protected function processJson($json)
    {
        if (is_array($json) && isset($json['actions'])) {
            $optionsHelper = vchelper('Options');
            $hubUpdateHelper = vchelper('HubUpdate');
            $requiredActions = $hubUpdateHelper->getRequiredActions($json);
            if (!empty($requiredActions)) {
                $optionsHelper->set('bundleUpdateRequired', true);
                $optionsHelper->set('bundleUpdateJson', $json);
            }

            return ['status' => true];
        }

        return false;
    }

    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper
            ->delete('bundleUpdateRequired')
            ->delete('bundleUpdateActions')
            ->delete('bundleUpdateJson')
            ->deleteTransient('lastBundleUpdate')
            ->deleteTransient('_vcv_update_page_redirect')
            ->deleteTransient('_vcv_update_page_redirect_url')
            ->deleteTransient('vcv:hub:update:request');
    }
}
