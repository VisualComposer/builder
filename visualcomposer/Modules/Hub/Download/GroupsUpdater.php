<?php

namespace VisualComposer\Modules\Hub\Download;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Differ;
use VisualComposer\Helpers\Logger;
use VisualComposer\Helpers\Traits\EventsFilters;

class GroupsUpdater extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Hub\Download\GroupsUpdater::updateGroups */
        $this->addFilter('vcv:hub:download:bundle vcv:hub:download:bundle:categories', 'updateGroups');
    }

    protected function updateGroups($response, $payload, Logger $loggerHelper)
    {
        $bundleJson = $payload['archive'];
        if (vcIsBadResponse($response) || !$bundleJson || is_wp_error($bundleJson)) {
            $this->logErrors($response, $loggerHelper, $bundleJson);

            return ['status' => false];
        }
        $hubHelper = vchelper('HubGroups');
        /** @var Differ $groupsDiffer */
        $hubGroups = $hubHelper->getGroups();

        $groupsDiffer = vchelper('Differ');
        if (!empty($hubGroups)) {
            $groupsDiffer->set($hubGroups);
        }

        $groupsDiffer->onUpdate(
            [$hubHelper, 'updateGroup']
        )->set(
            $bundleJson['groups']
        );
        $hubHelper->setGroups($groupsDiffer->get());

        return $response;
    }

    /**
     * @param $response
     * @param \VisualComposer\Helpers\Logger $loggerHelper
     * @param $bundleJson
     */
    protected function logErrors($response, Logger $loggerHelper, $bundleJson)
    {
        $messages = [];
        $messages[] = __('Failed to update groups', 'vcwb') . ' #10051';

        if (is_wp_error($response)) {
            /** @var \WP_Error $response */
            $messages[] = implode('. ', $response->get_error_messages()) . ' #10052';
        } elseif (is_array($response) && isset($response['body'])) {
            // @codingStandardsIgnoreLine
            $resultDetails = @json_decode($response['body'], 1);
            if (is_array($resultDetails) && isset($resultDetails['message'])) {
                $messages[] = $resultDetails['message'] . ' #10053';
            }
        }
        if (is_wp_error($bundleJson)) {
            /** @var \WP_Error $bundleJson */
            $messages[] = implode('. ', $bundleJson->get_error_messages()) . ' #10054';
        } elseif (is_array($bundleJson) && isset($bundleJson['body'])) {
            // @codingStandardsIgnoreLine
            $resultDetails = @json_decode($bundleJson['body'], 1);
            if (is_array($resultDetails) && isset($resultDetails['message'])) {
                $messages[] = $resultDetails['message'] . ' #10055';
            }
        }

        $loggerHelper->log(
            implode('. ', $messages),
            [
                'response' => is_wp_error($response) ? 'wp error' : $response,
                'bundleJson' => is_wp_error($bundleJson) ? 'wp error' : $bundleJson,
            ]
        );
    }
}
