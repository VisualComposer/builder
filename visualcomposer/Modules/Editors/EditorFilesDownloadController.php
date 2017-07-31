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
use VisualComposer\Helpers\Hub\Actions\EditorBundle;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class EditorFilesDownloadController
 * @package VisualComposer\Modules\Editors
 */
class EditorFilesDownloadController extends Container implements Module
{
    use EventsFilters;

    /**
     * EditorFilesDownloadController constructor.
     *
     * @param \VisualComposer\Helpers\Options $optionsHelper
     */
    public function __construct(Options $optionsHelper)
    {
        if (vcvenv('VCV_ENV_EXTENSION_DOWNLOAD')) {
            /** @see \VisualComposer\Modules\Editors\EditorFilesDownloadController::updateEditorFiles */
            $this->addFilter(
                'vcv:hub:download:bundle vcv:hub:download:bundle:editor',
                'updateEditorFiles',
                80
            );
        }
    }

    /**
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\File $fileHelper
     * @param \VisualComposer\Helpers\Hub\Actions\EditorBundle $hubBundleHelper
     *
     * @return bool
     */
    protected function updateEditorFiles(
        $response,
        $payload,
        File $fileHelper,
        EditorBundle $hubBundleHelper
    ) {
        $bundleJson = $payload['archive'];
        if (!$response || is_wp_error($bundleJson)) {
            return false;
        }
        //if (isset($bundleJson['editor']) && $bundleJson['editor']) {
        $fileHelper->createDirectory(VCV_PLUGIN_ASSETS_DIR_PATH . '/editor');
        $fileHelper->copyDirectory(
            $hubBundleHelper->getTempBundleFolder('editor'),
            VCV_PLUGIN_ASSETS_DIR_PATH . '/editor'
        );
        // $optionHelper->set('bundleUpdateRequired', false);
        // $optionHelper->set('bundleVersion', $bundleJson['editor']);
        // }

        return true;
    }
}
