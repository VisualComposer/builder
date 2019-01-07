<?php

namespace VisualComposer\Modules\Editors\Attributes\IconPicker;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Assets;
use VisualComposer\Helpers\AssetsShared;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Str;
use VisualComposer\Helpers\Traits\EventsFilters;

class Controller extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addEvent('vcv:frontend:render', 'enqueueEditor');
    }

    protected function enqueueEditor(
        AssetsShared $assetsSharedHelper,
        Str $strHelper,
        Assets $assetsHelper,
        Options $optionsHelper
    ) {
        $libraries = $assetsSharedHelper->getSharedAssets();

        if (is_array($libraries) && isset($libraries['iconpicker'])) {
            $asset = $libraries['iconpicker'];
            if (isset($asset['cssSubsetBundles'])) {
                $assetsVersion = $optionsHelper->get('hubAction:asset/iconpicker', VCV_VERSION);
                foreach ($asset['cssSubsetBundles'] as $single) {
                    wp_enqueue_style(
                        'vcv:assets:source:styles:' . $strHelper->slugify($single),
                        $assetsHelper->getAssetUrl($single),
                        [],
                        $assetsVersion
                    );
                }
            }
        }

        if (is_array($libraries) && isset($libraries['dividerpicker'])) {
            $asset = $libraries['dividerpicker']['cssBundle'];
            $assetsVersion = VCV_VERSION;
            wp_enqueue_style(
                'vcv:assets:source:styles:' . $strHelper->slugify($asset),
                $assetsHelper->getAssetUrl($asset),
                [],
                $assetsVersion
            );
        }
    }
}
