<?php

namespace VisualComposer\Modules\Hub\Addons;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\EventsFilters;

class AddonDownloadController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Hub\Addons\AddonDownloadController::ajaxDownloadAddon */
        $this->addFilter('vcv:ajax:hub:download:addon:adminNonce', 'ajaxDownloadAddon');
    }

    protected function ajaxDownloadAddon($response, $payload, Request $requestHelper, Token $tokenHelper, License $licenseHelper)
    {
        if (empty($response)) {
            $response = [
                'status' => true,
            ];
        }

        if (!$licenseHelper->isPremiumActivated() && !$licenseHelper->agreeHubTerms()) {
            return false;
        }

        if (!vcIsBadResponse($response)) {
            $bundle = $requestHelper->input('vcv-bundle');
            $token = $tokenHelper->getToken();
            if (!$token) {
                return false;
            }

            $json = $this->sendRequestJson($bundle, $token);
            if (!vcIsBadResponse($json)) {
                // fire the download process
                if (isset($json['actions'])) {
                    foreach ($json['actions'] as $action) {
                        $requestHelper->setData(
                            [
                                'vcv-hub-action' => $action,
                            ]
                        );
                        $response = vcfilter('vcv:ajax:hub:action:adminNonce', $response, [], true);
                    }
                }
                $response = $this->initializeElementsAndAddons($response);
                $response = vcfilter('vcv:hub:addonDownloadController:download:response', $response);
            } else {
                return false;
            }
        }

        return $response;
    }

    protected function sendRequestJson($bundle, $token)
    {
        $hubBundleHelper = vchelper('HubBundle');
        $urlParam = ['token' => $token, 'bundle' => $bundle];
        $url = $hubBundleHelper->getAssetDownloadUrl('addon', $urlParam);
        $response = wp_remote_get(
            $url,
            [
                'timeout' => 30,
            ]
        );
        $response = $this->checkResponse($response);

        return $response;
    }

    /**
     * @param $response
     *
     * @return array|\WP_Error
     */
    protected function checkResponse($response)
    {
        $optionsHelper = vchelper('Options');
        $downloadHelper = vchelper('HubDownload');
        if (!vcIsBadResponse($response)) {
            $actions = json_decode($response['body'], true);
            if (isset($actions['actions'])) {
                $response['status'] = true;
                foreach ($actions['actions'] as $action) {
                    if (!empty($action)) {
                        $optionNameKey = $action['action'] . $action['version'];
                        // Saving in database the downloading information
                        $optionsHelper->set('hubA:d:' . md5($optionNameKey), $action);
                        if (isset($action['name']) && !empty($action['name'])) {
                            $actionName = $action['name'];
                        } else {
                            $actionName = $downloadHelper->getActionName($action['name']);
                        }
                        $actionData = [
                            'action' => $action['action'],
                            'key' => $optionNameKey,
                            'name' => $actionName,
                        ];
                        if (!isset($response['actions']) || !is_array($response['actions'])) {
                            $response['actions'] = [];
                        }
                        $response['actions'][] = $actionData;
                    }
                }
            }
        } else {
            return false;
        }

        return $response;
    }

    /**
     * @param $response
     *
     * @return mixed
     */
    protected function initializeElementsAndAddons($response)
    {
        if (!isset($response['variables'])) {
            $response['variables'] = [];
        }
        if (isset($response['addons'])) {
            foreach ($response['addons'] as $addon) {
                vcevent('vcv:hub:addons:autoload', ['addon' => $addon]);
                $response['variables'] = vcfilter(
                    'vcv:editor:variables/' . $addon['tag'],
                    $response['variables']
                );
            }
        }
        if (isset($response['elements'])) {
            foreach ($response['elements'] as $element) {
                // Try to initialize PHP in element via autoloader
                vcevent('vcv:hub:elements:autoload', ['element' => $element]);
                $response['variables'] = vcfilter(
                    'vcv:editor:variables/' . $element['tag'],
                    $response['variables']
                );
            }
        }

        return $response;
    }
}
