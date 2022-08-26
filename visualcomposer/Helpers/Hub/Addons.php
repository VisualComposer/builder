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
    public function getAddons($outputAddonRealPath = true)
    {
        $optionHelper = vchelper('Options');
        $outputAddons = [];

        $addons = $optionHelper->get('hubAddons', []);

        if (is_array($addons)) {
            foreach ($addons as $key => $addon) {
                $migratedToFreeList = $this->getMigratedToFree();
                if (in_array($key, $migratedToFreeList)) {
                    continue;
                }

                $data = $addon;
                if (!$outputAddonRealPath) {
                    // Clean secure variables
                    unset($data['addonRealPath']);
                    unset($data['phpFiles']);
                }
                $outputAddons[ $key ] = $data;
            }
        }

        return $outputAddons;
    }

    public function setAddons($addons = [])
    {
        $optionHelper = vchelper('Options');

        return $optionHelper->set('hubAddons', $addons);
    }

    public function updateAddon($key, $prev, $new, $merged)
    {
        $hubBundleHelper = vchelper('HubBundle');
        $hubBundleHelper->setTempBundleFolder(
            VCV_PLUGIN_ASSETS_DIR_PATH . '/temp-bundle-addon-' . $key
        );
        $fileHelper = vchelper('File');
        $result = $fileHelper->copyDirectory(
            $hubBundleHelper->getTempBundleFolder('addons/' . $key),
            $this->getAddonPath($key)
        );
        if (!is_wp_error($result)) {
            $merged = $this->updateAddonData($key, $merged, $prev, $new);
        }

        return $merged;
    }

    protected function updateAddonData($key, $merged, $prev, $new)
    {
        $merged['addonRealPath'] = $this->getAddonPath($key . '/' . $key . '/');
        if (isset($merged['phpFiles']) || isset($new['phpFiles'])) {
            $files = isset($new['phpFiles']) ? $new['phpFiles'] : [];
            $merged['phpFiles'] = [];
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

    /**
     * Get path to addons folder.
     *
     * @param string $key
     *
     * @return string
     */
    public function getAddonPath($key = '')
    {
        $path = VCV_PLUGIN_ASSETS_DIR_PATH . '/addons/' . ltrim($key, '\\/');
        if ($this->isDevAddons()) {
            $path = VCV_PLUGIN_DIR_PATH . 'devAddons/' . ltrim($key, '\\/');
        }

        return apply_filters('vcv:helpers:hub:addons:getAddonPath', $path, $key);
    }

    /**
     * Conditional check if dev addon version is activated.
     *
     * @return bool
     */
    public function isDevAddons()
    {
        $isDevAddons = false;
        if (vcvenv('VCV_ENV_DEV_ADDONS')) {
            $isDevAddons = true;
        }

        return apply_filters('vcv:helpers:hub:isDevAddons', $isDevAddons);
    }

    public function checkAbsUrl($url)
    {
        if (preg_match('/^http/', $url)) {
            return true;
        }

        $pattern = '/' . VCV_PLUGIN_ASSETS_DIRNAME . '\//';
        if (preg_match($pattern, $url)) {
            return true;
        }

        if ($this->isDevAddons()) {
            if (preg_match('/devAddons\//', $url)) {
                return true;
            }

            return false;
        }

        return false;
    }

    public function getAddonUrl($urlPart = '')
    {
        if ($this->isDevAddons()) {
            if ($this->checkAbsUrl($urlPart)) {
                return $urlPart;
            }

            $url = VCV_PLUGIN_URL . 'devAddons/' . $urlPart;
        } else {
            $assetsHelper = vchelper('Assets');
            $url = $assetsHelper->getAssetUrl('/addons/' . ltrim($urlPart, '\\/'));
        }

        return apply_filters('vcv:helpers:hub:addons:getAddonUrl', $url, $urlPart);
    }

    /**
     * Add addon bundle script to footer.
     *
     * @param array $response
     * @param string $addonName
     * @param string $addonTag
     * @param string $scriptName
     *
     * @return mixed
     */
    public function addFooterBundleScriptAddon($response, $addonName, $addonTag, $scriptName = 'element.bundle.js')
    {
        return array_merge(
            (array)$response,
            [
                sprintf(
                    '<script id="vcv-script-%s-fe-bundle" type="text/javascript" src="%s"></script>',
                    $addonName,
                    $this->getAddonUrl($addonTag . '/public/dist/' . $scriptName . '?v=' . VCV_VERSION)
                ),
            ]
        );
    }

    /**
     * @param $addonKey
     *
     * @return string
     */
    public function getAddonRealPath($addonKey)
    {
        $addonPath = $this->getAddonPath($addonKey);

        return $addonPath . '/' . $addonKey . '/';
    }

    public function getAddonPhpFiles($addonKey, $addon)
    {
        $fileHelper = vchelper('File');
        $addonPath = $this->getAddonPath($addonKey);
        $manifestPath = $addonPath . '/manifest.json';
        $addonRealPath = $addonPath . '/' . $addonKey . '/';
        $phpFiles = [];
        if ($fileHelper->isFile($manifestPath)) {
            $manifest = json_decode($fileHelper->getContents($manifestPath), true);
            if (isset($manifest['addons'])) {
                if (isset($manifest['addons'], $manifest['addons'][ $addonKey ], $manifest['addons'][ $addonKey ]['phpFiles'])) {
                    $files = $manifest['addons'][ $addonKey ]['phpFiles'];
                    foreach ($files as $index => $filePath) {
                        $rtrim = rtrim(
                            $addonRealPath,
                            '\\/'
                        );
                        $phpFiles[] = $rtrim . '/' . $filePath;
                    }
                    unset($index, $filePath);
                }
            }
        } elseif (isset($addon['phpFiles'])) {
            $files = $addon['phpFiles'];
            foreach ($files as $index => $filePath) {
                $realPath = isset($addon['addonRealPath']) ? $addon['addonRealPath'] : $addonRealPath;
                $filePath = rtrim(str_replace($realPath, '', $filePath), '\\/');
                $rtrim = rtrim(
                    $addonRealPath,
                    '\\/'
                );
                $phpFiles[] = $rtrim . '/' . $filePath;
            }
            unset($index, $filePath);
        }

        return $phpFiles;
    }

    /**
     * Get list slugs addons that was migrated from free to premium version.
     *
     * @return array
     */
    public function getMigratedToFree()
    {
        return ['maintenanceMode'];
    }

    /**
     * Collect all addon's data from their bundle manifests to the list.
     *
     * @param array $manifests
     *
     * @return array
     * @throws \Exception
     */
    public function readManifests(array $manifests)
    {
        $addons = [];
        $fileHelper = vchelper('File');
        foreach ($manifests as $manifestPath) {
            $manifest = json_decode($fileHelper->getContents($manifestPath), true);
            $dirname = dirname($manifestPath);
            $tag = basename($dirname);
            if (isset($manifest['addons'])) {
                if (isset($manifest['addons'], $manifest['addons'][ $tag ], $manifest['addons'][ $tag ]['phpFiles'])) {
                    if ($this->isDevAddons()) {
                        unset($manifest['addons'][ $tag ]['phpFiles']); // Don't save if load dynamically
                    }
                }
                $addons[ $tag ] = $manifest['addons'][ $tag ];
            }
        }
        unset($manifest, $manifestPath, $tag, $dirname);

        return $addons;
    }
}
