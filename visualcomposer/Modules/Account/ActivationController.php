<?php

namespace VisualComposer\Modules\Account;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Account\Pages\ActivationPage;

class ActivationController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Account\ActivationController::setRedirect */
        $this->addEvent('vcv:system:activation:hook', 'setRedirect');
        /** @see \VisualComposer\Modules\Account\ActivationController::doRedirect */
        $this->wpAddAction('admin_init', 'doRedirect');

        $this->addFilter('vcv:editors:backend:addMetabox vcv:editors:frontend:render', 'setRedirectDeactivated', 100);
        $this->addFilter('vcv:editors:backend:addMetabox vcv:editors:frontend:render', 'doRedirect', 110);
        /** @see \VisualComposer\Modules\Account\ActivationController::requestActivation */
        $this->addFilter('vcv:ajax:account:activation:adminNonce', 'requestActivation');
        $this->addFilter('vcv:ajax:account:activation:adminNonce', 'requestActivationResponseCode', 100);
    }

    /**
     * Set redirect transition on update or activation
     *
     * @param \VisualComposer\Helpers\Request $requestHelper
     */
    protected function setRedirect(Request $requestHelper)
    {
        if (!is_network_admin() && !$requestHelper->exists('activate-multi')) {
            set_transient('_vcv_activation_page_redirect', 1, 30);
        }
    }

    /**
     * Do redirect if required on welcome page
     *
     * @param $response
     * @param \VisualComposer\Modules\Account\Pages\ActivationPage $activationWelcomePageModule
     *
     * @return
     */
    protected function doRedirect($response, ActivationPage $activationWelcomePageModule)
    {
        $redirect = get_transient('_vcv_activation_page_redirect');
        delete_transient('_vcv_activation_page_redirect');
        if ($redirect) {
            wp_redirect(admin_url('admin.php?page=' . rawurlencode($activationWelcomePageModule->getSlug())));
        }

        return $response;
    }

    protected function setRedirectDeactivated($response, $payload, Token $tokenHelper)
    {
        if (!$tokenHelper->isSiteAuthorized()) {
            set_transient('_vcv_activation_page_redirect', 1, 30);
        }

        return $response;
    }

    protected function requestActivation(
        $response,
        $payload,
        Request $requestHelper,
        Token $tokenHelper
    ) {
        // This is a place where we need to make registration/activation request in account
        $result = wp_remote_post(
            VCV_ACCOUNT_URL . '/register-account',
            [
                'body' => [
                    'url' => VCV_PLUGIN_URL,
                    'email' => $requestHelper->input('email'),
                ],
            ]
        );
        if (is_array($result) && 200 === $result['response']['code']) {
            $tokenHelper->setSiteAuthorized();

            return true;
        }

        return false;
    }

    protected function requestActivationResponseCode($response)
    {
        if (!$response) {
            header('Status: 403', true, 403);
            header('HTTP/1.0 403 Forbidden', true, 403);
            exit;
        }

        return $response;
    }
}
