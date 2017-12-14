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
use VisualComposer\Helpers\Logger;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class ActivationController
 * @package VisualComposer\Modules\Account
 */
class AddonsActivationController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    /** @noinspection PhpMissingParentConstructorInspection */

    /**
     * ActivationController constructor.
     */
    public function __construct()
    {
        if (vcvenv('VCV_ENV_ADDONS_ID') !== 'account') {
            /** @see \VisualComposer\Modules\Account\AddonsActivationController::requestAddonsActivation */
            $this->addFilter('vcv:ajax:account:activation:adminNonce', 'requestAddonsActivation');
        }
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
     *
     * @return array|bool|\WP_Error
     */
    protected function requestAddonsActivation(
        $response,
        $payload,
        Request $requestHelper,
        Token $tokenHelper,
        Options $optionsHelper,
        CurrentUser $currentUserHelper,
        Filters $filterHelper,
        Logger $loggerHelper
    ) {
        if ($currentUserHelper->wpAll('manage_options')->get()
            && !$tokenHelper->isSiteAuthorized()
            && !$optionsHelper->getTransient('vcv:activation:request')
        ) {
            $optionsHelper->setTransient('vcv:activation:request', $requestHelper->input('vcv-time'), 60);
            $token = $tokenHelper->createToken(vcvenv('ENV_VCV_SITE_ID', ''));
            if ($token) {
                return $filterHelper->fire('vcv:activation:token:success', ['status' => true], ['token' => $token]);
            }
        }

        if (!isset($token) && $optionsHelper->getTransient('vcv:activation:request')) {
            $expirationTime = get_option('_transient_timeout_vcv-' . VCV_VERSION . 'vcv:activation:request');
            $expiresAfter = $expirationTime - time();
            $expiresAfter = $expiresAfter < 0 ? 60 : $expiresAfter;
            $loggerHelper->log(
                sprintf(__('Activation failed. Please wait %1$s seconds before you try again #10017', 'vcwb'), $expiresAfter),
                [
                    'getTransient' => $optionsHelper->getTransient('vcv:activation:request'),
                    'expiresAfter' => $expiresAfter,
                ]
            );
        }

        if ($tokenHelper->isSiteAuthorized()) {
            return ['status' => true, 'skipped' => true];
        }

        return ['status' => false];
    }
}
