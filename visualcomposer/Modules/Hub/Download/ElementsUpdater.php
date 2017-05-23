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

class ElementsUpdater extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Hub\Download\ElementsUpdater::updateElements */
        $this->addEvent('vcv:hub:download:bundle', 'updateElements');
    }

    protected function updateElements($bundleJson)
    {
        $hubHelper = vchelper('Hub');
        /** @var Differ $elementsDiffer */
        $hubElements = $hubHelper->getElements();

        $elementsDiffer = vchelper('Differ');
        if (!empty($hubElements)) {
            $elementsDiffer->set($hubElements);
        }

        $fileHelper = vchelper('File');
        $fileHelper->createDirectory($hubHelper->getElementPath());
        $elementsDiffer->onUpdate(
            [$hubHelper, 'updateElement']
        )->set(
            $bundleJson['elements']
        );
        $hubHelper->setElements($elementsDiffer->get());
    }
}
