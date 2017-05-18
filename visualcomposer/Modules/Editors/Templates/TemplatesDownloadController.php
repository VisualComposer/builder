<?php

namespace VisualComposer\Modules\Editors\Templates;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Differ;
use VisualComposer\Helpers\Hub;
use VisualComposer\Helpers\HubTemplates;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class TemplatesDownloadController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    public function __construct(Hub $hubHelper)
    {
        if (vcvenv('VCV_TEMPLATES_DOWNLOAD')) {
            $this->addFilter(
                'vcv:ajax:account:activation:adminNonce',
                'downloadTemplatesOnActivation',
                60
            );
        }
    }

    protected function downloadTemplatesOnActivation($response, $payload)
    {
        if ($response) {
            $this->call('prepareBundleDownload');
        }

        return $response;
    }

    protected function prepareBundleDownload(HubTemplates $hubHelper)
    {
        $hubHelper->removeBundleFolder();
        $archive = $hubHelper->requestBundleDownload();

        if (!is_wp_error($archive)) {
            $archive = $this->readBundleJson($archive);
            if (!is_wp_error($archive)) {
                $this->processBundleJson($archive);
            }
        }
        // clean-up
        $hubHelper->removeBundleFolder();

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

    protected function processBundleJson($bundleJson)
    {
        // TODO: Make the parsing process
    }
}
