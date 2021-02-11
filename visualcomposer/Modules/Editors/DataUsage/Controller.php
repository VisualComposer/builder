<?php

namespace VisualComposer\Modules\Editors\DataUsage;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class Controller.
 */
class Controller extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\DataUsage\Controller::updateInitialUsage */
        $this->addFilter('vcv:editors:frontend:render', 'updateInitialUsage', 1);
        /** @see \VisualComposer\Modules\Editors\DataUsage\Controller::sendUsageData */
        $this->addEvent('vcv:admin:inited vcv:system:activation:hook vcv:hub:checkForUpdate', 'sendUsageData');
        $this->addFilter('vcv:editor:variables', 'addDataCollectionVariables');
        $this->addFilter('vcv:ajax:dataCollection:submit:adminNonce', 'submitDataCollection');
        $this->addEvent('vcv:saveUsageStats', 'saveUsageStats');
        $this->addEvent('vcv:saveTemplateUsage', 'saveTemplateUsage');
        $this->addEvent('vcv:saveTeaserDownload', 'saveTeaserDownload');
    }

    protected function updateInitialUsage($response, $payload)
    {
        global $post;
        if (!isset($post, $post->ID)) {
            return false;
        }
        $optionsHelper = vchelper('Options');

        $sourceId = $post->ID;

        $editorStartDate = time();
        update_post_meta($sourceId, '_' . VCV_PREFIX . 'editorStartedAt', $editorStartDate);

        $initialUsages = (int)$optionsHelper->get('initialEditorUsage');
        if ($initialUsages) {
            $initialUsages++;
        } else {
            $initialUsages = 1;
        }
        $optionsHelper->set('initialEditorUsage', $initialUsages);

        return $response;
    }

    // NOTE: If you change anything in the data, you also need to change the information table here visualcomposer/resources/views/settings/fields/dataCollectionTable.php
    protected function sendUsageData()
    {
        // @codingStandardsIgnoreLine
        global $wp_version;
        $optionsHelper = vchelper('Options');
        $isAllowed = $optionsHelper->get('settings-itemdatacollection-enabled', false);
        // Send usage data once in a day
        if ($isAllowed && !$optionsHelper->getTransient('lastUsageSend')) {
            $usageStats = [];
            $teaserDownloads = $optionsHelper->get('downloadedContent');
            if (unserialize($teaserDownloads)) {
                $usageStats['downloadedContent'] = unserialize($teaserDownloads);
            }

            $updatedPostsList = $optionsHelper->get('updatedPostsList');
            if ($updatedPostsList && is_array($updatedPostsList)) {
                foreach ($updatedPostsList as $postId) {
                    $hashedId = $this->getHashedKey($postId);
                    $editorUsage = get_post_meta($postId, '_' . VCV_PREFIX . 'editorUsage', true);
                    $elementUsage = get_post_meta($postId, '_' . VCV_PREFIX . 'elementDiffs', true);
                    $templateUsage = get_post_meta($postId, '_' . VCV_PREFIX . 'templates', true);

                    if (unserialize($editorUsage)) {
                        $activeTheme = wp_get_theme();
                        $editorUsageData = unserialize($editorUsage);
                        foreach ($editorUsageData as $key => $value) {
                            $editorUsageData[$key]['phpVersion'] = phpversion();
                            // @codingStandardsIgnoreLine
                            $editorUsageData[$key]['wpVersion'] = $wp_version;
                            $editorUsageData[$key]['vcvVersion'] = VCV_VERSION;
                            $editorUsageData[$key]['activeTheme'] = $activeTheme->get('Name');
                        }

                        $usageStats[$hashedId]['editorUsage'] = $editorUsageData;
                    }
                    if (unserialize($elementUsage)) {
                        $usageStats[$hashedId]['elementUsage'] = unserialize($elementUsage);
                    }
                    if (unserialize($templateUsage)) {
                        $usageStats[$hashedId]['templateUsage'] = unserialize($templateUsage);
                    }
                }
            }

            if (!empty($usageStats)) {
                $data = [
                    'vcv-send-usage-statistics' => 'sendUsageStatistics',
                    'vcv-statistics' => $usageStats,
                    'vcv-hashed-url' => $this->getHashedKey(get_site_url()),
                ];
                $json = json_encode($data);
                $zip = zlib_encode($json, ZLIB_ENCODING_DEFLATE);
                $encodedData = base64_encode($zip);

                $request = wp_remote_post(
                    vcvenv('VCV_HUB_URL'),
                    [
                        'body' => [
                            'vcv-send-usage-statistics' => $encodedData
                        ],
                        'timeout' => 30,
                    ]
                );

                $this->afterDataSendProcess($request['response']['code'], $updatedPostsList);
            }
        }
    }

    protected function afterDataSendProcess($responseCode, $updatedPostsList)
    {
        $optionsHelper = vchelper('Options');
        if ($responseCode === 200) {
            // Set transient that expires in 1 day
            $optionsHelper->setTransient('lastUsageSend', 1, 12 * 3600);
            $optionsHelper->set('lastSentDate', time());

            // Prevent multiple same template sending
            if ($updatedPostsList && is_array($updatedPostsList)) {
                foreach ($updatedPostsList as $postId) {
                    delete_post_meta($postId, '_' . VCV_PREFIX . 'templates');
                    delete_post_meta($postId, '_' . VCV_PREFIX . 'elementDiffs');
                    $allElements = get_post_meta($postId, '_' . VCV_PREFIX . 'allElements', true);
                    update_post_meta($postId, '_' . VCV_PREFIX . 'elements', $allElements);
                }
            }
            $optionsHelper->delete('updatedPostsList');
            $optionsHelper->delete('downloadedContent');
        } else {
            // If failed try one more time after one hour
            $optionsHelper->setTransient('lastUsageSend', 1, 3600);
        }
    }

    /**
     * @param $variables
     * @param $payload
     *
     * @return array
     */
    protected function addDataCollectionVariables($variables, $payload)
    {
        if (isset($payload['sourceId'])) {
            $optionsHelper = vchelper('Options');
            $isEnabled = $optionsHelper->get('settings-itemdatacollection-enabled', null);
            // Have at least 10 initial usages
            $initialUsages = (int)$optionsHelper->get('initialEditorUsage');
            // @codingStandardsIgnoreLine
            $dataCollectionPopupOk = $initialUsages >= 10;

            $variables[] = [
                'key' => 'VCV_SHOW_DATA_COLLECTION_POPUP',
                'value' => is_null($isEnabled) && $dataCollectionPopupOk,
                'type' => 'constant',
            ];
            $variables[] = [
                'key' => 'VCV_DATA_COLLECTION_ENABLED',
                'value' => $isEnabled,
                'type' => 'variable',
            ];
        }

        return $variables;
    }

    /**
     * Send anonymous usage data collection permit
     *
     * @param $response
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return array
     */
    protected function submitDataCollection(
        $response,
        Request $requestHelper,
        Options $optionsHelper
    ) {
        $isChecked = $requestHelper->input('vcv-dataCollection');
        $isChecked = filter_var($isChecked, FILTER_VALIDATE_BOOLEAN);
        $value = $isChecked ? 'itemDataCollectionEnabled' : '';

        $optionsHelper->set('settings-itemdatacollection-enabled', $value);

        return ['status' => true];
    }

    protected function saveUsageStats($response, $payload)
    {
        $sourceId = $payload['sourceId'];
        $hashedId = $this->getHashedKey($sourceId);
        $elements = $payload['elements'];
        $licenseType = $payload['licenseType'];
        $date = time();
        if (!$licenseType) {
            $licenseType = 'Not Activated';
        }
        $optionsHelper = vchelper('Options');
        $updatedPostsList = $optionsHelper->get('updatedPostsList');
        if ($updatedPostsList && is_array($updatedPostsList)) {
            if (!in_array($sourceId, $updatedPostsList)) {
                $updatedPostsList[] = $sourceId;
            }
        } else {
            $updatedPostsList[] = $sourceId;
        }
        $optionsHelper->set('updatedPostsList', $updatedPostsList);
        $editorStartDate = get_post_meta($sourceId, '_' . VCV_PREFIX . 'editorStartedAt', true);
        $editorEndDate = $date;
        $editorUsage = get_post_meta($sourceId, '_' . VCV_PREFIX . 'editorUsage', true);
        if ($editorUsage) {
            $editorUsage = unserialize($editorUsage);
        } else {
            $editorUsage = [];
        }

        // Remove previous usage if data was sent before
        $lastSentDate = $optionsHelper->get('lastSentDate');
        foreach ($editorUsage as $key => $value) {
            if ($value['timestamp'] < $lastSentDate) {
                unset($editorUsage[$key]);
            }
        }
        $editorUsage[] = [
            'pageId' => $hashedId,
            'license' => ucfirst($licenseType),
            'startDate' => $editorStartDate,
            'endDate' => $editorEndDate,
            'timestamp' => time(),
        ];

        $editorUsage = serialize($editorUsage);
        $elements = json_decode($elements, true);
        if ($elements) {
            foreach ($elements as $key => $value) {
                $elements[$key]['pageId'] = $this->getHashedKey($elements[$key]['pageId']);
                $elements[$key]['date'] = $date;
            }
        }

        $previousElements = get_post_meta($sourceId, '_' . VCV_PREFIX . 'elements', true);
        $previousElements = unserialize($previousElements);

        $newElements = $this->getNewElements($previousElements, $elements);
        $newElements = serialize($newElements);
        update_post_meta($sourceId, '_' . VCV_PREFIX . 'elementDiffs', $newElements);

        $elements = serialize($elements);
        update_post_meta($sourceId, '_' . VCV_PREFIX . 'allElements', $elements);
        update_post_meta($sourceId, '_' . VCV_PREFIX . 'editorUsage', $editorUsage);
        // Update editor start time field for multiple save without page refresh
        update_post_meta($sourceId, '_' . VCV_PREFIX . 'editorStartedAt', $date);

        return false;
    }

    protected function getNewElements($previousElements, $elements)
    {
        $newElements = [];
        if ($previousElements) {
            $mergedElements = array_merge($previousElements, $elements);
            foreach ($mergedElements as $key => $value) {
                if (!isset($elements[$key])) {
                    $newElements[$key] = [
                        'pageId' => $value['pageId'],
                        'name' => $value['name'],
                        'count' => $value['count'],
                        'type' => $value['type'],
                        'action' => 'Deleted',
                        'license' => $value['license'],
                        'date' => time(),
                    ];
                }
                if (!isset($previousElements[$key])) {
                    $newElements[$key] = [
                        'pageId' => $value['pageId'],
                        'name' => $value['name'],
                        'count' => $value['count'],
                        'type' => $value['type'],
                        'action' => 'Added',
                        'license' => $value['license'],
                        'date' => time(),
                    ];
                }
                if (isset($elements[$key]) && isset($previousElements[$key])) {
                    $diff = $elements[$key]['count'] - $previousElements[$key]['count'];
                    if ($diff !== 0) {
                        $newElements[$key] = [
                            'pageId' => $value['pageId'],
                            'name' => $value['name'],
                            'count' => abs($diff),
                            'type' => $value['type'],
                            'action' => $diff > 0 ? 'Added' : 'Deleted',
                            'license' => $value['license'],
                            'date' => time(),
                        ];
                    }
                }
            }
        } else {
            $newElements = $elements;
        }

        return $newElements;
    }

    protected function saveTemplateUsage($response, $payload)
    {
        $sourceId = $payload['sourceId'];
        $hashedId = $this->getHashedKey($sourceId);
        $id = $payload['templateId'];
        $editorTemplatesHelper = vchelper('EditorTemplates');
        $optionsHelper = vchelper('Options');
        $template = $editorTemplatesHelper->read($id);
        $templateGroupKey = $template['allData']['templatesGroupsSorted'][0];
        $licenseType = $optionsHelper->get('license-type');
        if (!$licenseType) {
            $licenseType = 'Not Activated';
        }
        $templateType = $editorTemplatesHelper->getGroupName($templateGroupKey);

        $templates = get_post_meta($sourceId, '_' . VCV_PREFIX . 'templates', true);
        $templates = unserialize($templates);
        if (empty($templates)) {
            $templates = [];
        }
        $templates[$id] = [
            'pageId' => $hashedId,
            'name' => $template['allData']['pageTitle']['current'],
            'license' => ucfirst($licenseType),
            'action' => 'Added',
            'date' => time(),
            'type' => $templateType,
        ];
        $templates = serialize($templates);
        update_post_meta($sourceId, '_' . VCV_PREFIX . 'templates', $templates);


        return false;
    }

    protected function saveTeaserDownload($response, $payload)
    {
        $sourceId = $payload['sourceId'];
        if (!$sourceId) {
            $hashedId = 'dashboard';
        } else {
            $hashedId = $this->getHashedKey($sourceId);
        }
        $teaser = isset($payload['template']) ? $payload['template'] : $payload['element'];
        $optionsHelper = vchelper('Options');
        $licenseType = $optionsHelper->get('license-type');
        if (!$licenseType) {
            $licenseType = 'Not Activated';
        }
        $downloadedContent = $optionsHelper->get('downloadedContent', []);
        if (!empty($downloadedContent)) {
            $downloadedContent = unserialize($downloadedContent);
        }

        $teaserId = isset($teaser['id']) ? $teaser['id'] : $teaser['key'];

        if (isset($payload['element'])) {
            $elementData = array_values(
                (array)$optionsHelper->get(
                    'hubTeaserElements',
                    [
                        'All Elements' => [
                            'id' => 'AllElements0',
                            'index' => 0,
                            'title' => 'All Elements',
                            'elements' => [],
                        ],
                    ]
                )
            );
            $allElements = $elementData[0]['elements'];

            foreach ($allElements as $value) {
                if ($value['tag'] === $teaser['tag']) {
                    $teaser['type'] = in_array('free', $value['bundleType']) ? 'Free' : 'Premium';
                }
            }
        }

        if (isset($payload['template'])) {
            $downloadedContent['templateUsage'][$teaserId] = [
                'pageId' => $hashedId,
                'name' => $teaser['name'],
                'license' => ucfirst($licenseType),
                'action' => 'Downloaded',
                'date' => time(),
                'type' => $teaser['type'] === 'hub' ? 'Premium' : 'Free',
            ];
        } else {
            $downloadedContent['elementUsage'][$teaserId] = [
                'pageId' => $hashedId,
                'name' => isset($teaser['name']) ? $teaser['name'] : $teaser['tag'],
                'license' => ucfirst($licenseType),
                'action' => 'Downloaded',
                'date' => time(),
                'type' => $teaser['type'],
            ];
        }

        $downloadedContent = serialize($downloadedContent);
        $optionsHelper->set('downloadedContent', $downloadedContent);

        return false;
    }

    /**
     * Get hashed key
     *
     * @param $key
     *
     * @return false|string
     */
    protected function getHashedKey($key)
    {
        return substr(md5(wp_salt() . $key), 2, 12);
    }
}
