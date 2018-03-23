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

    protected function ajaxGetRequiredActions(
        $response,
        $payload,
        Logger $loggerHelper
    ) {
        if (!vcIsBadResponse($response)) {
            if ($payload['json'] && !empty($payload['json']['actions'])) {
                $hubBundle = vchelper('HubBundle');
                $hubUpdateHelper = vchelper('HubUpdate');
                list($needUpdatePost, $requiredActions) = $hubBundle->loopActions($payload['json']);
                $reRenderPosts = array_unique($needUpdatePost);
                $response['actions'] = $requiredActions;
                if (count($reRenderPosts) > 0 && vcvenv('VCV_TF_POSTS_RERENDER', false)) {
                    $postsActions = $hubUpdateHelper->createPostUpdateObjects($reRenderPosts);
                    $response['actions'] = array_merge($response['actions'], $postsActions);
                }
            } else {
                $loggerHelper->log(
                    __('Failed to process required actions', 'vcwb') . ' #10056',
                    [
                        'payload' => $payload,
                        'response' => $response,
                    ]
                );
            }
        }

        return $response;
    }

    protected function ajaxProcessAction(
        $response,
        $payload,
        Request $requestHelper,
        Options $optionsHelper,
        Logger $loggerHelper
    ) {
        if (empty($response)) {
            $response = [
                'status' => true,
            ];
        }
        if (!vcIsBadResponse($response)) {
            $optionsHelper->setTransient('vcv:activation:request', $requestHelper->input('vcv-time'), 60);
            $action = $requestHelper->input('vcv-hub-action');
            if (!isset($action['key']) && isset($action['data'])) {
                $savedAction = $action;
            } else {
                $savedAction = $optionsHelper->get('hubA:d:' . md5($action['key']), false);
            }
            if (!$savedAction) {
                $loggerHelper->log('The update action does not exists #10057');

                return ['status' => false];
            }

            $previousVersion = $optionsHelper->get('hubAction:' . $savedAction['action'], '0');
            // FIX: For cases when hubElements wasnt updated but hubAction already exists
            if (vchelper('Str')->contains($savedAction['action'], 'element/')) {
                $elements = vchelper('HubElements')->getElements();
                $elementTag = str_replace('element/', '', $savedAction['action']);
                if (!array_key_exists($elementTag, $elements)) {
                    $previousVersion = '0.0.1'; // In case if element still not exists then try to download again
                }
            }

            if (isset($savedAction['version']) && version_compare($savedAction['version'], $previousVersion, '>')
                || !isset($savedAction['action'])
                || !$savedAction['version']) {
                $response = $this->processAction(
                    $response,
                    $savedAction['action'],
                    $savedAction['data'],
                    $savedAction['version'],
                    isset($savedAction['checksum']) ? $savedAction['checksum'] : '',
                    $savedAction['name']
                );
            }
        }

        return $response;
    }

    protected function processAction(
        $response,
        $action,
        $data,
        $version,
        $checksum,
        $name
    ) {
        $optionsHelper = vchelper('Options');
        $response = $this->triggerAction($response, $action, $data, $version, $checksum);
        if (is_array($response) && $response['status']) {
            $optionsHelper->set('hubAction:' . $action, $version);
        } else {
            $loggerHelper = vchelper('Logger');
            $loggerHelper->log(
                sprintf(__('Failed to download %1$s', 'vcwb') . ' #10058', $name),
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

    protected function triggerAction($response, $action, $data, $version, $checksum)
    {
        $response = vcfilter(
            'vcv:hub:process:action:' . $action,
            $response,
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
        $wpdb->query(
            $wpdb->prepare(
                'UPDATE ' . $wpdb->options . ' SET option_value="0.0.1" WHERE option_name LIKE "%s"',
                VCV_PREFIX . 'hubAction:%'
            )
        );
        $wpdb->query(
            $wpdb->prepare(
                'DELETE FROM ' . $wpdb->options . ' WHERE option_name LIKE "%s"',
                VCV_PREFIX . 'hubA:d:%'
            )
        );
        // Remove before 1.13 keys
        $wpdb->query(
            $wpdb->prepare(
                'DELETE FROM ' . $wpdb->options . ' WHERE option_name LIKE "%s"',
                VCV_PREFIX . 'hubAction:download:%'
            )
        );
        $optionsHelper->set('hubAction:updatePosts', []);
    }
}
