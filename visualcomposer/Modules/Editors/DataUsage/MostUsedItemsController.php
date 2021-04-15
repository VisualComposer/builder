<?php

namespace VisualComposer\Modules\Editors\DataUsage;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;

class MostUsedItemsController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:ajax:usageCount:updateUsage:adminNonce', 'updateItemUsage');
        $this->addFilter('vcv:ajax:templateUsageCount:updateUsage:adminNonce', 'updateTemplateUsage');
    }

    protected function updateItemUsage(
        $response,
        Request $requestHelper,
        Options $optionsHelper
    ) {
        $itemTag = $requestHelper->input('vcv-item-tag');
        if ($itemTag) {
            $usageCount = $optionsHelper->get('usageCount', []);
            if (isset($usageCount[ $itemTag ])) {
                $usageCount[ $itemTag ] += 1;
            } else {
                $usageCount[ $itemTag ] = 1;
            }
            $optionsHelper->set('usageCount', $usageCount);
        }

        return ['status' => true];
    }

    protected function updateTemplateUsage(
        $response,
        Request $requestHelper,
        Options $optionsHelper
    ) {
        $templateId = $requestHelper->input('vcv-item-id');
        if ($templateId) {
            $usageCount = $optionsHelper->get('templateUsageCount', []);
            if (isset($usageCount[ $templateId ])) {
                $usageCount[ $templateId ] += 1;
            } else {
                $usageCount[ $templateId ] = 1;
            }
            $optionsHelper->set('templateUsageCount', $usageCount);
        }

        return ['status' => true];
    }
}
