<?php

namespace VisualComposer\Modules\Hub\GroupsCategories;

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

class CategoriesUpdater extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:hub:download:bundle vcv:hub:download:bundle:*', 'updateCategories');
    }

    protected function updateCategories($response, $payload, Logger $loggerHelper)
    {
        $bundleJson = isset($payload['archive']) ? $payload['archive'] : false;
        if (vcIsBadResponse($response) || !$bundleJson || is_wp_error($bundleJson)) {
            return ['status' => false];
        }

        if (!is_array($bundleJson) || !isset($bundleJson['categories'])) {
            return $response;
        }
        $hubBundleHelper = vchelper('HubActionsCategoriesBundle');
        $hubHelper = vchelper('HubCategories');
        /** @var Differ $categoriesDiffer */
        $hubCategories = $hubHelper->getCategories('hub');

        $categoriesDiffer = vchelper('Differ');
        if (!empty($hubCategories)) {
            $categoriesDiffer->set($hubCategories);
        }

        $fileHelper = vchelper('File');
        $fileHelper->createDirectory($hubHelper->getCategoriesPath());
        $fileHelper->copyDirectory(
            $hubBundleHelper->getTempBundleFolder('categories'),
            $hubHelper->getCategoriesPath(),
            false
        );
        $categoriesDiffer->onUpdate(
            [$hubHelper, 'updateCategory']
        )->set(
            $bundleJson['categories']
        );
        $hubHelper->setCategories($categoriesDiffer->get());

        if (isset($bundleJson['categories'])) {
            if (!isset($response['categories']) || !is_array($response['categories'])) {
                $response['categories'] = [];
            }
            $response['categories'][] = $bundleJson['categories'];
        }

        return $response;
    }
}
