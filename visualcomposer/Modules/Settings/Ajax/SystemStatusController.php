<?php

namespace VisualComposer\Modules\Settings\Ajax;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
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
        /** @see \VisualComposer\Modules\Settings\Ajax\SystemStatusController::checkContentZipType */
        $this->addFilter(
            'vcv:ajax:settings:systemStatus:checkContentZipType:adminNonce',
            'checkContentZipType'
        );
        $this->addFilter('vcv:editor:variables vcv:wp:dashboard:variables', 'addVariables');
    }

    /**
     * This check can only be triggered from frontend.
     * As the idea is to pass A LOT OF DATA, and let server handle it.
     *
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @return mixed
     */
    protected function checkPayloadProcessing(Request $requestHelper)
    {
        $checkPayload = $requestHelper->input('vcv-check-payload');

        $response = [];

        if (isset($checkPayload['toTest']['toTest2']['toTest3'])) {
            $response['status'] = $checkPayload['toTest']['toTest2']['toTest3'] == 1;
        }

        return $response;
    }

    /**
     * Set option that determine data we use for our ajax requests.
     * By default, we use base64 but in cases when server support it we use just binary data.
     *
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @return mixed
     */
    protected function checkContentZipType(Request $requestHelper, Options $optionsHelper)
    {
        $check = $requestHelper->input('vcv-check-content-zip-type');

        if ($check) {
            $optionsHelper->set('content:zip:type', 'binary');
        }

        return false;
    }

    /**
     * Add frontend variables.
     *
     * @param array $variables
     *
     * @return array
     */
    protected function addVariables($variables, Options $optionsHelper)
    {
        $isBinary = false;
        if ($optionsHelper->get('content:zip:type', false)) {
            $isBinary = true;
        }

        // is user enable toggle manually we should not use binary saving anymore
        if ($optionsHelper->get('settings-alternative-saving-enabled') === 'itemAlternativeSavingDisabled') {
            $isBinary = false;
        } else {
            // if checking pass then we should disable base64 encoding for a user
            if ($isBinary) {
                $optionsHelper->set('settings-alternative-saving-enabled', false);
            }
        }
        $variables[] = [
            'key' => 'VCV_IS_BINARY_CONTENT',
            'value' => $isBinary,
            'type' => 'constant',
        ];

        return $variables;
    }
}
