<?php

namespace VisualComposer\Helpers\Hub;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

class Bundle implements Helper
{
    public function requestBundleDownload($requestedData = [])
    {
        $urlHelper = vchelper('Url');
        $fileHelper = vchelper('File');
        $optionHelper = vchelper('Options');
        $downloadUrl = $urlHelper->query(
            sprintf(
                '%s/download/bundle/lite?plugin=%s&bundle=%s',
                VCV_HUB_URL,
                VCV_VERSION,
                $optionHelper->get('bundleVersion', '0')
            ),
            $requestedData
        );
        $downloadedArchive = $fileHelper->download($downloadUrl);

        return $downloadedArchive;
    }

    public function unzipDownloadedBundle($bundle)
    {
        $fileHelper = vchelper('File');
        $result = $fileHelper->unzip($bundle, $this->getTempBundleFolder(), true);

        return $result;
    }

    public function getTempBundleFolder($path = '')
    {
        $bundleFolder = VCV_PLUGIN_ASSETS_DIR_PATH . '/temp-bundle';
        if ($path) {
            $bundleFolder .= '/' . ltrim($path, '\//');
        }

        return $bundleFolder;
    }

    public function readBundleJson($bundleJsonPath)
    {
        $fileHelper = vchelper('File');
        $content = $fileHelper->getContents($bundleJsonPath);

        return json_decode($content, true);
    }

    public function removeTempBundleFolder()
    {
        $folder = $this->getTempBundleFolder();
        $fileHelper = vchelper('File');

        return $fileHelper->removeDirectory($folder);
    }
}
