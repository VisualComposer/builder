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
        $this->addFilter('vcv:ajax:hub:action:adminNonce', 'ajaxProcessAction');
        $this->addEvent('vcv:system:factory:reset', 'unsetOptions');
    }

    protected function ajaxGetRequiredActions($response, $payload, Logger $loggerHelper, Options $optionsHelper, Download $downloadHelper)
    {
        if (!vcIsBadResponse($response)) {
            $requiredActions = [];
            if ($payload['json'] && !empty($payload['json']['actions'])) {
                $optionHelper = vchelper('Options');
                $needUpdatePost = [];
                list($needUpdatePost, $requiredActions) = $this->loopActions($requiredActions, $needUpdatePost, $payload, $downloadHelper, $optionHelper);
                $response['actions'] = $requiredActions;
                $response['post_update_required'] = array_unique($needUpdatePost);
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
                $action['version'],
                $action['checksum'],
                $action['name']
            );
        }

        return $response;
    }

    protected function processAction(
        $action,
        $data,
        $version,
        $checksum,
        $name
    ) {
        $response = [
            'status' => true,
        ];
        $optionHelper = vchelper('Options');
        $actionResult = $this->triggerAction($action, $data, $version, $checksum);
        if (is_array($actionResult) && $actionResult['status']) {
            $optionHelper->set('hubAction:' . $action, $version);
        } else {
            $loggerHelper = vchelper('Logger');
            $loggerHelper->log(
                sprintf(__('Failed to download %1$s', 'vcwb'), $name),
                [
                    'version' => $version,
                    'action' => $action,
                    'data' => $data,
                    'checksum' => $checksum,
                ]
            );
            return false;
        }


        return $response;
    }

    protected function triggerAction($action, $data, $version, $checksum)
    {
        $response = vcfilter(
            'vcv:hub:process:json:' . $action,
            ['status' => true],
            [
                'action' => $action,
                'data' => $data,
                'version' => $version,
                'checksum' => $checksum,
            ]
        );

        return $response;
    }

    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper
            ->deleteTransient('vcv:activation:request');
        global $wpdb;
        $wpdb->query($wpdb->prepare('DELETE FROM ' . $wpdb->options . ' WHERE option_name LIKE "%s"', VCV_PREFIX . 'hubAction:%'));
    }

    /**
     * @param $requiredActions
     * @param $needUpdatePost
     * @param $payload
     * @param Download $downloadHelper
     * @param Options $optionHelper
     * @return array
     */
    protected function loopActions($requiredActions, $needUpdatePost, $payload, Download $downloadHelper, Options $optionHelper)
    {
        foreach ($payload['json']['actions'] as $key => $value) {
            if (isset($value['action'])) {
                $action = $value['action'];
                $data = $value['data'];
                $checksum = isset($value['checksum']) ? $value['checksum'] : '';
                $version = $value['version'];
                $previousVersion = $optionHelper->get('hubAction:' . $action, '0');
                if ($version && version_compare($version, $previousVersion, '>') || !$version) {
                    if (isset($value['last_post_update']) && version_compare($value['last_post_update'], $previousVersion, '>')) {
                        $posts = vcfilter('vcv:hub:findUpdatePosts:' . $action, [], ['action' => $action]);
                        if (!empty($posts) && is_array($posts)) {
                            $needUpdatePost = $posts + $needUpdatePost;
                        }
                    }
                    $requiredActions[] = [
                        'name' => isset($value['name']) && !empty($value['name']) ? $value['name'] : $downloadHelper->getActionName($action),
                        'action' => $action,
                        'data' => $data,
                        'checksum' => $checksum,
                        'version' => $version,
                    ];
                }
            }
        }
        return [$needUpdatePost, $requiredActions];
    }
}
