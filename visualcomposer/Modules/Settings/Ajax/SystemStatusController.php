<?php

namespace VisualComposer\Modules\Settings\Ajax;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class SystemStatusController
 * @package VisualComposer\Modules\Settings\Ajax
 */
class SystemStatusController extends Container implements Module
{
    use EventsFilters;

    /**
     * SystemStatusController constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Settings\Ajax\SystemStatusController::checkPayloadProcessing */
        $this->addFilter(
            'vcv:ajax:settings:systemStatus:checkPayloadProcessing:adminNonce',
            'checkPayloadProcessing'
        );
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
        if (
            is_array($checkPayload)
            && isset($checkPayload['toTest']['toTest2']['toTest3'])
        ) {
            $response['status'] = $checkPayload['toTest']['toTest2']['toTest3'] === 1;
        }

        return $response;
    }
}
