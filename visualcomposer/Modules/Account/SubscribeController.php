<?php

namespace VisualComposer\Modules\Account;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Logger;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;

class SubscribeController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        if (vcvenv('VCV_ENV_ADDONS_ID') === 'account') {
            /** @see \VisualComposer\Modules\Account\SubscribeController::subscribeLiteVersion */
            $this->addEvent('vcv:activation:finish', 'subscribeLiteVersion');
        }
    }

    protected function subscribeLiteVersion(
        $payload,
        Request $requestHelper,
        Logger $loggerHelper,
        Options $optionsHelper,
        License $licenseHelper
    ) {
        if ($optionsHelper->getTransient('vcv:activation:subscribe') || $licenseHelper->isActivated()) {
            return false;
        }
        // This is a place where we need to make registration/activation request in account
        $id = VCV_PLUGIN_URL . trim($requestHelper->input('vcv-email'));
        $result = wp_remote_get(
            VCV_ACCOUNT_URL . '/subscribe-lite-version',
            [
                'timeout' => 30,
                'body' => [
                    'url' => VCV_PLUGIN_URL,
                    'email' => trim($requestHelper->input('vcv-email')),
                    'category' => trim($requestHelper->input('vcv-category')),
                    'agreement' => $requestHelper->input('vcv-agreement'),
                    'id' => $id,
                ],
            ]
        );
        if (!vcIsBadResponse($result)) {
            // Register in options subscribe request time for future request.
            $optionsHelper->setTransient('vcv:activation:subscribe', 1, 600);
            $optionsHelper->set('activation-email', $requestHelper->input('vcv-email'));
            $optionsHelper->set('activation-agreement', $requestHelper->input('vcv-agreement'));
            $optionsHelper->set('activation-category', $requestHelper->input('vcv-category'));

            return true;
        } else {
            $messages = [];
            $messages[] = __('Failed to activate free version', 'vcwb') . ' #10018';
            if (is_wp_error($result)) {
                $messages[] = implode('. ', $result->get_error_messages()) . ' #10019';
            } elseif (is_array($result) && isset($result['body'])) {
                // @codingStandardsIgnoreLine
                $resultDetails = @json_decode($result['body'], 1);
                if (is_array($resultDetails) && isset($resultDetails['message'])) {
                    $messages[] = $resultDetails['message'] . ' #10020';
                }
            }
            $loggerHelper->log(
                implode('. ', $messages),
                [
                    'response' => is_wp_error($result) ? $result->get_error_message()
                        : (is_array($result) && isset($result['body']) ? $result['body'] : ''),
                ]
            );

            return false;
        }
    }
}
