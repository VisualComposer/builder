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
    }

    protected function updateItemUsage(
        $response,
        $payload,
        Request $requestHelper,
        Options $optionsHelper
    ) {
        $itemTag = isset($payload['tag']) ? $payload['tag'] : $requestHelper->input('vcv-item-tag');
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
}
