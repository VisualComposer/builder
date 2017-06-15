<?php

namespace VisualComposer\Modules\Hub\Download;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;

class BundleUpdateController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        if (vcvenv('VCV_ENV_HUB_DOWNLOAD')) {
            $this->addEvent('vcv:inited vcv:system:activation:hook', 'checkForUpdate');
            $this->addFilter('vcv:editors:frontend:render', 'setUpdatingViewFe', 120);
            $this->addFilter('vcv:editors:backend:render', 'setUpdatingViewBe', 120);
        }
    }

    protected function checkForUpdate(Options $optionsHelper)
    {
        if ($optionsHelper->getTransient('lastBundleUpdate') < time()) {
            $this->checkVersion();
            $optionsHelper->setTransient('lastBundleUpdate', time() + DAY_IN_SECONDS);
        }
    }

    protected function checkVersion()
    {
        $optionHelper = vchelper('Options');
        $hubBundleHelper = vchelper('HubBundle');
        $version = $hubBundleHelper->getRemoteVersionInfo();
        if (version_compare($optionHelper->get('bundleVersion', '0'), $version, '<')) {
            // we need to update bundle!!
            $optionHelper->set('bundleUpdateRequired', true);
        }

        return true;
    }

    protected function setUpdatingViewFe($response, Options $optionsHelper)
    {
        if ($optionsHelper->get('bundleUpdateRequired')) {
            return vcview(
                'editor/frontend/frontend-updating.php'
            );
        }

        return $response;
    }

    protected function setUpdatingViewBe($response, Options $optionsHelper)
    {
        if ($optionsHelper->get('bundleUpdateRequired')) {
            return vcview(
                'editor/backend/content-updating.php'
            );
        }

        return $response;
    }
}
