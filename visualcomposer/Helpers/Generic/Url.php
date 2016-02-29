<?php

namespace VisualComposer\Helpers\Generic;

/**
 * Helper API methods related to make Url for plugin directory
 */
abstract class Url
{
    /**
     * Helper method assetUrl for plugin assets folder
     *
     * @param $path
     *
     * @return string
     */
    public static function assetURL($path)
    {
        return self::to('assets/'.ltrim($path, '\//'));
    }

    /**
     * Url to whole plugin folder
     *
     * @param $path
     *
     * @return string
     */
    public static function to($path)
    {
        return VC_V_PLUGIN_URL.ltrim($path, '\//');
    }
}