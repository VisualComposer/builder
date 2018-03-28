<?php

namespace VisualComposer\Modules\Elements\AssetShortcode;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Assets;
use VisualComposer\Modules\Elements\Traits\AddShortcodeTrait;

class Controller extends Container implements Module
{
    use AddShortcodeTrait;

    public function __construct()
    {
        $this->addShortcode('vcvAssetsUploadUrl', 'renderAssetsUploadUrl');
        $this->addShortcode('vcvUploadUrl', 'renderUploadUrl');
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
