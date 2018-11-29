<?php

namespace VisualComposer\Modules\License;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Status;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class ActivationRedirectController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\License\ActivationRedirectController::checkStatusAndSetRedirect */
        $this->addEvent('vcv:system:activation:hook', 'checkStatusAndSetRedirect');
        /** @see \VisualComposer\Modules\License\ActivationRedirectController::doRedirect */
        $this->wpAddAction('admin_init', 'doRedirect');
    }

    /**
     * Set redirect transition on update or activation
     *
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\Status $statusHelper
     */
    protected function checkStatusAndSetRedirect(Request $requestHelper, Options $optionsHelper, Status $statusHelper)
    {
        if (vcvenv('VCV_ENV_FT_SYSTEM_CHECK_LIST')) {
            $statusHelper->checkSystemStatusAndSetFlag();
            $optionsHelper->setTransient('lastSystemCheck', time() + DAY_IN_SECONDS);
        }

        if (!is_network_admin() && !$requestHelper->exists('activate-multi')) {
            $optionsHelper->setTransient('_vcv_activation_page_redirect', 1, 30);
        }
    }

    /**
     * Do redirect if required on welcome page
     *
     * @param $response
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return mixed
     */
    protected function doRedirect($response, Options $optionsHelper)
    {
        $redirect = $optionsHelper->getTransient('_vcv_activation_page_redirect');
        if ($redirect) {
            $optionsHelper->deleteTransient('_vcv_activation_page_redirect');
            wp_redirect(admin_url('admin.php?page=vcv-getting-started&vcv-ref=activation-page'));
            exit;
        }

        return $response;
    }
}
