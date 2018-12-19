<?php

namespace VisualComposer\Modules\Settings\Ajax;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Hub\Update;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Status;
use VisualComposer\Helpers\Traits\EventsFilters;

class SystemStatusController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Settings\Ajax\SystemStatusController::checkVersion */
        $this->addFilter(
            'vcv:ajax:checkVersion:adminNonce',
            'checkVersion'
        );

        /** @see \VisualComposer\Modules\Settings\Ajax\SystemStatusController::runAllChecks */
        $this->addFilter(
            'vcv:ajax:checkSystem:adminNonce',
            'checkSystem'
        );

        /** @see \VisualComposer\Modules\Settings\Ajax\SystemStatusController::runAllChecks */
        $this->addFilter(
            'vcv:ajax:checkPayloadProcessing:adminNonce',
            'checkPayloadProcessing'
        );
    }

    /**
     * @param $response
     * @param \VisualComposer\Helpers\Hub\Update $hubUpdateHelper
     *
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return mixed
     * @throws \ReflectionException
     */
    protected function checkVersion($response, Update $hubUpdateHelper, Options $optionsHelper)
    {
        if (!is_array($response)) {
            $response = [];
        }
        $checkVersion = $hubUpdateHelper->checkVersion();
        $response['status'] = $checkVersion['status'];

        if ($response['status'] === true) {
            $optionsHelper->setTransient('lastBundleUpdate', 1);
        }

        return $response;
    }

    /**
     * @param $response
     * @param \VisualComposer\Helpers\Status $statusHelper
     *
     * @return mixed
     */
    protected function checkSystem($response, Status $statusHelper)
    {
        $statusHelper->checkSystemStatusAndSetFlag();

        return $response;
    }

    /**
     * This check can only be triggered from frontend, as the idea is to pass A LOT OF DATA, and let server handle it
     *
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @return mixed
     */
    protected function checkPayloadProcessing($response, $payload, Request $requestHelper)
    {
        if (!is_array($response)) {
            $response = [
                'status' => false,
            ];
        }
        $checkPayload = $requestHelper->input('vcv-check-payload');
        if (is_array($checkPayload)
            && isset($checkPayload['toTest'], $checkPayload['toTest']['toTest2'], $checkPayload['toTest']['toTest2']['toTest3'])) {
            $response['status'] = $checkPayload['toTest']['toTest2']['toTest3'] === 1;
        }

        return $response;
    }
}
