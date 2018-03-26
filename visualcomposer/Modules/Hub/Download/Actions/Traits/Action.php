<?php

namespace VisualComposer\Modules\Hub\Download\Actions\Traits;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Helpers\Filters;
use VisualComposer\Helpers\Logger;
use VisualComposer\Helpers\Traits\EventsFilters;

trait Action
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:hub:process:action:' . $this->actionName, 'processAction');
    }

    protected function processAction($response, $payload, Filters $filterHelper, Logger $loggerHelper)
    {
        if (!vcIsBadResponse($response) && $payload['data']) {
            $hubHelper = vchelper($this->helperName);
            /** @var $hubHelper \VisualComposer\Helpers\Hub\Bundle */
            $hubHelper->removeTempBundleFolder();
            $archive = $hubHelper->requestBundleDownload($payload['data'], $payload['action']);
            if (is_wp_error($archive)) {
                /** @var \WP_Error $archive */
                $loggerHelper->log(implode('. ', $archive->get_error_messages()) . ' #10061');
                $response['status'] = false;
            } else {
                $archive = $this->readBundleJson($archive, $payload);
                $response['status'] = $archive !== false;
                $response = $filterHelper->fire(
                    'vcv:hub:download:bundle:' . $payload['action'],
                    $response,
                    ['archive' => $archive, 'actionData' => $payload]
                );
            }
            $hubHelper->removeTempBundleFolder();
        }

        return $response;
    }

    protected function readBundleJson($archive, $payload)
    {
        $result = false;
        if (!is_wp_error($archive)) {
            $hubHelper = vchelper($this->helperName);
            $loggerHelper = vchelper('Logger');

            // If zip is less than 2kb something wrong (our smallest bundle is 7.9kb - separator)
            if (filesize($archive) < 2 * 1024) {
                $loggerHelper->log(
                    __('Bundle size is too small', 'vcwb') . ' #10062',
                    [
                        'fileSize' => filesize($archive),
                        'contents' => htmlentities(file_get_contents($archive)),
                    ]
                );

                return false;
            }
            $result = $hubHelper->unzipDownloadedBundle($archive);
            if (is_wp_error($result)) {
                /** @var \WP_Error $result */
                $loggerHelper->log(implode('. ', $result->get_error_messages()) . ' #10063');

                return false;
            }
            if (isset($payload['checksum']) && !empty($payload['checksum'])) {
                $mdOriginalFile = md5_file($archive);
                if ($mdOriginalFile !== $payload['checksum']) {
                    $loggerHelper->log(__('Bundle checksum doesn\'t match', 'vcwb') . ' #10064');

                    return false;
                }
            }

            return $hubHelper->readBundleJson($hubHelper->getTempBundleFolder('bundle.json'));
        }

        return $result;
    }
}
