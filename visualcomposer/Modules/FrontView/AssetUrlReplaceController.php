<?php

namespace VisualComposer\Modules\FrontView;

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
 * Class AssetUrlReplaceController
 * @package VisualComposer\Modules\FrontView
 */
class AssetUrlReplaceController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    /**
     * AssetUrlReplaceController constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\FrontView\AssetUrlReplaceController::replaceUrls */
        $this->addFilter('vcv:frontend:content vcv:frontend:content:encode', 'replaceUrls');
        $this->wpAddFilter('the_content', 'replaceUrls', 100);
        $this->wpAddFilter('the_editor_content', 'replaceUrls', 100);
    }

    /**
     * Replace urls placeholders
     *
     * @param $content
     * @param \VisualComposer\Helpers\Assets $assetsHelper
     *
     * @return mixed
     */
    protected function replaceUrls($content, Assets $assetsHelper)
    {
        $assetUrl = $assetsHelper->getAssetUrl();
        $uploadDir = wp_upload_dir();
        $uploadUrl = set_url_scheme($uploadDir['baseurl']);

        // Assets Url
        $content = str_replace(
            [
                '[vcvAssetsUploadUrl]',
                'http://|!|vcvAssetsUploadUrl|!|',
                'https://|!|vcvAssetsUploadUrl|!|',
                '|!|vcvAssetsUploadUrl|!|',
            ],
            $assetUrl,
            $content
        );

        // Upload Url
        $content = str_replace(
            [
                '[vcvUploadUrl]',
                'http://|!|vcvUploadUrl|!|',
                'https://|!|vcvUploadUrl|!|',
                '|!|vcvUploadUrl|!|',
            ],
            $uploadUrl,
            $content
        );

        return $content;
    }
}
