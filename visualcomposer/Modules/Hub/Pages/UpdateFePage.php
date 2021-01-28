<?php

namespace VisualComposer\Modules\Hub\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Hub\Update;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Url;

/**
 * Class UpdateFePage
 * @package VisualComposer\Modules\Hub\Pages
 */
class UpdateFePage extends Container implements Module
{
    use EventsFilters;

    /**
     * UpdateFePage constructor.
     */
    public function __construct()
    {
        $this->addFilter('vcv:editors:frontend:render', 'setUpdatingViewFe', -1);
        $this->addFilter('vcv:frontend:update:extraOutput', 'addUpdateAssets', 10);
    }

    /**
     * @param $response
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\Hub\Update $updateHelper
     * @param \VisualComposer\Helpers\License $licenseHelper
     *
     * @return mixed
     * @throws \ReflectionException
     */
    protected function setUpdatingViewFe(
        $response,
        Options $optionsHelper,
        Update $updateHelper,
        License $licenseHelper
    ) {
        if (
            ($licenseHelper->isPremiumActivated() || $optionsHelper->get('agreeHubTerms'))
            && $optionsHelper->get('bundleUpdateRequired')
        ) {
            $requiredActions = $updateHelper->getRequiredActions();
            if (!empty($requiredActions['actions']) || !empty($requiredActions['posts'])) {
                $content = implode('', vcfilter('vcv:update:extraOutput', []));
                vcvdie(
                    vcview('editor/frontend/fe-update-wrapper', ['content' => $content, 'sourceId' => get_the_ID()])
                );
            } else {
                $optionsHelper->set('bundleUpdateRequired', false);
            }
        }

        return $response;
    }

    /**
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Url $urlHelper
     *
     * @return array
     */
    protected function addUpdateAssets($response, $payload, Url $urlHelper)
    {
        // Add Vendor JS
        $response = array_merge(
            (array)$response,
            [
                sprintf(
                    '<link rel="stylesheet" href="%s"></link>',
                    $urlHelper->to(
                        'public/dist/wpVcSettings.bundle.css?v=' . VCV_VERSION
                    )
                ),
                sprintf(
                    '<script id="vcv-script-vendor-bundle-update" type="text/javascript" src="%s"></script>',
                    $urlHelper->to(
                        'public/dist/vendor.bundle.js?v=' . VCV_VERSION
                    )
                ),
                sprintf(
                    '<script id="vcv-script-wpUpdate-bundle-update" type="text/javascript" src="%s"></script>',
                    $urlHelper->to(
                        'public/dist/wpUpdate.bundle.js?v=' . VCV_VERSION
                    )
                ),
            ]
        );

        return $response;
    }
}
