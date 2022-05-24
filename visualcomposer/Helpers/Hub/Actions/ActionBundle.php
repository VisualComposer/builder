<?php

namespace VisualComposer\Helpers\Hub\Actions;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;
use VisualComposer\Helpers\Hub\Bundle;

class ActionBundle extends Bundle implements Helper
{
    /** @noinspection PhpMissingParentCallCommonInspection */
    public function requestBundleDownload($url)
    {
        $fileHelper = vchelper('File');
        $downloadedArchive = $fileHelper->download($url);

        return $downloadedArchive;
    }

    /**
     * Fill temp bundle folder with archive bundle data.
     *
     * @param string $actionName
     * @param array $archive
     *
     * @return bool|true|\WP_Error
     */
    public function fillTempBundleFolder($actionName, $archive, $type = '')
    {
        $tempPath = $this->getBundleTempFolderPath($actionName, $type);

        $this->setTempBundleFolder($tempPath);

        return $this->unzipDownloadedBundle($archive);
    }

    /**
     * Get get path to bundle temp folder.
     *
     * @param $actionName
     * @param $type
     *
     * @return string
     */
    public function getBundleTempFolderPath($actionName, $type)
    {
        $tempPath = VCV_PLUGIN_ASSETS_DIR_PATH . '/temp-bundle-' . str_replace('/', '-', $actionName);

        return apply_filters('vcv:helpers:hub:actions:fillTempBundleFolder:path', $tempPath, $actionName, $type);
    }
}
