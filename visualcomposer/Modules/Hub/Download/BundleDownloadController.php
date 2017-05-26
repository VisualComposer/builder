<?php

namespace VisualComposer\Modules\Hub\Download;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Hub\Bundle;
use VisualComposer\Helpers\Traits\EventsFilters;

class BundleDownloadController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        if (vcvenv('VCV_HUB_DOWNLOAD')) {
            $this->addEvent(
                'vcv:activation:success',
                'prepareBundleDownload',
                50
            );
        }
    }

    protected function prepareBundleDownload(Bundle $hubHelper)
    {
        $hubHelper->removeTempBundleFolder();
        $archive = $hubHelper->requestBundleDownload();

        if (!is_wp_error($archive)) {
            $archive = $this->readBundleJson($archive);
            if (!is_wp_error($archive)) {
                vcevent('vcv:hub:download:bundle', [$archive]);
            }
        }
        // clean-up
        $hubHelper->removeTempBundleFolder();

        return $archive;
    }

    protected function readBundleJson($archive)
    {
        $hubHelper = vchelper('HubBundle');
        $result = $hubHelper->unzipDownloadedBundle($archive);
        if (!is_wp_error($result)) {
            return $hubHelper->readBundleJson($hubHelper->getTempBundleFolder('bundle.json'));
        }

        return $result;
    }
}
