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
            $response['data'] = $this->generateRandomString(5000000);
        }

        return $response;
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
        $isBinary = true;

        // is user enable toggle manually we should not use binary saving anymore
        if ($optionsHelper->get('settings-alternative-saving-enabled') === 'itemAlternativeSavingDisabled') {
            $isBinary = false;
        }

        $variables[] = [
            'key' => 'VCV_IS_BINARY_CONTENT',
            'value' => $isBinary,
            'type' => 'constant',
        ];

        $variables[] = [
            'key' => 'VCV_JS_SAVE_ZIP',
            'value' => \VcvEnv::get('VCV_JS_SAVE_ZIP', true),
            'type' => 'constant',
        ];

        return $variables;
    }

    /**
     * Generate random string.
     *
     * @param int $length
     *
     * @return string
     */
    protected function generateRandomString($length)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[random_int(0, $charactersLength - 1)];
        }

        return $randomString;
    }
}
