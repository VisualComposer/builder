<?php

namespace VisualComposer\Modules\Editors\Settings;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/**
 * Class ItemPreviewController
 * @package VisualComposer\Modules\Editors\Settings
 */
class ItemPreviewController extends Container implements Module
{
    use EventsFilters;

    protected $titleRemoveClosure = null;

    public function __construct()
    {
        $this->addFilter('vcv:dataAjax:getData', 'outputItemPreview');
        $this->addFilter('vcv:dataAjax:setData', 'setItemPreview');
        $this->addEvent('vcv:system:factory:reset', 'unsetOptions');
    }

    protected function setItemPreview($response, $payload, Request $requestHelper, Options $optionsHelper)
    {
        $itemPreviewDisabled = $requestHelper->input('vcv-item-preview-disabled', false);
        $frontendSettings = $optionsHelper->get('frontendSettings');
        if ($itemPreviewDisabled) {
            $frontendSettings['itemPreviewDisabled'] = $itemPreviewDisabled;
        } else {
            unset($frontendSettings['itemPreviewDisabled']);
        }

        $optionsHelper->set('frontendSettings', $frontendSettings);

        return $response;
    }

    protected function outputItemPreview($response, $payload, Options $optionsHelper)
    {
        $frontendSettings = $optionsHelper->get('frontendSettings');

        $response['itemPreviewDisabled'] = is_array($frontendSettings)
        && isset($frontendSettings['itemPreviewDisabled']) ? $frontendSettings['itemPreviewDisabled'] : false;

        return $response;
    }

    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper->delete('frontendSettings');
    }
}
