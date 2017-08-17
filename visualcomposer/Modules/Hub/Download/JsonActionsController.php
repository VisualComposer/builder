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
use VisualComposer\Helpers\Traits\EventsFilters;

class JsonActionsController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:hub:download:json', 'processJson');
    }

    protected function processJson($status, $payload, Logger $loggerHelper)
    {
        if ($status && $payload['json'] && !empty($payload['json']['actions'])) {
            $optionHelper = vchelper('Options');
            $errorCnt = 0;
            foreach ($payload['json']['actions'] as $key => $value) {
                $break = false;
                if (isset($value['action'])) {
                    $action = $value['action'];
                    $data = $value['data'];
                    $version = $value['version'];
                    $previousVersion = $optionHelper->get('hubAction' . $action, '0');
                    $status = $this->proccessAction(
                        $status,
                        $version,
                        $previousVersion,
                        $action,
                        $data,
                        $optionHelper,
                        $errorCnt,
                        $break
                    );
                    if ($break) {
                        break;
                    }
                }
            }
        } else {
            $loggerHelper->log(
                __('Failed to process json', 'vcwb'),
                [
                    'payload' => $payload,
                    'status' => $status,
                ]
            );
            $status = false;
        }

        return $status;
    }

    /**
     * @param $status
     * @param $version
     * @param $previousVersion
     * @param $action
     * @param $data
     * @param $optionHelper
     * @param $errorCnt
     *
     * @param $break
     *
     * @return bool
     */
    protected function proccessAction(
        $status,
        $version,
        $previousVersion,
        $action,
        $data,
        $optionHelper,
        &$errorCnt,
        &$break
    ) {
        if ($version && version_compare($version, $previousVersion, '>') || !$version) {
            $actionResult = $this->triggerAction($status, $version, $action, $data);
            if ($actionResult !== false) {
                $optionHelper->set('hubAction' . $action, $version);
            } else {
                // Try one more time
                $actionResult = $this->triggerAction($status, $version, $action, $data);
                if ($actionResult !== false) {
                    $optionHelper->set('hubAction' . $action, $version);
                } else {
                    $loggerHelper = vchelper('Logger');
                    $loggerHelper->log(
                        sprintf(__('Failed to download element on hubAction %1$s', 'vcwb'), $action),
                        [
                            'version' => $version,
                            'action' => $action,
                            'data' => $data,
                        ]
                    );
                    $status = false;
                    $errorCnt++;
                    if ($errorCnt > 2) {
                        $break = true;
                    }
                }
            }
        }

        return $status;
    }

    /**
     * @param $status
     * @param $version
     * @param $action
     * @param $data
     *
     * @return array|null
     */
    protected function triggerAction($status, $version, $action, $data)
    {
        $actionResult = vcfilter(
            'vcv:hub:process:json:' . $action,
            $status,
            [
                'action' => $action,
                'data' => $data,
                'version' => $version,
            ]
        );

        return $actionResult;
    }
}
