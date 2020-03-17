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
use VisualComposer\Helpers\Traits\EventsFilters;

class DownloadController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        if (vcvenv('VCV_ENV_EXTENSION_DOWNLOAD')) {
            $this->addFilter('vcv:hub:process:action:element/*', 'processAction');
            $this->addFilter('vcv:hub:process:action:addon/*', 'processAction');
            $this->addFilter('vcv:hub:process:action:asset/*', 'processAction');

            // templates
            $this->addFilter('vcv:hub:process:action:predefinedTemplate/*', 'processAction');
            $this->addFilter('vcv:hub:process:action:template/*', 'processAction');
        }
    }

    protected function processAction($response, $payload, Filters $filterHelper)
    {
        if (!vcIsBadResponse($response) && $payload['data']) {
            $hubHelper = vchelper('HubActionsActionBundle');
            /** @var $hubHelper \VisualComposer\Helpers\Hub\Bundle */
            $hubHelper->setTempBundleFolder(
                VCV_PLUGIN_ASSETS_DIR_PATH . '/temp-bundle-' . str_replace('/', '-', $payload['action'])
            );
            $hubHelper->removeTempBundleFolder();
            $archive = $hubHelper->requestBundleDownload($payload['data']['url']);
            if (!vcIsBadResponse($archive)) {
                $archive = $this->readBundleJson($archive, $payload);
                $response['status'] = $archive !== false;
                if ($archive) {
                    $response = $filterHelper->fire(
                        'vcv:hub:download:bundle:' . $payload['action'],
                        $response,
                        ['archive' => $archive, 'actionData' => $payload],
                        true
                    );
                }
            } else {
                return false;
            }
            $removeResult = $hubHelper->removeTempBundleFolder();
            if (vcIsBadResponse($removeResult)) {
                return false;
            }
        }

        return $response;
    }

    protected function readBundleJson($archive, $payload)
    {
        $hubHelper = vchelper('HubActionsActionBundle');
        $loggerHelper = vchelper('Logger');

        /** @var \VisualComposer\Helpers\Hub\Bundle $hubHelper */
        $result = $hubHelper->unzipDownloadedBundle($archive);
        if (vcIsBadResponse($result)) {
            return false;
        }

        if (isset($payload['checksum']) && !empty($payload['checksum'])) {
            $mdOriginalFile = md5_file($archive);
            if ($mdOriginalFile !== $payload['checksum']) {
                $loggerHelper->log(
                    sprintf(
                        __(
                            'A zip file of Visual Composer extension is broken. Checksum check failed. Please check your Internet connection, run Reset in Visual Composer Settings and try again.

If the problem still occurs, visit %ssupport.visualcomposer.io%s for technical assistance.
',
                            'visualcomposer'
                        ),
                        '<a href="https://support.visualcomposer.io/" target="_blank">',
                        '</a>'
                    )
                );

                return false;
            }
        }

        return $hubHelper->readBundleJson($hubHelper->getTempBundleFolder('bundle.json'));
    }
}
