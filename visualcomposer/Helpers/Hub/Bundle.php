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
    protected $bundlePath;

    public function __construct()
    {
        $this->bundlePath = VCV_PLUGIN_ASSETS_DIR_PATH . '/temp-bundle';
    }

    public function requestBundleDownload()
    {
        $urlHelper = vchelper('Url');
        $fileHelper = vchelper('File');
        $downloadUrl = $urlHelper->query(
            sprintf(
                '%s/download/bundle/lite?plugin=%s',
                VCV_HUB_URL,
                VCV_VERSION
            )
        );
        $downloadedArchive = $fileHelper->download($downloadUrl);

        return $downloadedArchive;
    }

    public function getJsonDownloadUrl($requestedData = [])
    {
        $urlHelper = vchelper('Url');
        $downloadUrl = $urlHelper->query(
            sprintf(
                '%s/download/json/lite?plugin=%s',
                VCV_HUB_URL,
                VCV_VERSION
            ),
            $requestedData
        );

        return $downloadUrl;
    }

    public function getJsonDownloadVersionUrl($requestedData = [])
    {
        $urlHelper = vchelper('Url');
        $downloadUrl = $urlHelper->query(
            sprintf(
                '%s/download/json/version?plugin=%s',
                VCV_HUB_URL,
                VCV_VERSION
            ),
            $requestedData
        );

        return $downloadUrl;
    }

    public function getJsonDownloadBundleUrl($requestedData = [])
    {
        $urlHelper = vchelper('Url');
        $downloadUrl = $urlHelper->query(
            sprintf(
                '%s/download/json/bundle?plugin=%s',
                VCV_HUB_URL,
                VCV_VERSION
            ),
            $requestedData
        );

        return $downloadUrl;
    }

    public function unzipDownloadedBundle($bundle)
    {
        $fileHelper = vchelper('File');
        $result = $fileHelper->unzip($bundle, $this->getTempBundleFolder(), true);

        return $result;
    }

    public function getTempBundleFolder($path = '')
    {
        $bundleFolder = $this->bundlePath;
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

    /**
     * Get remote version
     *
     * @return bool|array
     */
    public function getRemoteVersionInfo()
    {
        $urlHelper = vchelper('Url');
        $versionUrl = $urlHelper->query(
            sprintf(
                '%s/download/json/lite?plugin=%s',
                VCV_HUB_URL,
                VCV_VERSION
            )
        );
        $request = wp_remote_get(
            $versionUrl,
            [
                'timeout' => 10,
            ]
        );
        if (!vcIsBadResponse($request)) {
            return $request['body'];
        }

        return false;
    }

    public function getRemoteBundleJson($url)
    {
        $result = false;
        $loggerHelper = vchelper('Logger');
        if ($url && !is_wp_error($url)) {
            $response = wp_remote_get(
                $url,
                [
                    'timeout' => 10,
                ]
            );
            if (!vcIsBadResponse($response)) {
                $result = json_decode($response['body'], true);
            } else {
                if (is_wp_error($response)) {
                    /** @var \WP_Error $result */
                    $resultDetails = $response->get_error_message();
                } else {
                    $resultDetails = $response['body'];
                }

                $loggerHelper->log(
                    __('Failed read remote bundle json', 'vcwb'),
                    [
                        'result' => $resultDetails,
                    ]
                );
            }
        } else {
            if (is_wp_error($url)) {
                /** @var \WP_Error $url */
                $resultDetails = $url->get_error_message();
            } else {
                $resultDetails = $url;
            }

            $loggerHelper->log(
                __('Failed to fetch remote bundle json', 'vcwb'),
                [
                    'result' => $resultDetails,
                    'wp_error' => is_wp_error($url),
                ]
            );
        }

        return $result;
    }


    /**
     * @param $json
     *
     * @return array
     */
    public function loopActions($json)
    {
        $optionsHelper = vchelper('Options');
        $downloadHelper = vchelper('HubDownload');
        $needUpdatePost = [];
        $requiredActions = [];
        if (isset($json['actions'])) {
            foreach ($json['actions'] as $key => $value) {
                if (isset($value['action'])) {
                    list($needUpdatePost, $requiredActions) = $this->loopActionIterator($value, $optionsHelper, $needUpdatePost, $downloadHelper, $requiredActions);
                }
            }
        }
        return array($needUpdatePost, $requiredActions);
    }

    /**
     * @param $value
     * @param $optionsHelper
     * @param $needUpdatePost
     * @param Download $downloadHelper
     * @param $requiredActions
     * @return array
     */
    protected function loopActionIterator($value, $optionsHelper, $needUpdatePost, $downloadHelper, $requiredActions)
    {
        $action = $value['action'];
        $data = $value['data'];
        $checksum = isset($value['checksum']) ? $value['checksum'] : '';
        $version = $value['version'];
        $previousVersion = $optionsHelper->get('hubAction:' . $action, '0');
        if ($version && version_compare($version, $previousVersion, '>') || !$version) {
            if (isset($value['last_post_update']) &&
                version_compare($value['last_post_update'], $previousVersion, '>')
            ) {
                $posts = vcfilter('vcv:hub:findUpdatePosts:' . $action, [], ['action' => $action]);
                if (!empty($posts) && is_array($posts)) {
                    $needUpdatePost = $posts + $needUpdatePost;
                }
            }
            $actionData = [
                'name' => isset($value['name']) && !empty($value['name']) ? $value['name'] : $downloadHelper->getActionName($action),
                'action' => $action,
                'data' => $data,
                'checksum' => $checksum,
                'version' => $version,
            ];
            $optionNameKey = $action . $actionData['version'];
            $optionsHelper->set('hubAction:download:' . $optionNameKey, $actionData);
            $requiredActions[] = [
                'key' => $optionNameKey,
                'name' => $actionData['name'],
                'action' => $actionData['action'],
            ];
        }

        return array($needUpdatePost, $requiredActions);
    }
}
