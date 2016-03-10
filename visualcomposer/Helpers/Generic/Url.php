<?php

namespace VisualComposer\Helpers\Generic;

/**
 * Helper API methods related to make Url for plugin directory
 */
class Url
{
    /**
     * Helper method assetUrl for plugin assets folder
     *
     * @param $path
     *
     * @return string
     */
    public function assetUrl($path)
    {
        return $this->to('visualcomposer/resources/' . ltrim($path, '\//'));
    }

    /**
     * Url to whole plugin folder
     *
     * @param $path
     *
     * @return string
     */
    public function to($path)
    {
        return VC_V_PLUGIN_URL . ltrim($path, '\//');
    }

    /**
     * Url to whole plugin folder
     *
     * @param $query
     *
     * @return string
     */
    public function ajax($query = [])
    {
        return $this->to(sprintf('ajax.php?%s', http_build_query($query)));
    }
}
