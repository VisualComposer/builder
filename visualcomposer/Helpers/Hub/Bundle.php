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

    public function requestBundleDownload($url)
    {
        $urlHelper = vchelper('Url');
        $fileHelper = vchelper('File');
        $downloadUrl = $urlHelper->query(
            sprintf(
                '%s/download/bundle/lite?plugin=%s',
                rtrim(vcvenv('VCV_HUB_URL'), '\//'),
                VCV_VERSION
            )
        );
        $downloadedArchive = $fileHelper->download($downloadUrl);

        return $downloadedArchive;
    }

    public function getJsonDownloadUrl($requestedData = [])
    {
        $urlHelper = vchelper('Url');
        if (vcvenv('VCV_FIX_CURL_JSON_DOWNLOAD')) {
            $downloadUrl = $urlHelper->query(
                sprintf(
                    '%s/download/json?plugin=%s',
                    rtrim(vcvenv('VCV_HUB_URL'), '\//'),
                    VCV_VERSION
                ),
                $requestedData
            );
        } else {
            $downloadUrl = $urlHelper->query(
                sprintf(
                    '%s/download/json/lite?plugin=%s',
                    rtrim(vcvenv('VCV_HUB_URL'), '\//'),
                    VCV_VERSION
                ),
                $requestedData
            );
        }

        return $downloadUrl;
    }

    public function getElementDownloadUrl($requestedData = [])
    {
        $urlHelper = vchelper('Url');
        $downloadUrl = $urlHelper->query(
            sprintf(
                '%s/download/element?plugin=%s',
                rtrim(vcvenv('VCV_HUB_URL'), '\//'),
                VCV_VERSION
            ),
            $requestedData
        );

        return $downloadUrl;
    }

    public function getAddonDownloadUrl($requestedData = [])
    {
        $urlHelper = vchelper('Url');
        $downloadUrl = $urlHelper->query(
            sprintf(
                '%s/download/addon?plugin=%s',
                rtrim(vcvenv('VCV_HUB_URL'), '\//'),
                VCV_VERSION
            ),
            $requestedData
        );

        return $downloadUrl;
    }

    public function getTemplateDownloadUrl($requestedData = [])
    {
        $urlHelper = vchelper('Url');
        $downloadUrl = $urlHelper->query(
            sprintf(
                '%s/download/template?plugin=%s',
                rtrim(vcvenv('VCV_HUB_URL'), '\//'),
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
        $bundleFolder = rtrim($this->bundlePath, '\//');
        if ($path) {
            $bundleFolder .= '/' . ltrim($path, '\//');
        }

        return $bundleFolder;
    }

    public function setTempBundleFolder($bundlePath)
    {
        $this->bundlePath = $bundlePath;

        return $this->bundlePath;
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

    public function getRemoteBundleJson($url)
    {
        $result = false;
        $loggerHelper = vchelper('Logger');

        $response = wp_remote_get(
            $url,
            [
                'timeout' => 30,
            ]
        );
        if (!vcIsBadResponse($response)) {
            $result = json_decode($response['body'], true);
        } else {
            $messages = [];
            $messages[] = __('Failed to read remote bundle JSON.', 'visualcomposer') . ' #10006';
            if (is_array($response) && isset($response['body'])) {
                // @codingStandardsIgnoreLine
                $resultDetails = json_decode($response['body'], 1);
                if (is_array($resultDetails) && isset($resultDetails['message'])) {
                    $messages[] = $resultDetails['message'] . ' #10026';
                }
                if (is_array($resultDetails) && isset($resultDetails['error'])) {
                    $messages[] = $resultDetails['error'] . ' #10026_1';
                }
            }

            if (is_array($response) && isset($response['body'])) {
                $responseMsg = $response['body'];
            } else {
                $responseMsg = 'not array or no body available';
            }
            $loggerHelper->log(
                implode('. ', $messages),
                [
                    'wp_error' => is_wp_error($response),
                    'response' => $responseMsg,
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
        $hubUpdateHelper = vchelper('HubUpdate');
        $requiredActions = [];
        if (isset($json['actions'])) {
            foreach ($json['actions'] as $key => $value) {
                if (
                    isset($value['action'])
                    && !in_array(
                        $value['action'],
                        ['hubTeaser', 'hubTemplates', 'hubAddons']
                    )
                ) {
                    $requiredActions = $this->loopActionIterator(
                        $value,
                        $requiredActions,
                        $json['actions']
                    );
                }
            }
        }
        $needUpdatePost = $hubUpdateHelper->getUpdatePosts();
        if (empty($needUpdatePost) || !is_array($needUpdatePost)) {
            $needUpdatePost = [];
        } else {
            $changed = false;
            foreach ($needUpdatePost as $id) {
                $post = get_post($id);
                if (!$post) {
                    $changed = true;
                    $key = array_search($id, $needUpdatePost);
                    unset($needUpdatePost[ $key ]);
                    $needUpdatePost = array_values($needUpdatePost);
                }
            }
            if ($changed) {
                $optionsHelper->set('hubAction:updatePosts', $needUpdatePost);
            }
        }
        $requiredActions = array_values($requiredActions);

        return [$needUpdatePost, $requiredActions];
    }

    /**
     * @param $value
     * @param $requiredActions
     * @param $allActions
     * @param bool $forceAutoDownload
     *
     * @return array
     */
    protected function loopActionIterator($value, $requiredActions, $allActions, $forceAutoDownload = false)
    {
        $optionsHelper = vchelper('Options');
        $action = $value['action'];
        if (isset($value['data'])) {
            $data = $value['data'];
        } else {
            $data = '';
        }
        $needUpdatePost = $optionsHelper->get('hubAction:updatePosts', []);
        if (empty($needUpdatePost) || !is_array($needUpdatePost)) {
            $needUpdatePost = [];
        }
        $checksum = isset($value['checksum']) ? $value['checksum'] : '';
        $autoDownload = isset($value['auto_download']) ? $value['auto_download'] : true;
        if ($forceAutoDownload) {
            $autoDownload = true;
        }
        $version = $value['version'];
        $previousVersion = $optionsHelper->get('hubAction:' . $action, '0');
        if ($previousVersion !== '0' && version_compare($version, $previousVersion, '>')) {
            list($needUpdatePost, $requiredActions) = $this->doAction(
                $value,
                $requiredActions,
                $previousVersion,
                $action,
                $needUpdatePost,
                $data,
                $checksum,
                $version
            );
            $requiredActions = $this->checkActionDependencies($requiredActions, $allActions, $data);
        } elseif ($autoDownload && version_compare($version, $previousVersion, '>')) {
            list($needUpdatePost, $requiredActions) = $this->doAction(
                $value,
                $requiredActions,
                $previousVersion,
                $action,
                $needUpdatePost,
                $data,
                $checksum,
                $version
            );
            $requiredActions = $this->checkActionDependencies($requiredActions, $allActions, $data);
        }
        $optionsHelper->set('hubAction:updatePosts', $needUpdatePost);

        return $requiredActions;
    }

    /**
     * @param $value
     * @param $requiredActions
     * @param $previousVersion
     * @param $action
     * @param $needUpdatePost
     * @param $data
     * @param $checksum
     * @param $version
     *
     * @return array
     */
    protected function doAction(
        $value,
        $requiredActions,
        $previousVersion,
        $action,
        $needUpdatePost,
        $data,
        $checksum,
        $version
    ) {
        $optionsHelper = vchelper('Options');
        $downloadHelper = vchelper('HubDownload');
        if (
            isset($value['last_post_update']) && version_compare($value['last_post_update'], $previousVersion, '>')
        ) {
            $posts = vcfilter('vcv:hub:findUpdatePosts:' . $action, [], ['action' => $action]);
            if (!empty($posts) && is_array($posts) && is_array($needUpdatePost)) {
                $needUpdatePost = $posts + $needUpdatePost;
            }
        }
        if (isset($value['name']) && !empty($value['name'])) {
            $actionName = $value['name'];
        } else {
            $actionName = $downloadHelper->getActionName($action);
        }
        $actionData = [
            'name' => $actionName,
            'action' => $action,
            'data' => $data,
            'checksum' => $checksum,
            'version' => $version,
        ];
        $optionNameKey = $action . $actionData['version'];
        $optionsHelper->set('hubA:d:' . md5($optionNameKey), $actionData);
        $requiredActions[ $actionData['action'] ] = [
            'key' => $optionNameKey,
            'name' => $actionData['name'],
            'action' => $actionData['action'],
        ];

        return [$needUpdatePost, $requiredActions];
    }

    /**
     * @param $url
     * @param $result
     * @param \VisualComposer\Helpers\Logger $loggerHelper
     *
     * @return array|mixed|object|\WP_Error
     */
    protected function downloadRemoteBundleJson($url, $result, $loggerHelper)
    {
        $response = vchelper('File')->download($url);
        if (!vcIsBadResponse($response)) {
            // $file /tmp/temp.tmp
            $result = json_decode(file_get_contents($response), true);
        } else {
            $messages = [];
            $messages[] = __('Failed to read remote bundle JSON.', 'visualcomposer') . ' #10006';
            if (is_wp_error($response)) {
                /** @var \WP_Error $result */
                $messages[] = implode('. ', $response->get_error_messages()) . ' #10007';
            } elseif (is_array($response) && isset($response['body'])) {
                // @codingStandardsIgnoreLine
                $resultDetails = json_decode($result['body'], 1);
                if (is_array($resultDetails) && isset($resultDetails['message'])) {
                    $messages[] = $resultDetails['message'] . ' #10026';
                }
            }

            if (is_array($response) && isset($response['body'])) {
                $responseMsg = $response['body'];
            } else {
                $responseMsg = 'not array or no body available';
            }
            $loggerHelper->log(
                implode('. ', $messages),
                [
                    'wp_error' => is_wp_error($response),
                    'response' => $responseMsg,
                ]
            );
        }

        return $result;
    }

    /**
     * @param $requiredActions
     * @param $allActions
     * @param $data
     *
     * @return array
     */
    protected function checkActionDependencies($requiredActions, $allActions, $data)
    {
        if (isset($data['dependencies']) && is_array($data['dependencies']) && !empty($data['dependencies'])) {
            foreach ($data['dependencies'] as $dependency) {
                $dependency = trim($dependency);
                if (isset($allActions[ $dependency ])) {
                    if (array_key_exists($dependency, $requiredActions)) {
                        continue;
                    }
                    $requiredActions = $this->loopActionIterator(
                        $allActions[ $dependency ],
                        $requiredActions,
                        $allActions,
                        true
                    );
                }
            }
        }

        return $requiredActions;
    }
}
