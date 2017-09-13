<?php

namespace VisualComposer\Modules\Hub\Download;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Filters;
use VisualComposer\Helpers\Hub\Bundle;
use VisualComposer\Helpers\Logger;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;

class JsonDownloadController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        if (vcvenv('VCV_ENV_HUB_DOWNLOAD')) {
            $this->addFilter('vcv:activation:token:success', 'prepareJsonDownload');
        }
    }

    protected function prepareJsonDownload(
        $response,
        $payload,
        Bundle $hubHelper,
        Filters $filterHelper,
        Options $optionsHelper,
        Logger $loggerHelper
    ) {
        if (!vcIsBadResponse($response)) {
            $json = $optionsHelper->getTransient('vcv:hub:download:json');
            if (!$json) {
                $url = $hubHelper->getJsonDownloadUrl(['token' => $payload['token']]);
                $json = $this->readBundleJson($url);
            }
            // if json is empty array it means that no release yet available!
            if (!vcIsBadResponse($json)) {
                $response = $filterHelper->fire('vcv:hub:download:json', $response, ['json' => $json]);
                $optionsHelper->setTransient('vcv:hub:download:json', $json, 600);
            } else {
                $loggerHelper->log(
                    __('Failed to download json', 'vcwb'),
                    [
                        'url' => isset($url) ? $url : 'url not set',
                    ]
                );

                return false;
            }
        } else {
            $loggerHelper->log(__('Failed to prepare json download', 'vcwb'), [
                'response' => $response,
            ]);

            return false;
        }

        return $response;
    }

    protected function readBundleJson($url)
    {
        $result = false;
        if ($url && !is_wp_error($url)) {
            $response = wp_remote_get($url);
            if (!vcIsBadResponse($response)) {
                $result = json_decode($response['body'], true);
            }
        }

        if (!$url || is_wp_error($url) || vcIsBadResponse($response)) {
            $loggerHelper = vchelper('Logger');

            if (is_wp_error($result)) {
                $resultDetails = $result->get_error_message();
            } else {
                $resultDetails = $result['body'];
            }

            $loggerHelper->log(
                __('Failed read bundle json', 'vcwb'),
                [
                    'result' => $resultDetails,
                    'url' => $url,
                    'wp_error' => is_wp_error($url),
                ]
            );
        }


        return $result;
    }
}
