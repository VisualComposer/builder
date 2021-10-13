<?php

namespace VisualComposer\Modules\Autoload;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Autoload;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Application as ApplicationVc;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class ElementsAutoload extends Autoload implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct(ApplicationVc $app, $init = true)
    {
        $this->app = $app;
        $this->wpAddAction(
            'init',
            function () use ($init) {
                if ($init) {
                    $components = $this->getComponents();
                    $success = $this->doComponents($components);
                    if (!$success) {
                        vchelper('Options')->deleteTransient('elements:autoload:all');
                    }
                }
            },
            11
        );
        $this->addEvent(
            'vcv:hub:elements:autoload',
            function ($element) {
                $components = $this->getSingleComponent($element);
                $success = $this->doComponents($components);
                if (!$success) {
                    vchelper('Options')->deleteTransient('elements:autoload:all');
                }
            }
        );
    }

    /**
     * @return array
     */
    protected function getComponents()
    {
        $hubHelper = vchelper('HubElements');
        $all = [
            'helpers' => [],
            'modules' => [],
        ];
        $optionsHelper = vchelper('Options');
        $allCached = \VcvEnv::get('VCV_DEBUG') ? [] : $optionsHelper->getTransient('elements:autoload:all');

        if (!empty($allCached)) {
            return $allCached;
        }
        foreach ($hubHelper->getElements() as $key => $element) {
            if (isset($element['elementRealPath'])) {
                $all = array_merge_recursive($all, $this->getSingleComponent($element));
            }
        }
        $optionsHelper->setTransient('elements:autoload:all', $all, DAY_IN_SECONDS);

        return $all;
    }

    protected function getSingleComponent($element)
    {
        $hubHelper = vchelper('HubElements');
        if (isset($element['phpFiles'])) {
            $phpFiles = $element['phpFiles'];
            $phpFiles = array_map(
                function ($file) use ($element) {
                    // tag/tag/*.php
                    if (strpos($file, '[thirdPartyFullPath]') !== false) {
                        return $file;
                    }

                    if (strpos($file, 'devElements') !== false || file_exists($file)) {
                        return $file;
                    }

                    return rtrim($element['elementRealPath'], '\\/') . '/' . $file;
                },
                $phpFiles
            );
            $components = array_map([$hubHelper, 'getElementPath'], $phpFiles);
        } else {
            $components = $this->app->glob(
                rtrim(
                    $hubHelper->getElementPath(
                        $element['elementRealPath']
                    ),
                    '\//'
                ) . '/*.php'
            );
        }

        return $this->tokenizeComponents($components);
    }
}
