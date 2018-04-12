<?php

namespace VisualComposer\Modules\Hub\AddonTeasers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;

class AddonTeasersDownloadController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        if (vcvenv('VCV_ENV_HUB_ADDON_TEASER')) {
            $this->addFilter('vcv:hub:process:action:hubAddons', 'processAction');
        }
    }

    protected function processAction($response, $payload, Options $optionsHelper)
    {
        if (!vcIsBadResponse($response) && $payload['data']) {
            $teaserAddons = $this->getTeaserAddons($payload['data']['addons']);
            $optionsHelper->set('hubTeaserAddons', $teaserAddons);
            $response = ['status' => true];
        }

        return $response;
    }

    protected function getTeaserAddons($teasers)
    {
        $allAddons = [];
        $dataHelper = vchelper('Data');
        foreach ($teasers as $addon) {
            $elementData = [
                'bundle' => $addon['bundle'],
                'tag' => $addon['tag'],
                'name' => $addon['name'],
                'metaThumbnailUrl' => $addon['thumbnailUrl'],
                'metaPreviewUrl' => $addon['previewUrl'],
                'metaDescription' => $addon['description'],
                'type' => 'addon',
                'update' => isset($addon['update']) ? $addon['update'] : false,
                'allowDownload' => isset($addon['allowDownload']) ? $addon['allowDownload'] : false,
            ];
            $allAddons[] = $elementData;
        }
        $addons = array_values($dataHelper->arrayDeepUnique($allAddons));

        return $addons;
    }
}
