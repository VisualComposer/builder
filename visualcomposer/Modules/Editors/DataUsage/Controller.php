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
        /** @see \VisualComposer\Modules\Editors\DataUsage\Controller::sendUsageDataAction */
        $this->addEvent('vcv:admin:inited vcv:system:activation:hook vcv:hub:checkForUpdate', 'sendUsageDataAction');
        /** @see \VisualComposer\Modules\Editors\DataUsage\Controller::sendUsageData */
        $this->wpAddAction('admin_menu', 'sendUsageData', 9);
        /** @see \VisualComposer\Modules\Editors\DataUsage\Controller::sendUsageData */
        $this->addFilter('vcv:editors:frontend:render', 'sendUsageData', -1);
        $this->addFilter('vcv:editor:variables', 'addDataCollectionVariables');
        $this->addFilter('vcv:ajax:dataCollection:submit:adminNonce', 'submitDataCollection');
        $this->addFilter('vcv:saveUsageStats', 'saveUsageStats', 10);
        $this->addFilter('vcv:saveTemplateUsage', 'saveTemplateUsage', 10);
        $this->addFilter('vcv:saveTeaserDownload', 'saveTeaserDownload', 10);
    }

    protected function updateInitialUsage()
    {
        global $post;
        if (!isset($post, $post->ID)) {
            return false;
        }
        $optionsHelper = vchelper('Options');

        $sourceId = $post->ID;

        $isAllowed = $optionsHelper->get('settings-itemdatacollection-enabled', 'noData');
        if (!empty($isAllowed)) {
            $editorStartDate = date('Y-m-d H:i:s', time());
            update_post_meta($sourceId, '_' . VCV_PREFIX . 'editorStartAt', $editorStartDate);
        }

        $initialUsages = (int)$optionsHelper->get('initialEditorUsage');
        if ($initialUsages) {
            $initialUsages += 1;
        } else {
            $initialUsages = 1;
        }
        $optionsHelper->set('initialEditorUsage', $initialUsages);

        return false;
    }

    protected function sendUsageDataAction()
    {
        return $this->call('sendUsageData');
    }

    protected function sendUsageData()
    {
        $urlHelper = vchelper('Url');
        $optionsHelper = vchelper('Options');
        $isAllowed = $optionsHelper->get('settings-itemdatacollection-enabled', false);
        // Send usage data once in a day
        if ($isAllowed && $optionsHelper->getTransient('lastUsageSend')) {
            $licenseKey = $optionsHelper->get('license-key');
            $updatedPostsList = $optionsHelper->get('updatedPostsList');
            if ($updatedPostsList && is_array($updatedPostsList)) {
                $usageStats = [];
                $teaserDownloads = $optionsHelper->get('downloadedContent');
                foreach ($updatedPostsList as $postId) {
                    $hashedId = $this->getHashedKey($postId);
                    $editorUsage = get_post_meta($postId, '_' . VCV_PREFIX . 'editorUsage', true);
                    $elementUsage = get_post_meta($postId, '_' . VCV_PREFIX . 'elementCounts', true);
                    $templateUsage = get_post_meta($postId, '_' . VCV_PREFIX . 'templateCounts', true);

                    if ($editorUsage) {
                        $usageStats[$hashedId]['editorUsage'] = unserialize($editorUsage);
                    }
                    if ($elementUsage) {
                        $usageStats[$hashedId]['elementUsage'] = unserialize($elementUsage);
                    }
                    if ($templateUsage) {
                        $usageStats[$hashedId]['templateUsage'] = unserialize($templateUsage);
                    }
                }

                if ($teaserDownloads) {
                    $usageStats['downloadedContent'] = unserialize($teaserDownloads);
                }
                
                $url = $urlHelper->query(
                    vcvenv('VCV_HUB_URL'),
                    [
                        'vcv-send-usage-statistics' => 'sendUsageStatistics',
                        'vcv-license-key' => $licenseKey,
                        'vcv-statistics' => $usageStats,
                    ]
                );

                wp_remote_get(
                    $url,
                    [
                        'timeout' => 30,
                    ]
                );
                // Set transient that expires in 1 day
                $optionsHelper->setTransient('lastUsageSend', 1, 12 * 3600);
                $optionsHelper->set('lastSentDate', time());
                $optionsHelper->delete('updatedPostsList');
            }
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
            $isEnabled = $optionsHelper->get('settings-itemdatacollection-enabled');
            $dataCollectionPopupOk = false;
            $isEnabledStatus = false;
            if ($isEnabled && $isEnabled !== '') {
                $isEnabledStatus = true;
            } elseif (!$isEnabled && $isEnabled !== '') {
                // Have at least 10 initial usages
                $initialUsages = (int)$optionsHelper->get('initialEditorUsage');
                // @codingStandardsIgnoreLine
                $dataCollectionPopupOk = $initialUsages >= 10;
            }

            $variables[] = [
                'key' => 'VCV_SHOW_DATA_COLLECTION_POPUP',
                'value' => $dataCollectionPopupOk,
                'type' => 'constant',
            ];
            $variables[] = [
                'key' => 'VCV_DATA_COLLECTION_ENABLED',
                'value' => $isEnabledStatus,
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

    protected function saveUsageStats($data)
    {
        $sourceId = $data['sourceId'];
        $hashedId = $this->getHashedKey($sourceId);
        $elementCounts = $data['elementCounts'];
        $licenseType = $data['licenseType'];
        if (!$licenseType) {
            $licenseType = 'Not Activated';
        }
        $optionsHelper = vchelper('Options');
        $updatedPostsList = $optionsHelper->get('updatedPostsList');
        if ($updatedPostsList && is_array($updatedPostsList)) {
            if (!in_array($sourceId, $updatedPostsList)) {
                array_push($updatedPostsList, $sourceId);
            }
        } else {
            $updatedPostsList = array($sourceId);
        }
        $optionsHelper->set('updatedPostsList', $updatedPostsList);
        $editorStartDate = get_post_meta($sourceId, '_' . VCV_PREFIX . 'editorStartAt', true);
        $editorEndDate = date('Y-m-d H:i:s', time());
        $editorUsage = get_post_meta($sourceId, '_' . VCV_PREFIX . 'editorUsage', true);
        if ($editorUsage) {
            $editorUsage = unserialize($editorUsage);
        } else {
            $editorUsage = array();
        }

        // Remove previous usage if data was sent before
        $lastSentDate = $optionsHelper->get('lastSentDate');
        foreach ($editorUsage as $key => $value) {
            if ($value['timestamp'] < $lastSentDate) {
                unset($editorUsage[$key]);
            }
        }
        array_push($editorUsage, array(
            'pageId' => $hashedId,
            'license' => ucfirst($licenseType),
            'startDate' => $editorStartDate,
            'endDate' => $editorEndDate,
            'timestamp' => time(),
        ));

        $editorUsage = serialize($editorUsage);
        $elementCounts = json_decode($elementCounts, true);
        foreach ($elementCounts as $key => $value) {
            $elementCounts[$key]['pageId'] = $this->getHashedKey($elementCounts[$key]['pageId']);
        }
        $elementCounts = serialize($elementCounts);
        update_post_meta($sourceId, '_' . VCV_PREFIX . 'editorUsage', $editorUsage);
        // Update editor start time field for multiple save without page refresh
        update_post_meta($sourceId, '_' . VCV_PREFIX . 'editorStartAt', date('Y-m-d H:i:s', time()));
        update_post_meta($sourceId, '_' . VCV_PREFIX . 'elementCounts', $elementCounts);

        return false;
    }

    protected function saveTemplateUsage($data)
    {
        $sourceId = $data['sourceId'];
        $hashedId = $this->getHashedKey($sourceId);
        $id = $data['templateId'];
        $editorTemplatesHelper = vchelper('EditorTemplates');
        $optionsHelper = vchelper('Options');
        $template = $editorTemplatesHelper->read($id);
        $licenseType = $optionsHelper->get('license-type');
        if (!$licenseType) {
            $licenseType = 'Not Activated';
        }
        $templateType = $editorTemplatesHelper->getTemplateType($id);

        $templateCounts = get_post_meta($sourceId, '_' . VCV_PREFIX . 'templateCounts', true);
        $templateCounts = unserialize($templateCounts);
        if (empty($templateCounts)) {
            $templateCounts = [];
        }
        $templateCounts[$id] = [
            'pageId' => $hashedId,
            'name' => $template['allData']['pageTitle']['current'],
            'license' => ucfirst($licenseType),
            'action' => 'Added',
            'date' => date('Y-m-d H:i:s', time()),
            'type' => $templateType,
        ];
        $templateCounts = serialize($templateCounts);
        update_post_meta($sourceId, '_' . VCV_PREFIX . 'templateCounts', $templateCounts);


        return false;
    }

    protected function saveTeaserDownload($data)
    {
        $sourceId = $data['sourceId'];
        if (!$sourceId) {
            $sourceId = 'dashboard';
        }
        $hashedId = $this->getHashedKey($sourceId);
        $teaser = isset($data['template']) ? $data['template'] : $data['element'];
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

        if (isset($data['element'])) {
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

        if (isset($data['template'])) {
            $downloadedContent['templateUsage'][$teaserId] = [
                'pageId' => $hashedId,
                'name' => $teaser['name'],
                'license' => ucfirst($licenseType),
                'action' => 'Downloaded',
                'date' => date('Y-m-d H:i:s', time()),
                'type' => $teaser['type'] === 'hub' ? 'Premium' : 'Free',
            ];
        } else {
            $downloadedContent['elementUsage'][$teaserId] = [
                'pageId' => $hashedId,
                'name' => isset($teaser['name']) ? $teaser['name'] : $teaser['tag'],
                'license' => ucfirst($licenseType),
                'action' => 'Downloaded',
                'date' => date('Y-m-d H:i:s', time()),
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
        $salt = 'vcvSourceId';

        return substr(md5($salt . $key), 2, 12);
    }
}
