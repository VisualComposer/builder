<?php

namespace VisualComposer\Modules\Hub\Download;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Hub\Download;
use VisualComposer\Helpers\Logger;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;

class JsonActionsController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:hub:download:json', 'ajaxGetRequiredActions');
        $this->addFilter('vcv:hub:update:json', 'processUpdateActions');
        $this->addFilter('vcv:ajax:hub:action:adminNonce', 'ajaxProcessAction');

        $this->addEvent('vcv:system:factory:reset', 'unsetOptions');
    }

    protected function ajaxGetRequiredActions($response, $payload, Logger $loggerHelper, Options $optionsHelper, Download $downloadHelper)
    {
        if (!vcIsBadResponse($response)) {
            $requiredActions = [];
            if ($payload['json'] && !empty($payload['json']['actions'])) {
                $optionHelper = vchelper('Options');
                foreach ($payload['json']['actions'] as $key => $value) {
                    if (isset($value['action'])) {
                        $action = $value['action'];
                        $data = $value['data'];
                        $version = $value['version'];
                        $previousVersion = $optionHelper->get('hubAction:' . $action, '0');
                        if ($version && version_compare($version, $previousVersion, '>') || !$version) {
                            $requiredActions[] = [
                                'name' => $downloadHelper->getActionName($action),
                                'action' => $action,
                                'data' => $data,
                                'version' => $version,
                            ];
                        }
                    }
                }
                $response['actions'] = $requiredActions;
            } else {
                $loggerHelper->log(
                    __('Failed to process required actions', 'vcwb'),
                    [
                        'payload' => $payload,
                        'response' => $response,
                    ]
                );
            }
        }

        return $response;
    }

    protected function processUpdateActions($response, $payload, Options $optionsHelper, Logger $loggerHelper)
    {
        if ($optionsHelper->get('bundleUpdateRequired')) {
            $requiredActions = $optionsHelper->get('bundleUpdateActions');
            $failed = false;
            $response = ['status' => true];
            if (is_array($requiredActions)) {
                foreach ($requiredActions as $value) {
                    $optionsHelper->setTransient('vcv:hub:update:request', 1, 60);
                    $actionResult = $this->processAction(
                        $value['action'],
                        $value['data'],
                        $value['version']
                    );
                    if (vcIsBadResponse($actionResult)) {
                        $loggerHelper->log('Failed to update action', [
                            'action' => $value,
                            'result' => $actionResult,
                        ]);
                        $failed = true;
                    }
                }
                if ($failed) {
                    $response = ['status' => false];
                }
            } else {
                $optionsHelper->set('bundleUpdateRequired', false);
            }
        }

        return $response;
    }

    protected function ajaxProcessAction($response, $payload, Request $requestHelper, Options $optionsHelper)
    {
        $response = [
            'status' => true,
        ];
        $optionsHelper->setTransient('vcv:activation:request', $requestHelper->input('time'), 60);
        $action = $requestHelper->input('action');
        $previousVersion = $optionsHelper->get('hubAction:' . $action['action'], '0');
        if ($action['version'] && version_compare($action['version'], $previousVersion, '>') || !$action['version']) {
            $response = $this->processAction(
                $action['action'],
                $action['data'],
                $action['version']
            );
        }

        return $response;
    }

    protected function processAction(
        $action,
        $data,
        $version
    ) {
        $response = [
            'status' => true,
        ];
        $optionHelper = vchelper('Options');
        $actionResult = $this->triggerAction($action, $data, $version);
        if (is_array($actionResult) && $actionResult['status']) {
            $optionHelper->set('hubAction:' . $action, $version);
        } else {
            $loggerHelper = vchelper('Logger');
            $loggerHelper->log(
                sprintf(__('Failed to download bundle on action %1$s', 'vcwb'), $action),
                [
                    'version' => $version,
                    'action' => $action,
                    'data' => $data,
                ]
            );
            $response['status'] = false;
        }


        return $response;
    }

    protected function triggerAction($action, $data, $version)
    {
        $response = vcfilter(
            'vcv:hub:process:json:' . $action,
            ['status' => true],
            [
                'action' => $action,
                'data' => $data,
                'version' => $version,
            ]
        );

        return $response;
    }

    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper
            ->deleteTransient('vcv:hub:download:json')
            ->deleteTransient('vcv:activation:request');
        global $wpdb;
        $wpdb->query($wpdb->prepare('DELETE FROM ' . $wpdb->options . ' WHERE option_name LIKE "%s"', VCV_PREFIX . 'hubAction:%'));
    }
}
