<?php

namespace VisualComposer\Helpers;

use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Class Core
 * @package VisualComposer\Helpers
 */
class Core implements Helper
{
    /**
     * @var null
     */
    private $isNetworkPlugin = null;

    /**
     * Check if this is network plugin
     *
     * @return bool
     */
    public function isNetworkPlugin()
    {
        if (is_null($this->isNetworkPlugin)) {
            $isNetworkPlugin = is_multisite()
                && (is_plugin_active_for_network(VCV_PLUGIN_BASE_NAME)
                    || is_network_only_plugin(VCV_PLUGIN_BASE_NAME));
            $this->isNetworkPlugin = $isNetworkPlugin;
        }

        return $this->isNetworkPlugin;
    }
}
