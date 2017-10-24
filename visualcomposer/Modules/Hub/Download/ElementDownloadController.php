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
            $this->addFilter('vcv:ajax:hub:download:element:adminNonce', 'ajaxDownloadElementJson');
        }
    }

    protected function ajaxDownloadElementJson($response, $payload, Request $requestHelper, Token $tokenHelper)
    {
        if (empty($response) || !vcIsBadResponse($response)) {
            $bundle = $requestHelper->input('bundle');
            $token = $tokenHelper->createToken();

            $response = $this->sendRequestJson($bundle, $token);
        }

        return $response;
    }

    protected function sendRequestJson($bundle, $token)
    {
        $hubBundleHelper = vchelper('HubBundle');
        $loggerHelper = vchelper('Logger');
        $optionsHelper = vchelper('Options');
        $downloadHelper = vchelper('HubDownload');
        $url = $hubBundleHelper->getElementDownloadUrl(['token' => $token, 'bundle' => $bundle]);
        $response = wp_remote_get(
            $url,
            [
                'timeout' => 10,
            ]
        );
        $result = false;
        if (!vcIsBadResponse($response)) {
            $actions = json_decode($response['body'], true);
            if (isset($actions['actions'])) {
                $action = current($actions['actions']);
                $optionNameKey = $action['action'] . $action['version'];
                $optionsHelper->set('hubAction:download:' . $optionNameKey, $action);
                $result = [
                    'status' => true,
                    'action' => $action['action'],
                    'key' => $optionNameKey,
                    'name' => isset($action['name']) && !empty($action['name']) ? $action['name']
                        : $downloadHelper->getActionName($action),
                ];
            }
        } else {
            if (is_wp_error($response)) {
                /** @var \WP_Error $result */
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
