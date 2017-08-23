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
use VisualComposer\Helpers\Logger;
use VisualComposer\Helpers\Traits\EventsFilters;

class ElementsUpdater extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Hub\Download\ElementsUpdater::updateElements */
        $this->addFilter('vcv:hub:download:bundle vcv:hub:download:bundle:element/*', 'updateElements');
    }

    protected function updateElements($response, $payload, Logger $loggerHelper)
    {
        $bundleJson = isset($payload['archive']) ? $payload['archive'] : false;
        if (vcIsBadResponse($response) || !$bundleJson || is_wp_error($bundleJson)) {
            $loggerHelper->log(__('Failed to update elements', 'vcwb'), [
                'response' => $response,
                'bundleJson' => $bundleJson,
            ]);

            return ['status' => false];
        }
        $hubHelper = vchelper('HubElements');
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

        return $response;
    }
}
