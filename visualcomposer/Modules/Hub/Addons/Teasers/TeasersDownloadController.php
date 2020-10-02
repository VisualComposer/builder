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
        if (isset($teasers['data'])) {
            $teaserAddonsBefore = $optionsHelper->get('hubTeaserAddons', false);
            $teaserAddons = $this->getTeaserAddons($teasers['data']['addons']);
            if ($teaserAddonsBefore) {
                $teaserAddons = $this->compareTeaserAddons($teaserAddonsBefore, $teaserAddons);
            }
            $optionsHelper->set('hubTeaserAddons', $teaserAddons);
        }
    }

    protected function getTeaserAddons($teasers)
    {
        $allAddons = [];
        $dataHelper = vchelper('Data');
        foreach ($teasers as $addon) {
            $addonData = [
                'bundle' => $addon['bundle'],
                'tag' => $addon['tag'],
                'name' => $addon['name'],
                'metaThumbnailUrl' => $addon['thumbnailUrl'],
                'metaPreviewUrl' => $addon['previewUrl'],
                'metaDescription' => $addon['description'],
                'metaAddonImageUrl' => isset($addon['addonImageUrl']) ? $addon['addonImageUrl'] : '',
                'type' => 'addon',
                'update' => isset($addon['update']) ? $addon['update'] : false,
                'allowDownload' => isset($addon['allowDownload']) ? $addon['allowDownload'] : false,
            ];
            $allAddons[] = $addonData;
        }
        $addons = array_values($dataHelper->arrayDeepUnique($allAddons));

        return $addons;
    }

    /**
     * @param array $teaserAddonsBefore
     * @param array $teaserAddons
     *
     * @return array
     */
    protected function compareTeaserAddons($teaserAddonsBefore, $teaserAddons)
    {
        // Compare old with new
        // It will give us list of items that was newly added.
        $dataHelper = vchelper('Data');

        // Merge items that already isNew
        while (
            $newAddonKey = $dataHelper->arraySearchKey(
                $teaserAddonsBefore,
                'isNew'
            )
        ) {
            $newTeaserAddonKey = $dataHelper->arraySearch(
                $teaserAddons,
                'bundle',
                $teaserAddonsBefore[ $newAddonKey ]['bundle'],
                true
            );
            if ($newTeaserAddonKey !== false) {
                $teaserAddons[ $newTeaserAddonKey ]['isNew'] = $teaserAddonsBefore[ $newAddonKey ]['isNew'];
            }
            unset($teaserAddonsBefore[ $newAddonKey ]['isNew']);
        }

        $addonsBefore = $dataHelper->arrayColumn(
            $teaserAddonsBefore,
            'bundle'
        );
        $newAddons = $dataHelper->arrayColumn($teaserAddons, 'bundle');
        $difference = array_diff($newAddons, $addonsBefore);
        if (!empty($difference)) {
            // There are new item
            foreach ($difference as $diffAddon) {
                // it is new item so mark it as isNew = true
                $newAddonKey = $dataHelper->arraySearch(
                    $teaserAddons,
                    'bundle',
                    $diffAddon,
                    true
                );
                if ($newAddonKey !== false) {
                    $teaserAddons[ $newAddonKey ]['isNew'] = true;
                }
            }
        }

        return $teaserAddons;
    }
}
