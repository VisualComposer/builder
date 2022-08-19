<?php

namespace VisualComposer\Modules\Vendors;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;


class AdvancedCustomFields extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;


    public function __construct()
    {
        $this->wpAddAction('plugins_loaded', 'initialize');
    }

    protected function initialize()
    {
        if (! class_exists('ACF')) {
            return;
        }

        $this->addFilter(
            'vcv:addon:dynamicFields:fields:acfGetValue',
            'changeAcfDynamicLayoutValue'
        );
    }

    /**
     * In some ACF types we need change dynamic field value in our layouts.
     *
     * @param string $result
     * @param array $payload
     *
     * @return string
     */
    protected function changeAcfDynamicLayoutValue($result, $payload)
    {
        if (empty($payload['field']['type']) || empty($payload['sourceId'])) {
            return $result;
        }

        $postType = get_post_type($payload['sourceId']);
        if ($postType !== 'vcv_layouts') {
            return $result;
        }

        $fieldType = $payload['field']['type'];

        if ($fieldType === 'image') {
            $postDataHelper = vchelper('PostData');

            $result = $postDataHelper->getEditorImagePlaceholder()['url'];
        }

        return $result;
    }
}
