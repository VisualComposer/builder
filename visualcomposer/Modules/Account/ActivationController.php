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
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Token;
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
        if (VCV_ENV_ADDONS_ID !== 'account') {
            vcapp('\VisualComposer\Modules\Account\AddonsActivationController');
        } else {
            $this->boot();
            /** @see \VisualComposer\Modules\Account\ActivationController::subscribeLiteVersion */
            $this->addFilter('vcv:activation:success', 'subscribeLiteVersion');
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
        $this->addFilter('vcv:ajax:account:activation:adminNonce', 'requestActivationResponseCode', 100);

        if (vcvenv('VCV_ENV_ELEMENT_DOWNLOAD')
            && !vchelper('Options')
                ->get(
                    'resetAppliedV' . vcvenv('VCV_ENV_ELEMENT_DOWNLOAD_V')
                )
        ) {
            vchelper('Options')
                ->delete('hubElements')
                ->delete('hubCategories')
                ->delete('hubGroups')
                ->set('resetAppliedV' . vcvenv('VCV_ENV_ELEMENT_DOWNLOAD_V'), 1);
        }
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
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserHelper
     * @param \VisualComposer\Helpers\Filters $filterHelper
     *
     * @return array|bool|\WP_Error
     */
    protected function requestActivation(
        $response,
        $payload,
        Request $requestHelper,
        Token $tokenHelper,
        CurrentUser $currentUserHelper,
        Filters $filterHelper
    ) {
        if ($currentUserHelper->wpAll('manage_options')->get()
            && !$tokenHelper->isSiteAuthorized()
        ) {
            $token = $tokenHelper->createToken(VCV_PLUGIN_URL . trim($requestHelper->input('email')));
            if ($token) {
                return $filterHelper->fire('vcv:activation:success', true, ['token' => $token]);
            }
        }

        return false;
    }

    protected function subscribeLiteVersion($status, $payload, Request $requestHelper)
    {
        if ($status) {
            // This is a place where we need to make registration/activation request in account
            $result = wp_remote_get(
                VCV_ACCOUNT_URL . '/subscribe-lite-version',
                [
                    'body' => [
                        'url' => VCV_PLUGIN_URL,
                        'email' => trim($requestHelper->input('email')),
                        'agreement' => $requestHelper->input('agreement'),
                    ],
                ]
            );
            if (wp_remote_retrieve_response_code($result) === 200) {
                return true;
            } elseif (is_array($result)) {
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
    protected function requestActivationResponseCode(
        $response,
        Options $optionsHelper,
        Token $tokenHelper,
        Request $requestHelper
    ) {
        if (is_wp_error($response) || $response !== true) {
            header('Status: 403', true, 403);
            header('HTTP/1.0 403 Forbidden', true, 403);

            if (is_wp_error($response)) {
                /** @var $response \WP_Error */
                echo json_encode(['message' => implode('. ', $response->get_error_messages())]);
            } elseif (is_array($response)) {
                echo json_encode(['message' => $response['body']]);
            } else {
                echo json_encode(['status' => false]);
            }
            exit;
        } else {
            $optionsHelper->set('activation-email', $requestHelper->input('email'));
            $optionsHelper->set('activation-agreement', $requestHelper->input('agreement'));
            $tokenHelper->setSiteAuthorized();
        }

        return $response;
    }
}
