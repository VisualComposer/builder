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
            /** @see \VisualComposer\Modules\Hub\Download\BundleUpdateController::checkVersion */
            $this->addFilter('vcv:hub:update:checkVersion', 'checkVersion');
            $this->addFilter('vcv:editors:frontend:render', 'checkForUpdate', -1);
            $this->addFilter('vcv:ajax:bundle:update:finished:adminNonce', 'finishUpdate');
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
        $noticeHelper = vchelper('Notice');
        $token = $tokenHelper->createToken($optionsHelper->get('hubTokenId'));
        if (!vcIsBadResponse($token)) {
            $url = $hubBundleHelper->getJsonDownloadUrl(['token' => $token]);
            $json = $hubBundleHelper->getRemoteBundleJson($url);
            if ($json) {
                return $this->processJson($json);
            } else {
                return ['status' => false];
            }
        } elseif ($licenseHelper->isActivated() && isset($token['code'])) {
            $licenseHelper->setKey('');
            $noticeHelper->addNotice('premium:deactivated', $licenseHelper->licenseErrorCodes($token['code']));
        }

        return ['status' => false];
    }

    protected function finishUpdate($response, $payload, Request $requestHelper, Options $optionsHelper)
    {
        $currentTransient = $optionsHelper->getTransient('vcv:activation:request');
        if ($currentTransient) {
            if ($currentTransient !== $requestHelper->input('vcv-time')) {
                return ['status' => false];
            } else {
                // Reset bundles from activation
                $optionsHelper->deleteTransient('vcv:activation:request');
            }
        }
        $optionsHelper->set('bundleUpdateRequired', false);

        return [
            'status' => true,
        ];
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
            if ($hubUpdateHelper->checkIsUpdateRequired($json)) {
                $optionsHelper->set('bundleUpdateRequired', true);
                // Save in database cache for 30m
                $optionsHelper->setTransient('bundleUpdateJson', $json, 1800);
            }

            return ['status' => true, 'json' => $json];
        }

        return false;
    }

    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper
            ->delete('bundleUpdateRequired')
            ->delete('bundleUpdateActions')
            ->delete('bundleUpdateJson')
            ->deleteTransient('bundleUpdateJson')
            ->deleteTransient('lastBundleUpdate')
            ->deleteTransient('_vcv_update_page_redirect')
            ->deleteTransient('_vcv_update_page_redirect_url');
    }
}
