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

        $isAllowed = $optionsHelper->get('settings-itemdatacollection-enabled', false);
        if ($isAllowed) {
            $editorStartDate = date('Y-m-d H:i:s', time());
            update_post_meta($sourceId, '_' . VCV_PREFIX . 'editor-start-at', $editorStartDate);
        }

        $initialUsages = (int)$optionsHelper->get('initial-editor-usage');
        if ($initialUsages) {
            $initialUsages += 1;
        } else {
            $initialUsages = 1;
        }
        $optionsHelper->set('initial-editor-usage', $initialUsages);

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
        if ($isAllowed && intval($optionsHelper->getTransient('lastBundleUpdate')) < time()) {
            $licenseKey = $optionsHelper->get('license-key');
            $licenseType = $optionsHelper->get('license-type');
            $updatedPostsList = $optionsHelper->get('updated-posts-list');
            if ($updatedPostsList && is_array($updatedPostsList)) {
                $usageStats = [];
                $teaserDownloads = $optionsHelper->get('downloaded-content');
                foreach ($updatedPostsList as $postId) {
                    $editorUsage = get_post_meta($postId, '_' . VCV_PREFIX . 'editor-usage', true);
                    $elementUsage = get_post_meta($postId, '_' . VCV_PREFIX . 'element-counts', true);
                    $templateUsage = get_post_meta($postId, '_' . VCV_PREFIX . 'template-counts', true);

                    $usageStats[$postId] = array(
                        'source-id' => $postId,
                        'license-type' => $licenseType,
                        'editor-usage' => unserialize($editorUsage),
                        'element-usage' => unserialize($elementUsage),
                        'template-usage' => unserialize($templateUsage),
                    );
                }

                $usageStats['downloaded-content'] = unserialize($teaserDownloads);

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
                $optionsHelper->set('last-sent-date', time());
                $optionsHelper->delete('updated-posts-list');
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
            $isEnabled = $optionsHelper->get('settings-itemdatacollection-enabled', null);
            if (isset($isEnabled)) {
                $isEnabled = true;
            }
            // Have at least 10 initial usages
            $initialUsages = (int)$optionsHelper->get('initial-editor-usage');
            // @codingStandardsIgnoreLine
            $dataCollectionPopupOk = !$isEnabled && $initialUsages >= 10;

            $variables[] = [
                'key' => 'VCV_SHOW_DATA_COLLECTION_POPUP',
                'value' => $dataCollectionPopupOk,
                'type' => 'constant',
            ];
            $variables[] = [
                'key' => 'VCV_DATA_COLLECTION_ENABLED',
                'value' => $isEnabled,
                'type' => 'constant',
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
        $sourceId = $data['source-id'];
        $elementCounts = $data['element-counts'];
        $licenseType = $data['license-type'];
        $optionsHelper = vchelper('Options');
        $updatedPostsList = $optionsHelper->get('updated-posts-list');
        if ($updatedPostsList && is_array($updatedPostsList)) {
            if (!in_array($sourceId, $updatedPostsList)) {
                array_push($updatedPostsList, $sourceId);
            }
        } else {
            $updatedPostsList = array($sourceId);
        }
        $optionsHelper->set('updated-posts-list', $updatedPostsList);
        $editorStartDate = get_post_meta($sourceId, '_' . VCV_PREFIX . 'editor-start-at', true);
        $editorEndDate = date('Y-m-d H:i:s', time());
        $editorUsage = get_post_meta($sourceId, '_' . VCV_PREFIX . 'editor-usage', true);
        if ($editorUsage) {
            $editorUsage = unserialize($editorUsage);
        } else {
            $editorUsage = array();
        }

        // Remove previous usage if data was sent before
        $lastSentDate = $optionsHelper->get('last-sent-date');
        foreach ($editorUsage as $key => $value) {
            if ($value['timestamp'] < $lastSentDate) {
                unset($editorUsage[$key]);
            }
        }
        array_push($editorUsage, array(
            'page-id' => $sourceId,
            'license' => $licenseType,
            'start-date' => $editorStartDate,
            'end-date' => $editorEndDate,
            'timestamp' => time(),
        ));

        $editorUsage = serialize($editorUsage);
        $elementCounts = json_decode($elementCounts, true);
        $elementCounts = serialize($elementCounts);
        update_post_meta($sourceId, '_' . VCV_PREFIX . 'editor-usage', $editorUsage);
        // Update editor start time field for multiple save without page refresh
        update_post_meta($sourceId, '_' . VCV_PREFIX . 'editor-start-at', date('Y-m-d H:i:s', time()));
        update_post_meta($sourceId, '_' . VCV_PREFIX . 'element-counts', $elementCounts);

        return false;
    }

    protected function saveTemplateUsage($data)
    {
        $sourceId = $data['source-id'];
        $id = $data['template-id'];
        $templateUniqueId = get_post_meta($id, '_' . VCV_PREFIX . 'id', true);
        $template = $data['template'];
        $optionsHelper = vchelper('Options');
        $licenseType = $optionsHelper->get('license-type');
        $allTemplates = array_values(
            (array)$optionsHelper->get(
                'hubTeaserTemplates',
                []
            )
        );

        $templateData = [];
        foreach ($allTemplates as $value) {
            if ($value['id'] === $templateUniqueId) {
                $templateData = $value;
            }
        }
        if (empty($templateData)) {
            $templateData['templateType'] = 'custom';
        }
        $templateType = $this->getTemplateType($templateData);

        $templateCounts = get_post_meta($sourceId, '_' . VCV_PREFIX . 'template-counts', true);
        $templateCounts = unserialize($templateCounts);
        if (empty($templateCounts)) {
            $templateCounts = [];
        }
        $templateCounts[$id] = [
            'page-id' => $sourceId,
            'name' => $template['allData']['pageTitle']['current'],
            'license' => $licenseType,
            'action' => 'added',
            'date' => date('Y-m-d H:i:s', time()),
            'type' => $templateType,
        ];
        $templateCounts = serialize($templateCounts);
        update_post_meta($sourceId, '_' . VCV_PREFIX . 'template-counts', $templateCounts);


        return false;
    }

    protected function getTemplateType($templateData)
    {
        $type = '';
        $typeKey = $templateData['templateType'];
        switch ($typeKey) {
            case $typeKey === 'hubHeader':
                $type = 'Header';
                break;
            case $typeKey === 'hubFooter':
                $type = 'Footer';
                break;
            case $typeKey === 'hubBlock':
                $type = 'Block';
                break;
            case $typeKey === 'hubSidebar':
                $type = 'Sidebar';
                break;
            case $typeKey === 'custom':
                $type = 'Custom Template';
                break;
            case $typeKey === 'hub':
                if (in_array('free', $templateData['bundleType'])) {
                    $type = 'Free Template';
                } else {
                    $type = 'Premium Template';
                }
                break;
        }

        return $type;
    }

    protected function saveTeaserDownload($data)
    {
        $sourceId = $data['source-id'];
        if (!$sourceId) {
            $sourceId = 'dashboard';
        }
        $teaser = isset($data['template']) ? $data['template'] : $data['element'];
        $optionsHelper = vchelper('Options');
        $licenseType = $optionsHelper->get('license-type');
        $downloadedContent = $optionsHelper->get('downloaded-content', []);
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
                    $teaser['type'] = in_array('free', $value['bundleType']) ? 'free' : 'premium';
                }
            }
        }

        if (isset($data['template'])) {
            $downloadedContent['template-usage'][$teaserId] = [
                'page-id' => $sourceId,
                'name' => $teaser['name'],
                'license' => $licenseType,
                'action' => 'downloaded',
                'date' => date('Y-m-d H:i:s', time()),
                'type' => $teaser['type'] === 'hub' ? 'premium' : 'free',
            ];
        } else {
            $downloadedContent['element-usage'][$teaserId] = [
                'page-id' => $sourceId,
                'name' => isset($teaser['name']) ? $teaser['name'] : $teaser['tag'],
                'license' => $licenseType,
                'action' => 'downloaded',
                'date' => date('Y-m-d H:i:s', time()),
                'type' => $teaser['type'],
            ];
        }

        $downloadedContent = serialize($downloadedContent);
        $optionsHelper->set('downloaded-content', $downloadedContent);

        return false;
    }
}
