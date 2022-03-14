<?php

namespace VisualComposer\Modules\Vendors;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Assets;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Backward compatibility with One User Avatar plugin.
 *
 * @see https://wordpress.org/plugins/one-user-avatar/
 */
class OneUserAvatar extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct()
    {
        $this->wpAddAction('plugins_loaded', 'initialize');
    }

    protected function initialize()
    {
        if (!class_exists('One_User_Avatar')) {
            return;
        }

        $this->addFilter('vcv:addon:dynamicFields:parseResponse:before', 'replaceAssetsUrls');
    }

    /**
     * Replace assets url placeholder
     *
     * @param string $content
     *
     * @return string
     */
    protected function replaceAssetsUrls($content, Assets $assetsHelper)
    {
        $assetUrl = $assetsHelper->getAssetUrl();
        $uploadDir = wp_upload_dir();
        $uploadUrl = set_url_scheme($uploadDir['baseurl']);

        $content = $assetsHelper->replaceAssetsUrl($content, $assetUrl);
        $content = $assetsHelper->replaceUploadsUrl($content, $uploadUrl);

        return vcfilter('vcv:frontView:replaceUrl:content', $content);
    }
}
