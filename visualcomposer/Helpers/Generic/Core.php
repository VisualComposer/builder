<?php

namespace VisualComposer\Helpers\Generic;

/**
 * Core helper methods
 */
abstract class Core
{
    private static $isNetworkPlugin = null;

    /**
     * Check if this is network plugin
     *
     * @return bool
     */
    public static function isNetworkPlugin()
    {
        if (is_null(self::$isNetworkPlugin)) {
            $isNetworkPlugin = is_multisite()
                && (is_plugin_active_for_network(VC_V_PLUGIN_BASE_NAME)
                    || is_network_only_plugin(VC_V_PLUGIN_BASE_NAME));
            self::$isNetworkPlugin = $isNetworkPlugin;
        }

        return self::$isNetworkPlugin;
    }
}
