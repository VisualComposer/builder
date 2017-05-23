<?php

namespace VisualComposer\Modules\Hub\Download;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Hub;
use VisualComposer\Helpers\Traits\EventsFilters;

class BundleDownloadController extends Container implements Module
{
    use EventsFilters;

    public function __construct(Hub $hubHelper)
    {
        if (vcvenv('VCV_HUB_DOWNLOAD')) {
            $this->addFilter(
                'vcv:ajax:account:activation:adminNonce',
                'downloadOnActivation',
                50
            );
        }
    }

    protected function downloadOnActivation($response, $payload)
    {
        if ($response) {
            /** @see \VisualComposer\Modules\Hub\Download\BundleDownloadController::prepareBundleDownload */
            $this->call('prepareBundleDownload');
        }

        return $response;
    }

    protected function prepareBundleDownload(Hub $hubHelper)
    {
        $hubHelper->removeTempBundleFolder();
        $archive = $hubHelper->requestBundleDownload();

        if (!is_wp_error($archive)) {
            $archive = $this->readBundleJson($archive);
            if (!is_wp_error($archive)) {
                vcevent('vcv:hub:download:bundle', $archive);
            }
        }
        // clean-up
        $hubHelper->removeTempBundleFolder();

        return $archive;
    }

    protected function readBundleJson($archive)
    {
        $hubHelper = vchelper('Hub');
        $result = $hubHelper->unzipDownloadedBundle($archive);
        if (!is_wp_error($result)) {
            return $hubHelper->readBundleJson($hubHelper->getBundleFolder('bundle.json'));
        }

        return $result;
    }
}
