<?php

namespace VisualComposer\Helpers\Hub;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

class Addons implements Helper
{
    public function getAddons()
    {
        $optionHelper = vchelper('Options');

        return $optionHelper->get('hubAddons', []);
    }

    public function setAddons($addons = [])
    {
        $optionHelper = vchelper('Options');

        return $optionHelper->set('hubAddons', $addons);
    }

    public function updateAddon($key, $prev, $new, $merged)
    {
        $hubBundleHelper = vchelper('HubActionsAddonsBundle');
        $fileHelper = vchelper('File');
        $result = $fileHelper->copyDirectory(
            $hubBundleHelper->getTempBundleFolder('addons/' . $key),
            $this->getAddonPath($key)
        );
        if (!is_wp_error($result)) {
            $merged = $this->updateAddonData($key, $merged);
        }

        return $merged;
    }

    protected function updateAddonData($key, $merged)
    {
        $merged['addonRealPath'] = $this->getAddonPath($key . '/' . $key . '/');
        if (isset($merged['phpFiles'])) {
            $files = $merged['phpFiles'];
            foreach ($files as $index => $filePath) {
                $merged['phpFiles'][ $index ] = rtrim($merged['addonRealPath'], '\\/') . '/' . $filePath;
            }
            unset($index, $filePath);
        }
        array_walk_recursive($merged, [$this, 'fixDoubleSlash']);

        return $merged;
    }

    public function fixDoubleSlash(&$value)
    {
        $value = preg_replace('/([^:])(\/{2,})/', '$1/', $value);
    }

    public function getAddonPath($key = '')
    {
        return VCV_PLUGIN_ASSETS_DIR_PATH . '/addons/' . ltrim($key, '\\/');
    }

    public function getAddonUrl($key = '')
    {
        $assetsHelper = vchelper('Assets');

        return VCV_ENV_DEV_ADDONS
            ? VCV_PLUGIN_URL . 'devAddons/' . ltrim($key, '\\/') . '/' . ltrim($key, '\\/')
            : $assetsHelper->getAssetUrl(
                '/addons/' . ltrim($key, '\\/') . '/'
                . ltrim($key, '\\/')
            );
    }

    /**
     * @param $addon
     *
     * @return false|string
     */
    public function getAddonRealPath($addon)
    {
        $hubAddons = $this->getAddons();

        if ($hubAddons[ $addon ]) {
            return $hubAddons[ $addon ]['addonRealPath'];
        }

        return false;
    }
}
