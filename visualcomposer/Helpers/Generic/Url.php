<?php

namespace VisualComposer\Helpers\Generic;

/**
 * Helper API methods related to make Url for plugin directory
 * Class Url
 * @package VisualComposer\Helpers\Generic
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
        return VCV_PLUGIN_URL . ltrim($path, '\//');
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
        $query[ VCV_AJAX_REQUEST ] = '1';
        $url = get_site_url();
        $q = '?';
        /** @var Str $strHelper */
        $strHelper = vchelper('str');
        if ($strHelper->contains($url, '?')) {
            $q = '&';
        }

        return get_site_url() . $q . http_build_query($query);
    }
}
