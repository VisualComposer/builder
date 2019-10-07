<?php

namespace VisualComposer\Modules\Hub\Elements;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Differ;
use VisualComposer\Helpers\Hub\Elements as HubElements;
use VisualComposer\Helpers\Traits\EventsFilters;

class ElementsUpdater extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        if (!vcvenv('VCV_ENV_DEV_ELEMENTS')) {
            $this->addFilter('vcv:hub:download:bundle vcv:hub:download:bundle:element/*', 'updateElements');
        }
    }

    protected function updateElements($response, $payload, HubElements $elementsHelper)
    {
        if (vcvenv('VCV_ENV_DEV_ELEMENTS')) {
            return ['status' => true];
        }
        $bundleJson = isset($payload['archive']) ? $payload['archive'] : false;
        if (vcIsBadResponse($response) || !$bundleJson || is_wp_error($bundleJson)) {
            return ['status' => false];
        }
        $hubHelper = vchelper('HubElements');
        /** @var Differ $elementsDiffer */
        $hubElements = $hubHelper->getElements(true);

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
        $elements = $elementsDiffer->get();
        $hubHelper->setElements($elements);
        if (!isset($response['elements']) || !is_array($response['elements'])) {
            $response['elements'] = [];
        }
        $elementKeys = array_keys($bundleJson['elements']);
        foreach ($elementKeys as $element) {
            $elementData = $elements[ $element ];
            $elementData['tag'] = $element;
            $elementData['assetsPath'] = $elementsHelper->getElementUrl($elementData['assetsPath']);
            $elementData['bundlePath'] = $elementsHelper->getElementUrl($elementData['bundlePath']);
            $elementData['elementPath'] = $elementsHelper->getElementUrl($elementData['elementPath']);

            if (isset($elementData['settings']['metaThumbnailUrl'])) {
                $elementData['settings']['metaThumbnailUrl'] = $elementsHelper->getElementUrl(
                    $elementData['settings']['metaThumbnailUrl']
                );
            }
            if (isset($elementData['settings']['metaPreviewUrl'])) {
                $elementData['settings']['metaPreviewUrl'] = $elementsHelper->getElementUrl(
                    $elementData['settings']['metaPreviewUrl']
                );
            }

            $response['elements'][] = $elementData;
        }

        return $response;
    }
}
