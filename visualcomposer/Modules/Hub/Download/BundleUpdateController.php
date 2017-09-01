<?php

namespace VisualComposer\Modules\Hub\Download;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Logger;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Url;
use VisualComposer\Modules\Hub\Download\Pages\UpdateBePage;

class BundleUpdateController extends Container implements Module
{
    use EventsFilters;

    public function __construct(Token $tokenHelper)
    {
        if (vcvenv('VCV_ENV_HUB_DOWNLOAD') && $tokenHelper->isSiteAuthorized()) {
            $this->addEvent('vcv:admin:inited vcv:system:activation:hook', 'checkForUpdate');
            $this->addFilter('vcv:editors:frontend:render', 'checkForUpdate', -1);
            $this->addFilter('vcv:editors:frontend:render', 'setUpdatingViewFe', 120);
            $this->addFilter('vcv:frontend:update:head:extraOutput', 'addUpdateAssets', 10);
            $this->addFilter(
                'vcv:editors:backend:addMetabox',
                'setRedirectToUpdateBe',
                120
            );
            $this->addFilter('vcv:editors:backend:addMetabox', 'doRedirectBe', 130);
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
        $tokenHelper = vchelper('Token');
        $token = $tokenHelper->createToken($optionsHelper->get('hubTokenId'));
        if ($token) {
            $url = $hubBundleHelper->getJsonDownloadUrl(['token' => $token]);
            $json = $this->readBundleJson($url);
            if ($json) {
                return $this->processJson($json);
            } else {
                return ['status' => false];
            }
        }

        return ['status' => false];
    }

    protected function readBundleJson($url)
    {
        $result = false;
        if ($url && !is_wp_error($url)) {
            $response = wp_remote_get($url);
            if (wp_remote_retrieve_response_code($response) === 200) {
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

    protected function setUpdatingViewFe($response, Options $optionsHelper)
    {
        if ($optionsHelper->get('bundleUpdateRequired')) {
            return vcview(
                'editor/frontend/frontend-updating.php',
                [
                    'actions' => $optionsHelper->get('bundleUpdateActions'),
                ]
            );
        }

        return $response;
    }

    protected function addUpdateAssets($response, $payload, Url $urlHelper)
    {
        // Add Vendor JS
        $response = array_merge(
            (array)$response,
            [
                sprintf(
                    '<link rel="stylesheet" href="%s"></link>',
                    $urlHelper->to(
                        'public/dist/wpupdate.bundle.css?v=' . VCV_VERSION
                    )
                ),
                sprintf(
                    '<script id="vcv-script-vendor-bundle-update" type="text/javascript" src="%s"></script>',
                    $urlHelper->to(
                        'public/dist/wpupdate.bundle.js?v=' . VCV_VERSION
                    )
                ),
            ]
        );

        return $response;
    }

    /**
     * Do redirect if required on welcome page
     *
     * @param $response
     * @param UpdateBePage $updateBePage
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return
     */
    protected function doRedirectBe($response, UpdateBePage $updateBePage, Options $optionsHelper)
    {
        $redirect = $optionsHelper->getTransient('_vcv_update_page_redirect');
        $optionsHelper->deleteTransient('_vcv_update_page_redirect');
        if ($redirect) {
            wp_redirect(admin_url('admin.php?page=' . rawurlencode($updateBePage->getSlug())));
        }

        return $response;
    }

    /**
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return mixed
     */
    protected function setRedirectToUpdateBe($response, $payload, Options $optionsHelper, Url $urlHelper)
    {
        if ($optionsHelper->get('bundleUpdateRequired')) {
            $optionsHelper->setTransient('_vcv_update_page_redirect', 1, 30);
            $optionsHelper->setTransient('_vcv_update_page_redirect_url', $urlHelper->current(), 30);
        }

        return $response;
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

    /**
     * @param $json
     * @return bool|array
     */
    protected function processJson($json)
    {
        if (is_array($json) && isset($json['actions'])) {
            $optionsHelper = vchelper('Options');
            $requiredActions = [];
            $downloadHelper = vchelper('HubDownload');
            foreach ($json['actions'] as $key => $value) {
                if (isset($value['action'])) {
                    $action = $value['action'];
                    $version = $value['version'];
                    $value['name'] = isset($value['name']) && !empty($value['name']) ? $value['name'] : $downloadHelper->getActionName($action);
                    $previousVersion = $optionsHelper->get('hubAction:' . $action, '0');
                    if ($version && version_compare($version, $previousVersion, '>') || !$version) {
                        $requiredActions[] = $value;
                    }
                }
            }
            if (!empty($requiredActions)) {
                $optionsHelper->set('bundleUpdateActions', $requiredActions);
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
