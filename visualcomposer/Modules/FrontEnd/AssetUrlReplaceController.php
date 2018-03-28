<?php

namespace VisualComposer\Modules\FrontEnd;

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

class AssetUrlReplaceController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct()
    {
        $this->addFilter('vcv:frontend:content vcv:frontend:content:encode', 'replaceUrls');
        $this->wpAddFilter('the_content', 'replaceUrls', 100);
    }

    protected function replaceUrls($content)
    {
        $content = preg_replace_callback(
            '/\[vcvAssetsUploadUrl\]/',
            function () {
                /** @see \VisualComposer\Modules\Elements\AssetShortcode\AssetUrlReplaceController::renderAssetsUploadUrl */
                return $this->call('renderAssetsUploadUrl');
            },
            $content
        );
        $content = preg_replace_callback(
            '/\[vcvUploadUrl\]/',
            function () {
                /** @see \VisualComposer\Modules\Elements\AssetShortcode\AssetUrlReplaceController::renderUploadUrl */
                return $this->call('renderUploadUrl');
            },
            $content
        );

        return $content;
    }

    protected function renderAssetsUploadUrl(Assets $assetsHelper)
    {
        return $assetsHelper->getAssetUrl();
    }

    protected function renderUploadUrl()
    {
        $uploadDir = wp_upload_dir();
        $url = set_url_scheme($uploadDir['baseurl']);

        return $url;
    }
}
