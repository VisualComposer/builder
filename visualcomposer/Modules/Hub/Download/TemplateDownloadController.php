<?php

namespace VisualComposer\Modules\Hub\Download;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;

class TemplateDownloadController extends ElementDownloadController implements Module
{
    use EventsFilters;

    public function __construct()
    {
        if (vcvenv('VCV_HUB_DOWNLOAD_SINGLE_TEMPLATE')) {
            $this->addFilter('vcv:ajax:hub:download:template:adminNonce', 'ajaxDownloadElement');
        }
    }

    protected function sendRequestJson($bundle, $token)
    {
        $hubBundleHelper = vchelper('HubBundle');
        // $bundle is the template ID
        $url = $hubBundleHelper->getTemplateDownloadUrl(['token' => $token, 'bundle' => $bundle]);
        $response = wp_remote_get(
            $url,
            [
                'timeout' => 30,
            ]
        );
        $result = $this->checkResponse($response);

        return $result;
    }
}
