<?php

namespace VisualComposer\Modules\Hub\Addons;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Differ;
use VisualComposer\Helpers\Logger;
use VisualComposer\Helpers\Traits\EventsFilters;

class AddonsUpdater extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:hub:download:bundle vcv:hub:download:bundle:addon/*', 'updateAddons');
    }

    protected function updateAddons($response, $payload, Logger $loggerHelper)
    {
        $bundleJson = isset($payload['archive']) ? $payload['archive'] : false;
        if (vcIsBadResponse($response) || !$bundleJson || is_wp_error($bundleJson)) {
            return ['status' => false];
        }
        $hubHelper = vchelper('HubAddons');
        /** @var Differ $addonsDiffer */
        $hubAddons = $hubHelper->getAddons();

        $addonsDiffer = vchelper('Differ');
        if (!empty($hubAddons)) {
            $addonsDiffer->set($hubAddons);
        }

        $fileHelper = vchelper('File');
        $fileHelper->createDirectory($hubHelper->getAddonPath());
        $addonsDiffer->onUpdate(
            [$hubHelper, 'updateAddon']
        )->set(
            $bundleJson['addons']
        );
        $addons = $addonsDiffer->get();
        $hubHelper->setAddons($addons);

        if (!isset($response['addons']) || !is_array($response['addons'])) {
            $response['addons'] = [];
        }

        $addonsKeys = array_keys($bundleJson['addons']);
        foreach ($addonsKeys as $addonsKey) {
            $addonsData = $addons[ $addonsKey ];
            $addonsData['tag'] = $addonsKey;
            if (isset($addonsData['bundlePath'])) {
                if (!$hubHelper->checkAbsUrl($addonsData['bundlePath'])) {
                    $addonsData['bundlePath'] = $hubHelper->getAddonUrl(
                        $addonsKey . '/' . $addonsData['bundlePath']
                    );
                }
            }
            $response['addons'][] = $addonsData;
        }

        return $response;
    }
}
