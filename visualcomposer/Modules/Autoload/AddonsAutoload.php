<?php

namespace VisualComposer\Modules\Autoload;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VcvEnv;
use VisualComposer\Framework\Autoload;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Application as ApplicationVc;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Hub\Addons;

class AddonsAutoload extends Autoload implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    /** @noinspection PhpMissingParentConstructorInspection */
    public function __construct(ApplicationVc $app, $init = true)
    {
        $this->app = $app;
        if ($init) {
            $components = $this->getComponents();
            $success = $this->doComponents($components);
            if (!$success) {
                vchelper('Options')->deleteTransient('addons:autoload:all');
            }
        }

        $this->addEvent(
            'vcv:hub:addons:autoload',
            function ($addon, Addons $addonsHubHelper) {
                $phpFiles = $addonsHubHelper->getAddonPhpFiles($addon['tag'], $addon);
                $components = [
                    'helpers' => [],
                    'modules' => [],
                ];
                if (is_array($phpFiles) && !empty($phpFiles)) {
                    $components = $this->getSingleComponent($phpFiles);
                }
                $success = $this->doComponents($components);
                if (!$success) {
                    vchelper('Options')->deleteTransient('addons:autoload:all');
                }
            }
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
        $optionsHelper = vchelper('Options');

        $allCached = VcvEnv::get('VCV_DEBUG') ? [] : $optionsHelper->getTransient('addons:autoload:all');

        if (!empty($allCached['modules'])) {
            return $allCached;
        }
        foreach ($hubHelper->getAddons(true) as $key => $addon) {
            $phpFiles = $hubHelper->getAddonPhpFiles($key, $addon);
            if (is_array($phpFiles) && !empty($phpFiles)) {
                $all = array_merge_recursive($all, $this->getSingleComponent($phpFiles));
            }
        }
        $optionsHelper->setTransient('addons:autoload:all', $all, DAY_IN_SECONDS);

        return $all;
    }

    protected function getSingleComponent($phpFiles)
    {
        if (is_array($phpFiles) && !empty($phpFiles)) {
            return $this->tokenizeComponents($phpFiles);
        }

        return [
            'helpers' => [],
            'modules' => [],
        ];
    }
}
