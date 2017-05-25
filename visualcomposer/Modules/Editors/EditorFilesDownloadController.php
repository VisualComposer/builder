<?php

namespace VisualComposer\Modules\Editors;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\File;
use VisualComposer\Helpers\Hub\Bundle;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;

class EditorFilesDownloadController extends Container implements Module
{
    use EventsFilters;

    public function __construct(Options $optionsHelper)
    {
        if (vcvenv('VCV_EXTENSION_DOWNLOAD')) {
            $this->addEvent(
                'vcv:hub:download:bundle',
                'updateEditorFiles',
                80
            );
        }
    }

    protected function updateEditorFiles($bundleJson, File $fileHelper, Bundle $hubBundleHelper)
    {
        if (isset($bundleJson['editor']) && $bundleJson['editor']) {
            $fileHelper->createDirectory(VCV_PLUGIN_ASSETS_DIR_PATH . '/editor');
            $fileHelper->copyDirectory(
                $hubBundleHelper->getTempBundleFolder('editor'),
                VCV_PLUGIN_ASSETS_DIR_PATH . '/editor'
            );
        }
    }
}
