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
use VisualComposer\Modules\Account\Pages\ActivationPage;

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
        if (vcvenv('VCV_ENV_ADDONS_ID') !== 'account') {
            vcapp('\VisualComposer\Modules\Account\AddonsActivationController');
        } else {
            $this->boot();
            /** @see \VisualComposer\Modules\Account\ActivationController::subscribeLiteVersion */
            $this->addFilter('vcv:activation:token:success', 'subscribeLiteVersion');
        }
    }

    protected function boot()
    {
        /** @see \VisualComposer\Modules\Account\ActivationController::setRedirect */
        $this->addEvent('vcv:system:activation:hook', 'setRedirect');
        /** @see \VisualComposer\Modules\Account\ActivationController::doRedirect */
        $this->wpAddAction('admin_init', 'doRedirect');

        $this->addFilter(
            'vcv:editors:backend:addMetabox vcv:editors:frontend:render',
            'setRedirectNotActivated',
            100
        );
        $this->addFilter('vcv:editors:backend:addMetabox vcv:editors:frontend:render', 'doRedirect', 110);

        /** @see \VisualComposer\Modules\Account\ActivationController::requestActivation */
        $this->addFilter('vcv:ajax:account:activation:adminNonce', 'requestActivation');
        /** @see \VisualComposer\Modules\Account\ActivationController::checkActivationError */
        $this->addFilter('vcv:ajax:account:activation:adminNonce vcv:hub:download:bundle:*', 'checkActivationError', 100);
        $this->addFilter('vcv:ajax:account:activation:finished:adminNonce', 'finishActivation');
        $this->addEvent('vcv:system:factory:reset', 'unsetOptions');
    }

    /**
     * Set redirect transition on update or activation
     *
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Options $optionsHelper
     */
    protected function setRedirect(Request $requestHelper, Options $optionsHelper)
    {
        if (!is_network_admin() && !$requestHelper->exists('activate-multi')) {
            $optionsHelper->setTransient('_vcv_activation_page_redirect', 1, 30);
        }
    }

    /**
     * Do redirect if required on welcome page
     *
     * @param $response
     * @param \VisualComposer\Modules\Account\Pages\ActivationPage $activationWelcomePageModule
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return
     */
    protected function doRedirect($response, ActivationPage $activationWelcomePageModule, Options $optionsHelper)
    {
        $redirect = $optionsHelper->getTransient('_vcv_activation_page_redirect');
        $optionsHelper->deleteTransient('_vcv_activation_page_redirect');
        if ($redirect) {
            wp_redirect(admin_url('admin.php?page=' . rawurlencode($activationWelcomePageModule->getSlug())));
        }

        return $response;
    }

    /**
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Token $tokenHelper
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return mixed
     */
    protected function setRedirectNotActivated($response, $payload, Token $tokenHelper, Options $optionsHelper)
    {
        if (!$tokenHelper->isSiteAuthorized()) {
            $optionsHelper->setTransient('_vcv_activation_page_redirect', 1, 30);
        }

        return $response;
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
            || ($tokenHelper->isSiteAuthorized() && $licenseHelper->isActivated() && !$optionsHelper->getTransient('vcv:activation:request'))
        ) {
            $optionsHelper->setTransient('vcv:activation:request', $requestHelper->input('time'), 60);

            if ($licenseHelper->isActivated()) {
                $id = VCV_PLUGIN_URL . $licenseHelper->getKey();
            } else {
                $id = VCV_PLUGIN_URL . trim($requestHelper->input('email'));
            }
            $optionsHelper->set('hubTokenId', $id);
            $token = $tokenHelper->createToken($id);
            if ($token) {
                return $filterHelper->fire('vcv:activation:token:success', ['status' => true], ['token' => $token]);
            } else {
                $loggerHelper->log(
                    __('Failed to get activation token', 'vcwb')
                );
            }
        }

        if (!isset($token) && $optionsHelper->getTransient('vcv:activation:request')) {
            $expirationTime = get_option('_transient_timeout_vcv-' . VCV_VERSION . 'vcv:activation:request');
            $expiresAfter = $expirationTime - time();
            $expiresAfter = $expiresAfter < 0 ? 60 : $expiresAfter;
            $loggerHelper->log(
                sprintf(__('Activation failed! Please wait %1$s seconds before you try again', 'vcwb'), $expiresAfter),
                [
                    'getTransient' => $optionsHelper->getTransient('vcv:activation:request'),
                    'expiresAfter' => $expiresAfter,
                ]
            );
        }

        if ($tokenHelper->isSiteAuthorized()) {
            return ['status' => true];
        }

        return false;
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

    /**
     * @param $response
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\Token $tokenHelper
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @return mixed
     */
    protected function finishActivation(
        $response,
        Options $optionsHelper,
        Token $tokenHelper,
        License $licenseHelper,
        Request $requestHelper
    ) {
        $currentTransient = $optionsHelper->getTransient('vcv:activation:request');
        if ($currentTransient) {
            if ($currentTransient !== $requestHelper->input('time')) {
                return ['status' => false];
            } else {
                $optionsHelper->deleteTransient('vcv:activation:request');
            }
        }
        $tokenHelper->setSiteAuthorized();
        $licenseHelper->setKeyToken('');

        return [
            'status' => true,
        ];
    }

    protected function checkActivationError($response, Options $optionsHelper, Request $requestHelper)
    {
        $currentTransient = $optionsHelper->getTransient('vcv:activation:request');
        if ($currentTransient && $requestHelper->input('time')) {
            if ($currentTransient !== $requestHelper->input('time')) {
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
