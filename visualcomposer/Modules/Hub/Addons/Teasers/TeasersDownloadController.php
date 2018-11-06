<?php

namespace VisualComposer\Modules\Hub\Addons\Teasers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;

class TeasersDownloadController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addEvent('vcv:hub:process:action:hubAddons', 'processAction');
    }

    protected function processAction($teasers, Options $optionsHelper)
    {
        if (isset($teasers) && isset($teasers['data'])) {
            $teaserAddons = $this->getTeaserAddons($teasers['data']['addons']);
            $optionsHelper->set('hubTeaserAddons', $teaserAddons);
        }
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
