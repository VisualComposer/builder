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
            $this->addFilter('vcv:activation:token:success', 'subscribeLiteVersion');
        }
    }

    protected function subscribeLiteVersion($response, $payload, Request $requestHelper, Logger $loggerHelper, Options $optionsHelper, License $licenseHelper)
    {
        if (!vcIsBadResponse($response)) {
            if ($optionsHelper->getTransient('vcv:activation:subscribe') || $licenseHelper->isActivated()) {
                return $response;
            }
            // This is a place where we need to make registration/activation request in account
            $id = VCV_PLUGIN_URL . trim($requestHelper->input('email'));
            $result = wp_remote_get(
                VCV_ACCOUNT_URL . '/subscribe-lite-version',
                [
                    'timeout' => 10,
                    'body' => [
                        'url' => VCV_PLUGIN_URL,
                        'email' => trim($requestHelper->input('email')),
                        'category' => trim($requestHelper->input('category')),
                        'agreement' => $requestHelper->input('agreement'),
                        'id' => $id,
                    ],
                ]
            );
            if (!vcIsBadResponse($result)) {
                // Register in options subscribe request time for future request.
                $optionsHelper->setTransient('vcv:activation:subscribe', 1, 600);
                $optionsHelper->set('activation-email', $requestHelper->input('email'));
                $optionsHelper->set('activation-agreement', $requestHelper->input('agreement'));
                $optionsHelper->set('activation-category', $requestHelper->input('category'));

                return $response;
            } else {
                $loggerHelper->log(
                    __('Failed to subscribe to the lite version', 'vcwb'),
                    [
                        'response' => is_wp_error($result) ? $result->get_error_message()
                            : (is_array($result) ? $result['body'] : ''),
                    ]
                );
                $result['status'] = false;
                return $result;
            }
        }

        return false;
    }
}
