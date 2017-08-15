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
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;

class JsonDownloadController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:activation:success', 'prepareJsonDownload');
    }

    protected function prepareJsonDownload(
        $response,
        $payload,
        Bundle $hubHelper,
        Filters $filterHelper,
        Options $optionsHelper
    ) {
        $status = $response;
        if ($response !== false && !is_array($response)) {
            $json = $optionsHelper->getTransient('vcv:hub:download:json');
            if (!$json) {
                $url = $hubHelper->getJsonDownloadUrl(['token' => $payload['token']]);
                $json = $this->readBundleJson($url);
                $optionsHelper->setTransient('vcv:hub:download:json', $json, 3600);
            }
            // if json is empty array it means that no release yet available!
            if ($json) {
                $status = $filterHelper->fire('vcv:hub:download:json', true, ['json' => $json]);
            }
        }

        return $status;
    }

    protected function readBundleJson($url)
    {
        $result = false;
        if ($url && !is_wp_error($url)) {
            $response = wp_remote_get($url);
            if (wp_remote_retrieve_response_code($response) === 200) {
                $result = json_decode($response['body'], true);
            }
        } else {
            $loggerHelper = vchelper('Logger');
            $loggerHelper->log(
                __('Failed read bundle json', 'vcwb'),
                [
                    'body' => $result['body'],
                    'url' => $url,
                    'wp_error' => is_wp_error($url),
                ]
            );
        }



        return $result;
    }
}
