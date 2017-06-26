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
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Url;
use VisualComposer\Modules\Hub\Download\Pages\UpdateBePage;

class BundleUpdateController extends Container implements Module
{
    use EventsFilters;

    public function __construct(Token $tokenHelper)
    {
        if (vcvenv('VCV_ENV_HUB_DOWNLOAD') && $tokenHelper->isSiteAuthorized()) {
            $this->addEvent('vcv:admin:inited vcv:system:activation:hook', 'checkForUpdate');
            $this->addFilter('vcv:editors:frontend:render', 'setUpdatingViewFe', 120);
            $this->addFilter('vcv:frontend:update:head:extraOutput', 'addUpdateAssets', 10);
            $this->addFilter(
                'vcv:editors:backend:addMetabox',
                'setRedirectToUpdateBe',
                120
            );
            $this->addFilter('vcv:editors:backend:addMetabox', 'doRedirectBe', 130);
            $this->addFilter('vcv:ajax:bundle:update:adminNonce', 'triggerPrepareBundleDownload', 130);
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
        $optionsHelper = vchelper('Options');
        $hubBundleHelper = vchelper('HubBundle');
        $version = $hubBundleHelper->getRemoteVersionInfo();
        if (version_compare($optionsHelper->get('bundleVersion', '0'), $version, '<')) {
            // we need to update bundle!!
            $optionsHelper->set('bundleUpdateRequired', true);
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

    protected function triggerPrepareBundleDownload($response, $payload)
    {
        $result = vcfilter('vcv:hub:bundle:update:adminNonce', true, $payload);
        if (is_wp_error($result) || $result !== true) {
            header('Status: 403', true, 403);
            header('HTTP/1.0 403 Forbidden', true, 403);

            if (is_wp_error($result)) {
                /** @var $response \WP_Error */
                echo json_encode(['message' => implode('. ', $result->get_error_messages())]);
            } elseif (is_array($result)) {
                echo json_encode(['message' => $result['body']]);
            } else {
                echo json_encode(['status' => false]);
            }
            exit;
        }

        return $result;
    }
}
