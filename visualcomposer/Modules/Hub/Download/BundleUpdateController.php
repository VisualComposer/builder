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
use VisualComposer\Helpers\Url;
use VisualComposer\Modules\Hub\Download\Pages\UpdateBePage;

class BundleUpdateController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        if (vcvenv('VCV_ENV_HUB_DOWNLOAD')) {
            $this->addEvent('vcv:inited vcv:system:activation:hook', 'checkForUpdate');
            $this->addFilter('vcv:editors:frontend:render', 'setUpdatingViewFe', 120);
            $this->addFilter('vcv:frontend:update:head:extraOutput', 'addUpdateAssets', 10);
            $this->addFilter(
                'vcv:editors:backend:addMetabox vcv:editors:frontend:render',
                'setRedirectToUpdateBe',
                120
            );
            $this->addFilter('vcv:editors:backend:addMetabox vcv:editors:frontend:render', 'doRedirectBe', 130);
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

    protected function addUpdateAssets($response, $payload, Url $urlHelper)
    {
        // Add Vendor JS
        $response = array_merge(
            (array)$response,
            [
                sprintf(
                    '<link rel="stylesheet" href="%s"></link>',
                    $urlHelper->to(
                        'public/dist/wpupdate.bundle.css?' . VCV_VERSION
                    )
                ),
                sprintf(
                    '<script id="vcv-script-vendor-bundle-update" type="text/javascript" src="%s"></script>',
                    $urlHelper->to(
                        'public/dist/wpupdate.bundle.js?' . VCV_VERSION
                    )
                ),
            ]
        );

        return $response;
    }

    /**
     * Do redirect if required on welcome page
     *
     * @param $response
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return
     */
    protected function doRedirectBe($response, UpdateBePage $updateBePage, Options $optionsHelper)
    {
        $redirect = $optionsHelper->getTransient('_vcv_update_page_redirect');
        $optionsHelper->deleteTransient('_vcv_update_page_redirect');
        if ($redirect) {
            wp_redirect(admin_url('admin.php?page=' . rawurlencode($updateBePage->getSlug())));
        }

        return $response;
    }

    /**
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return mixed
     */
    protected function setRedirectToUpdateBe($response, $payload, Options $optionsHelper, Url $urlHelper)
    {
        if ($optionsHelper->get('bundleUpdateRequired')) {
            $optionsHelper->setTransient('_vcv_update_page_redirect', 1, 30);
            $optionsHelper->setTransient('_vcv_update_page_redirect_url', $urlHelper->current(), 30);
        }

        return $response;
    }
}
