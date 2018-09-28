<?php

namespace VisualComposer\Modules\Hub\Download\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Hub\Update;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Url;

class UpdateFePage extends Container implements Module
{
    use EventsFilters;

    public function __construct(Token $tokenHelper)
    {
        if (vcvenv('VCV_ENV_HUB_DOWNLOAD') && $tokenHelper->isSiteAuthorized()) {
            $this->addFilter('vcv:editors:frontend:render', 'setUpdatingViewFe', -1);
            $this->addFilter('vcv:frontend:update:head:extraOutput', 'addUpdateAssets', 10);
        }
    }

    protected function setUpdatingViewFe($response, Options $optionsHelper, Update $updateHelper)
    {
        if ($optionsHelper->get('bundleUpdateRequired')) {
            $requiredActions = $updateHelper->getRequiredActions();

            vcvdie(
                vcview(
                    'editor/frontend/frontend-updating.php',
                    [
                        'actions' => $requiredActions,
                        'posts' => $optionsHelper->get('bundleUpdatePosts', []),
                    ]
                )
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
                    $urlHelper->assetUrl(
                        'dist/wpupdate.bundle.css?v=' . VCV_VERSION
                    )
                ),
                sprintf(
                    '<script id="vcv-script-vendor-bundle-update" type="text/javascript" src="%s"></script>',
                    $urlHelper->assetUrl(
                        'dist/wpupdate.bundle.js?v=' . VCV_VERSION
                    )
                ),
            ]
        );

        return $response;
    }
}
