<?php

namespace VisualComposer\Modules\Hub\Download;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Differ;
use VisualComposer\Helpers\Traits\EventsFilters;

class CategoriesUpdater extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Hub\Download\CategoriesUpdater::updateCategories */
        $this->addEvent('vcv:hub:download:bundle', 'updateCategories');
    }

    protected function updateCategories($bundleJson)
    {
        $hubHelper = vchelper('Hub');
        /** @var Differ $categoriesDiffer */
        $hubCategories = $hubHelper->getCategories();

        $categoriesDiffer = vchelper('Differ');
        if (!empty($hubCategories)) {
            $categoriesDiffer->set($hubCategories);
        }

        $fileHelper = vchelper('File');
        $fileHelper->createDirectory($hubHelper->getCategoriesPath());
        $fileHelper->copyDirectory($hubHelper->getBundleFolder('categories'), $hubHelper->getCategoriesPath(), false);
        $categoriesDiffer->onUpdate(
            [$hubHelper, 'updateCategory']
        )->set(
            $bundleJson['categories']
        );
        $hubHelper->setCategories($categoriesDiffer->get());
    }
}
