<?php

namespace VisualComposer\Modules\Hub\Download;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;

class JsonActionsController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:hub:download:json', 'processJson');
    }

    protected function processJson($status, $payload)
    {
        if ($status && $payload['json'] && !empty($payload['json']['actions'])) {
            $optionHelper = vchelper('Options');
            foreach ($payload['json']['actions'] as $key => $value) {
                if (isset($value['action'])) {
                    $action = $value['action'];
                    $data = $value['data'];
                    $version = $value['version'];
                    $previousVersion = $optionHelper->get('hubAction' . $action, '0');
                    if ($version && version_compare($version, $previousVersion, '>') || !$version) {
                        $actionResult = vcfilter(
                            'vcv:hub:process:json:' . $action,
                            $status,
                            [
                                'action' => $action,
                                'data' => $data,
                                'version' => $version,
                            ]
                        );
                        if ($actionResult !== false) {
                            $optionHelper->set('hubAction' . $action, $version);
                        } else {
                            $status = false;
                            break; // we should not continue if some part was broken
                        }
                    }
                }
            }
        } else {
            $status = false;
        }

        return $status;
    }
}
