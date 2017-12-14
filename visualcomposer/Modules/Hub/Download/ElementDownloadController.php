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
                if (isset($json['actions'])) {
                    foreach ($json['actions'] as $action) {
                        $requestHelper->setData(
                            [
                                'vcv-hub-action' => $action, // element/row
                            ]
                        );
                        $response = vcfilter('vcv:ajax:hub:action:adminNonce', $response);
                        if (vcIsBadResponse($response)) {
                            vchelper('Logger')->log(
                                __('Bad response from hub:action #10078', 'vcwb'),
                                ['response' => $response]
                            );
                            $response = [
                                'status' => false,
                                'message' => __('Failed to download bundle #10079', 'vcwb'),
                            ];
                        }
                    }
                } else {
                    $response = [
                        'status' => false,
                        'message' => __('Failed to download bundle', 'vcwb'), // TODO add error codes
                    ];
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
     * @return array|\WP_Error
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
                            __('Failed to find element in hub #10042', 'vcwb'),
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
            $messages = [];
            $messages[] = __('Failed to read remote element bundle json #10043', 'vcwb');
            if (is_wp_error($response)) {
                /** @var \WP_Error $response */
                $messages[] = implode('. ', $response->get_error_messages()) . ' #10044';
            } elseif (is_array($response) && isset($response['body'])) {
                // @codingStandardsIgnoreLine
                $json = @json_decode($response['body'], 1);
                if (is_array($json) && isset($json['message'])) {
                    $messages[] = $json['message'] . ' #10045';
                }
            }

            $loggerHelper->log(
                implode('. ', $messages),
                [
                    'result' => $resultDetails,
                ]
            );
        }

        return $response;
    }
}
