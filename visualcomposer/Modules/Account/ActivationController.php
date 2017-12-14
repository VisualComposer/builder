<?php

namespace VisualComposer\Modules\Account;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\Filters;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Logger;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class ActivationController
 * @package VisualComposer\Modules\Account
 */
class ActivationController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    /**
     * ActivationController constructor.
     */
    public function __construct()
    {
        if (vcvenv('VCV_ENV_ADDONS_ID') === 'account') {
            /** @see \VisualComposer\Modules\Account\ActivationController::requestActivation */
            $this->addFilter('vcv:ajax:account:activation:adminNonce', 'requestActivation');
        }
        /** @see \VisualComposer\Modules\Account\ActivationController::checkActivationError */
        $this->addFilter(
            'vcv:ajax:account:activation:adminNonce vcv:hub:download:bundle:*',
            'checkActivationError',
            100
        );
        $this->addFilter('vcv:ajax:account:activation:finished:adminNonce', 'finishActivation');
        $this->addEvent('vcv:system:factory:reset', 'unsetOptions');
    }

    /**
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Token $tokenHelper
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserHelper
     * @param \VisualComposer\Helpers\Filters $filterHelper
     * @param Logger $loggerHelper
     * @param \VisualComposer\Helpers\License $licenseHelper
     *
     * @return array|bool|\WP_Error
     */
    protected function requestActivation(
        $response,
        $payload,
        Request $requestHelper,
        Token $tokenHelper,
        Options $optionsHelper,
        CurrentUser $currentUserHelper,
        Filters $filterHelper,
        Logger $loggerHelper,
        License $licenseHelper
    ) {
        if ($currentUserHelper->wpAll('manage_options')->get()
            && !$tokenHelper->isSiteAuthorized()
            && !$optionsHelper->getTransient('vcv:activation:request')
            || ($tokenHelper->isSiteAuthorized() && $licenseHelper->isActivated()
                && !$optionsHelper->getTransient(
                    'vcv:activation:request'
                ))
        ) {
            $optionsHelper->setTransient('vcv:activation:request', $requestHelper->input('vcv-time'), 60);

            if ($licenseHelper->isActivated()) {
                $id = VCV_PLUGIN_URL . $licenseHelper->getKey();
            } else {
                $id = VCV_PLUGIN_URL . trim($requestHelper->input('vcv-email'));
            }
            $optionsHelper->set('hubTokenId', $id);
            $token = $tokenHelper->createToken($id);
            if (!vcIsBadResponse($token)) {
                return $filterHelper->fire('vcv:activation:token:success', ['status' => true], ['token' => $token]);
            } else {
                $messages = [];
                $messages[] = __('Failed to get activation token #10013', 'vcwb');
                if (is_wp_error($token)) {
                    /** @var \WP_Error $token */
                    $messages[] = implode('. ', $token->get_error_messages()) . ' #10014';
                } elseif (is_array($token) && isset($token['body'])) {
                    // @codingStandardsIgnoreLine
                    $resultDetails = @json_decode($token['body'], 1);
                    if (is_array($resultDetails) && isset($resultDetails['message'])) {
                        $messages[] = $resultDetails['message'] . ' #10015';
                    }
                }
                $loggerHelper->log(
                    implode('. ', $messages)
                );
            }
        }

        if (!isset($token) && $optionsHelper->getTransient('vcv:activation:request')) {
            $expirationTime = get_option('_transient_timeout_vcv-' . VCV_VERSION . 'vcv:activation:request');
            $expiresAfter = $expirationTime - time();
            $expiresAfter = $expiresAfter < 0 ? 60 : $expiresAfter;
            $loggerHelper->log(
                sprintf(__('Activation failed. Please wait %1$s seconds before you try again #10016', 'vcwb'), $expiresAfter),
                [
                    'getTransient' => $optionsHelper->getTransient('vcv:activation:request'),
                    'expiresAfter' => $expiresAfter,
                ]
            );
        }

        if ($tokenHelper->isSiteAuthorized()) {
            return ['status' => true, 'skipped' => true, 'actions' => []];
        }

        return ['status' => false];
    }

    /**
     * @param $response
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\Token $tokenHelper
     * @param \VisualComposer\Helpers\License $licenseHelper
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Logger $loggerHelper
     *
     * @return array
     */
    protected function finishActivation(
        $response,
        Options $optionsHelper,
        Token $tokenHelper,
        License $licenseHelper,
        Request $requestHelper,
        Logger $loggerHelper
    ) {
        $currentTransient = $optionsHelper->getTransient('vcv:activation:request');
        if ($currentTransient) {
            if ($currentTransient !== $requestHelper->input('vcv-time')) {
                return ['status' => false];
            } else {
                $optionsHelper->deleteTransient('vcv:activation:request');
                $loggerHelper->removeLogNotice('activation:failed');
            }
        }
        $tokenHelper->setSiteAuthorized();
        $licenseHelper->setKeyToken('');
        vcevent('vcv:activation:finish');

        return [
            'status' => true,
        ];
    }

    protected function checkActivationError($response, Options $optionsHelper, Request $requestHelper)
    {
        $currentTransient = $optionsHelper->getTransient('vcv:activation:request');
        if ($currentTransient && $requestHelper->input('vcv-time')) {
            if ($currentTransient !== $requestHelper->input('vcv-time')) {
                return false;
            } else {
                $optionsHelper->deleteTransient('vcv:activation:request');
            }
        }

        return $response;
    }

    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper
            ->deleteTransient('_vcv_activation_page_redirect')
            ->deleteTransient('vcv:activation:request')
            ->deleteTransient('vcv:activation:subscribe')
            ->delete('activation-email')
            ->delete('activation-agreement');
    }
}
