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
        $this->addFilter('vcv:hub:process:json:' . $this->actionName, 'processAction');
    }

    protected function processAction($status, $payload, Filters $filterHelper)
    {
        if ($status && $payload['data']) {
            $hubHelper = vchelper($this->helperName);
            /** @var $hubHelper \VisualComposer\Helpers\Hub\Bundle */
            $hubHelper->removeTempBundleFolder();
            $archive = $hubHelper->requestBundleDownload($payload['data'], $payload['action']);
            $archive = $this->readBundleJson($archive);
            //if ($archive) {
            $status = $filterHelper->fire(
                'vcv:hub:download:bundle:' . $payload['action'],
                true,
                ['archive' => $archive]
            );
            //}
            $hubHelper->removeTempBundleFolder();
        }

        return $status;
    }

    protected function readBundleJson($archive)
    {
        $result = false;
        if (!is_wp_error($archive)) {
            $hubHelper = vchelper($this->helperName);
            $result = $hubHelper->unzipDownloadedBundle($archive);
            if (!is_wp_error($result)) {
                return $hubHelper->readBundleJson($hubHelper->getTempBundleFolder('bundle.json'));
            }
        }

        return $result;
    }
}
