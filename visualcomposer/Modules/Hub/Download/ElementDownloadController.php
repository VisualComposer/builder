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
        }
    }

    protected function ajaxDownloadElement($response, $payload, Request $requestHelper, Token $tokenHelper)
    {
        if (empty($response) || !vcIsBadResponse($response)) {
            $bundle = $requestHelper->input('vcv-bundle');
            $token = $tokenHelper->createToken();

            $json = $this->sendRequestJson($bundle, $token);
            if (!vcIsBadResponse($json)) {
                // fire the download process
                $requestHelper->setData(
                    [
                        'action' => $json,
                    ]
                );
                $response = vcfilter('vcv:ajax:hub:action:adminNonce', $response);
                if (!vcIsBadResponse($response)) {
                    // Need get element data
                    $hubElementsHelper = vchelper('HubElements');
                    $elementTag = lcfirst(str_replace('element/', '', $bundle));
                    $elements = $hubElementsHelper->getElements();
                    if (isset($elements[ $elementTag ])) {
                        // OK!
                        $response['element'] = $elements[ $elementTag ];
                    } else {
                        vchelper('Logger')->log(
                            __('Element downloaded but failed to fetch settings', 'vcwb'),
                            ['response' => $response]
                        );
                        $response = [
                            'status' => false,
                            'message' => __('Failed to download element', 'vcwb'),
                        ];
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
                'timeout' => 10,
            ]
        );
        $result = $this->checkResponse($response);

        return $result;
    }

    /**
     * @param $response
     *
     * @return array
     */
    protected function checkResponse($response)
    {
        $result = ['status' => false];
        $loggerHelper = vchelper('Logger');
        $optionsHelper = vchelper('Options');
        $downloadHelper = vchelper('HubDownload');
        if (!vcIsBadResponse($response)) {
            $actions = json_decode($response['body'], true);
            if (isset($actions['actions'])) {
                $action = current($actions['actions']);
                if (!empty($action)) {
                    $optionNameKey = $action['action'] . $action['version'];
                    $optionsHelper->set('hubAction:download:' . $optionNameKey, $action);
                    $result = [
                        'status' => true,
                        'action' => $action['action'],
                        'key' => $optionNameKey,
                        'name' => isset($action['name']) && !empty($action['name']) ? $action['name']
                            : $downloadHelper->getActionName($action['name']),
                    ];
                } else {
                    $loggerHelper->log(
                        __('Failed to find element in hub', 'vcwb'),
                        [
                            'result' => $action,
                        ]
                    );
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

        return $result;
    }
}
