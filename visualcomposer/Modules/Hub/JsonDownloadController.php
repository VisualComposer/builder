<?php

namespace VisualComposer\Modules\Hub;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Filters;
use VisualComposer\Helpers\Hub\Bundle;
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
        Filters $filterHelper
    ) {
        if (!vcIsBadResponse($response)) {
            $url = $hubHelper->getJsonDownloadUrl(['token' => $payload['token']]);
            $json = $hubHelper->getRemoteBundleJson($url);
            // if json is empty array it means that no release yet available!
            if (!vcIsBadResponse($json)) {
                $response = $filterHelper->fire('vcv:hub:download:json', $response, ['json' => $json], true);
            }
        }

        return $response;
    }
}
