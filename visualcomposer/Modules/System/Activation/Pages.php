<?php

namespace VisualComposer\Modules\System\Activation;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class Pages
 * @package VisualComposer\Modules\System\Activation
 */
class Pages extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    /**
     * Pages constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\System\Activation\Pages::setRedirect */
        $this->addEvent('vcv:system:activation:hook', 'setRedirect');
        /** @see \VisualComposer\Modules\System\Activation\Pages::doRedirect */
        $this->wpAddAction('admin_init', 'doRedirect');
    }

    /**
     * Set redirect transition on update or activation
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
            // wp_redirect(admin_url('admin.php?page=' . rawurlencode('test!')));
        }
    }
}