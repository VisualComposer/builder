<?php

namespace VisualComposer\Modules\Vendors;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VcvEnv;
use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\WpFiltersActions;


class EssentialGridController extends Container implements Module
{
    use WpFiltersActions;

    public function __construct()
    {
        $this->wpAddAction('plugins_loaded', 'initialize');
    }

    protected function initialize()
    {
        if (!class_exists('Essential_Grid')) {
            return;
        }

        $this->wpAddAction('essgrid_output_by_posts_pre', 'stopEnqueueInnerAssets');
        $this->wpAddAction('essgrid_output_by_posts_post', 'startEnqueueInnerAssets');
    }

    /**
     * Delay enqueue assets for essential grid templates.
     *
     * @see \VisualComposer\Modules\Assets\enqueueAssetsFromList:enqueueAssetsFromList()
     */
    protected function stopEnqueueInnerAssets()
    {
        VcvEnv::set('ENQUEUE_INNER_ASSETS', true);
    }

    /**
     * Start enqueue assets after essential grid templates rendering output.
     *
     * @see \VisualComposer\Modules\Assets\enqueueAssetsFromList:enqueueAssetsFromList()
     */
    protected function startEnqueueInnerAssets()
    {
        VcvEnv::set('ENQUEUE_INNER_ASSETS', false);
    }
}
