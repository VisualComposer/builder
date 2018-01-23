<?php

namespace VisualComposer\Modules\Hub;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Application as ApplicationVc;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class AddonsAutoload extends ElementsAutoload implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    /** @noinspection PhpMissingParentConstructorInspection */
    public function __construct(ApplicationVc $app, $init = true)
    {
        $this->app = $app;
        $this->wpAddAction(
            'init',
            function () use ($init) {
                if ($init) {
                    $components = $this->getComponents();
                    $this->doComponents($components);
                }
            },
            11
        );
    }

    /**
     * @return array
     */
    protected function getComponents()
    {
        $hubHelper = vchelper('HubAddons');
        $all = [
            'helpers' => [],
            'modules' => [],
        ];

        foreach ($hubHelper->getAddons() as $key => $addon) {
            if (isset($addon['phpFiles'])) {
                $all = array_merge_recursive($all, $this->getSingleComponent($addon));
            }
        }

        return $all;
    }

    protected function getSingleComponent($addon)
    {
        $components = $addon['phpFiles'];

        return $this->checkElementController($components);
    }
}
