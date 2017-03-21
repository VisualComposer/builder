<?php

namespace VisualComposer\Modules\Account;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Account\Pages\ActivationWelcomePage;

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
    }

    /**
     * Set redirect transition on update or activation
     *
     * @param \VisualComposer\Helpers\Request $requestHelper
     */
    private function setRedirect(Request $requestHelper)
    {
        if (!is_network_admin() && !$requestHelper->exists('activate-multi')) {
            set_transient('_vcv_activation_page_redirect', 1, 30);
        }
    }

    /**
     * Do redirect if required on welcome page
     *
     * @param \VisualComposer\Modules\Account\Pages\ActivationWelcomePage $activationWelcomePageModule
     */
    private function doRedirect(ActivationWelcomePage $activationWelcomePageModule)
    {
        $redirect = get_transient('_vcv_activation_page_redirect');
        delete_transient('_vcv_activation_page_redirect');
        if ($redirect) {
            wp_redirect(admin_url('admin.php?page=' . rawurlencode($activationWelcomePageModule->getSlug())));
        }
    }
}
