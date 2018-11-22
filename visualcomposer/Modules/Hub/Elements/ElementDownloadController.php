<?php

namespace VisualComposer\Modules\Hub\Elements;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\EventsFilters;

class ElementDownloadController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:ajax:hub:download:element:adminNonce', 'ajaxDownloadElement');
    }

    protected function ajaxDownloadElement($response, $payload, Request $requestHelper, Token $tokenHelper)
    {
        // TODO: Fix default
        if (empty($response)) {
            $response = [
                'status' => true,
            ];
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
                                'vcv-hub-action' => $action, // element/row
                            ]
                        );
                        $response = vcfilter('vcv:ajax:hub:action:adminNonce', $response, [], true);
                    }
                }
                if ($response && isset($response['elements'])) {
                    $response['variables'] = [];
                    foreach ($response['elements'] as $element) {
                        // Try to initialize PHP in element via autoloader
                        vcevent('vcv:hub:elements:autoload', ['element' => $element]);
                        $response['variables'] = vcfilter(
                            'vcv:editor:variables/' . $element['tag'],
                            $response['variables']
                        );
                    }
                }
            } else {
                return false;
            }
        }

        return $response;
    }

    /**
     * @param $bundle
     * @param string $token
     *
     * @return array|\WP_Error
     */
    protected function sendRequestJson($bundle, $token)
    {
        $hubBundleHelper = vchelper('HubBundle');
        $url = $hubBundleHelper->getElementDownloadUrl(['token' => $token, 'bundle' => $bundle]);
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
}
