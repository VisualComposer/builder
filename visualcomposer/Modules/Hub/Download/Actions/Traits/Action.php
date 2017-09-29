<?php

namespace VisualComposer\Modules\Hub\Download\Actions\Traits;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Helpers\Filters;
use VisualComposer\Helpers\Traits\EventsFilters;

trait Action
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:hub:process:action:' . $this->actionName, 'processAction');
    }

    protected function processAction($response, $payload, Filters $filterHelper)
    {
        if (!vcIsBadResponse($response) && $payload['data']) {
            $hubHelper = vchelper($this->helperName);
            /** @var $hubHelper \VisualComposer\Helpers\Hub\Bundle */
            $hubHelper->removeTempBundleFolder();
            $archive = $hubHelper->requestBundleDownload($payload['data'], $payload['action']);
            $archive = $this->readBundleJson($archive, $payload);
            //if ($archive) {
            $response = $filterHelper->fire(
                'vcv:hub:download:bundle:' . $payload['action'],
                ['status' => $archive !== false],
                ['archive' => $archive]
            );
            //}
            $hubHelper->removeTempBundleFolder();
        }

        return $response;
    }

    protected function readBundleJson($archive, $payload)
    {
        $result = false;
        if (!is_wp_error($archive)) {
            $hubHelper = vchelper($this->helperName);
            $result = $hubHelper->unzipDownloadedBundle($archive);
            if (isset($payload['checksum']) && !empty($payload['checksum'])) {
                $mdOriginalFile = md5_file($archive);
                if ($mdOriginalFile !== $payload['checksum']) {
                    return false;
                }
            }
            // If zip is less than 1kb something wrong
            if (filesize($archive) < 1024) {
                return false;
            }
            if (!is_wp_error($result)) {
                return $hubHelper->readBundleJson($hubHelper->getTempBundleFolder('bundle.json'));
            }
        }

        return $result;
    }
}
