<?php

namespace VisualComposer\Modules\Hub;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Hub\Update;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class UpdateController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct()
    {
        $this->addEvent('vcv:admin:inited vcv:system:activation:hook', 'checkForUpdate');
        $this->wpAddAction('admin_menu', 'checkForUpdate', 9);
        $this->addFilter('vcv:editors:frontend:render', 'checkForUpdate', -1);

        // Factory reset
        $this->addEvent('vcv:system:activation:hook vcv:system:factory:reset', 'unsetOptions', -1);
    }

    /**
     * @param $response
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\Hub\Update $hubUpdateHelper
     *
     * @return mixed
     * @throws \ReflectionException
     */
    protected function checkForUpdate($response, Options $optionsHelper, Update $hubUpdateHelper)
    {
        if ($optionsHelper->getTransient('lastBundleUpdate') < time()) {
            $result = $hubUpdateHelper->checkVersion();
            if (!vcIsBadResponse($result)) {
                $optionsHelper->setTransient('lastBundleUpdate', time() + DAY_IN_SECONDS);
            } else {
                //if failed try one more time after one hour
                $optionsHelper->setTransient('lastBundleUpdate', time() + 3600);
            }
        }

        return $response;
    }

    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper
            ->delete('bundleUpdateRequired')
            ->delete('bundleUpdateActions')
            ->delete('bundleUpdateJson')
            ->deleteTransient('bundleUpdateJson')
            ->deleteTransient('lastBundleUpdate');
    }
}
