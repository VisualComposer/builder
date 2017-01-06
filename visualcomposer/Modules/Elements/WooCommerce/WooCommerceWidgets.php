<?php

namespace VisualComposer\Modules\Elements\WooCommerce;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class WooCommerceWidgets
 * @package VisualComposer\Modules\Elements\WooCommerce
 */
class WooCommerceWidgets extends Container implements Module
{
    use EventsFilters;

    /**
     * WooCommerceWidgets constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Elements\WooCommerce\WooCommerceWidgets::renderWidget */
        $this->addFilter('vcv:helpers:widgets:render', 'renderWidget');
    }

    /**
     * @param array $args
     * @param array $payload
     *
     * @return array
     */
    protected function renderWidget($args, $payload)
    {
        if ($payload['widget'] instanceof \WC_Widget) {
            $args['widget_id'] = $payload['widget']->widget_id;
        }

        return $args;
    }
}
