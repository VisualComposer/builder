<?php

namespace VisualComposer\Modules\Hub\Download;

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
        if (vcvenv('VCV_HUB_DOWNLOAD_SINGLE_ELEMENT')) {
            $this->addFilter('vcv:ajax:hub:download:element:adminNonce', 'ajaxDownloadElement');
            $this->addFilter('vcv:ajax:hub:download:element:dev', 'ajaxDownloadElement');
        }
    }

    protected function ajaxDownloadElement($response, $payload, Request $requestHelper, Token $tokenHelper)
    {
        if (empty($response)) {
            $response = [
                'status' => true,
            ];
        }
        if (!vcIsBadResponse($response)) {
            $bundle = $requestHelper->input('vcv-bundle');
            $token = $tokenHelper->createToken();

            $json = $this->sendRequestJson($bundle, $token);
            if (!vcIsBadResponse($json)) {
                // fire the download process
                foreach ($json['actions'] as $action) {
                    $requestHelper->setData(
                        [
                            'vcv-hub-action' => $action, // element/row
                        ]
                    );
                    $response = vcfilter('vcv:ajax:hub:action:adminNonce', $response);
                    if (vcIsBadResponse($response)) {
                        vchelper('Logger')->log(
                            __('Bad response from hub:action', 'vcwb'),
                            ['response' => $response]
                        );
                        $response = [
                            'status' => false,
                            'message' => __('Failed to download element', 'vcwb'),
                        ];
                    }
                }
                if (isset($response['elements'])) {
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
                return $json;
            }
        }

        return $response;
    }

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
     * @return array
     */
    protected function checkResponse($response)
    {
        $loggerHelper = vchelper('Logger');
        $optionsHelper = vchelper('Options');
        $downloadHelper = vchelper('HubDownload');
        if (!vcIsBadResponse($response)) {
            $actions = json_decode($response['body'], true);
            if (isset($actions['actions'])) {
                $response['status'] = true;
                foreach ($actions['actions'] as $action) {
                    if (!empty($action)) {
                        $optionNameKey = $action['action'] . $action['version'];
                        $optionsHelper->set('hubAction:download:' . $optionNameKey, $action);
                        $actionData = [
                            'action' => $action['action'],
                            'key' => $optionNameKey,
                            'name' => isset($action['name']) && !empty($action['name']) ? $action['name']
                                : $downloadHelper->getActionName($action['name']),
                        ];
                        if (!isset($response['actions']) || !is_array($response['actions'])) {
                            $response['actions'] = [];
                        }
                        $response['actions'][] = $actionData;
                    } else {
                        $loggerHelper->log(
                            __('Failed to find element in hub', 'vcwb'),
                            [
                                'result' => $action,
                            ]
                        );
                    }
                }
            }
        } else {
            if (is_wp_error($response)) {
                /** @var \WP_Error $response */
                $resultDetails = $response->get_error_message();
            } else {
                $resultDetails = $response['body'];
            }

            $loggerHelper->log(
                __('Failed read remote element bundle json', 'vcwb'),
                [
                    'result' => $resultDetails,
                ]
            );
        }

        return $response;
    }
}
