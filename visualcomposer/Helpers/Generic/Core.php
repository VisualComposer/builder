<?php

namespace VisualComposer\Helpers\Generic;

/**
 * Class Core
 * @package VisualComposer\Helpers\Generic
 */
class Core
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
                && (is_plugin_active_for_network(VC_V_PLUGIN_BASE_NAME)
                    || is_network_only_plugin(VC_V_PLUGIN_BASE_NAME));
            $this->isNetworkPlugin = $isNetworkPlugin;
        }

        return $this->isNetworkPlugin;
    }
}
