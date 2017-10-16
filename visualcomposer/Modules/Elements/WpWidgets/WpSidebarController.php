<?php

namespace VisualComposer\Modules\Elements\WpWidgets;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;

class WpSidebarController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:frontend:head:extraOutput', 'addGlobalVariables');
        $this->addFilter('vcv:backend:extraOutput', 'addGlobalVariables');
    }

    /**
     * @param $scripts
     * @param $payload
     *
     * @return array
     */
    protected function addGlobalVariables($scripts, $payload)
    {
        // @codingStandardsIgnoreLine
        global $wp_registered_sidebars;
        $values = [];
        // @codingStandardsIgnoreLine
        foreach ($wp_registered_sidebars as $key => $sidebar) {
            $values[] = [
                'label' => $sidebar['name'],
                'value' => $sidebar['id'],
            ];
        }
        $variables = [];
        $script = vcview(
            'partials/variable',
            [
                'key' => 'vcvWpSidebars',
                // @codingStandardsIgnoreLine
                'value' => $values,
            ]
        );
        $variables[] = $script;

        return array_merge($scripts, $variables);
    }
}
