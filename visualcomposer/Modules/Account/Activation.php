<?php

namespace VisualComposer\Modules\Account;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class Pages
 * @package VisualComposer\Modules\Account
 */
class Activation extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    /**
     * Pages constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Account\Activation::setRedirect */
        $this->addEvent('vcv:system:activation:hook', 'setRedirect');
        /** @see \VisualComposer\Modules\Account\Activation::doRedirect */
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
     */
    private function doRedirect()
    {
        $redirect = get_transient('_vcv_activation_page_redirect');
        delete_transient('_vcv_activation_page_redirect');
        if ($redirect) {
            wp_redirect(admin_url('admin.php?page=' . rawurlencode('vcv-activation')));
        }
    }
}