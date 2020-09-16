<?php

namespace VisualComposer\Modules\Hub;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Hub\Update;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;

/**
 * Class UpdateController
 * @package VisualComposer\Modules\Hub
 */
class UpdateController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    /**
     * UpdateController constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Hub\UpdateController::checkForUpdateAction */
        $this->addEvent('vcv:admin:inited vcv:system:activation:hook vcv:hub:checkForUpdate', 'checkForUpdateAction');
        /** @see \VisualComposer\Modules\Hub\UpdateController::checkForUpdate */
        $this->wpAddAction('admin_menu', 'checkForUpdate', 9);
        /** @see \VisualComposer\Modules\Hub\UpdateController::checkForUpdate */
        $this->addFilter('vcv:editors:frontend:render', 'checkForUpdate', -1);

        // System reset
        /** @see \VisualComposer\Modules\Hub\UpdateController::unsetOptions */
        $this->addEvent('vcv:system:activation:hook vcv:system:factory:reset', 'unsetOptions', -1);
    }

    /**
     * @param $response
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\Hub\Update $hubUpdateHelper
     *
     * @param \VisualComposer\Helpers\License $licenseHelper
     *
     * @return mixed
     * @throws \ReflectionException
     */
    protected function checkForUpdateAction(
        $payload,
        Options $optionsHelper,
        Update $hubUpdateHelper,
        License $licenseHelper
    ) {
        return $this->call('checkForUpdate', ['response' => [], 'payload' => $payload]);
    }

    /**
     * @param $response
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\Hub\Update $hubUpdateHelper
     *
     * @param \VisualComposer\Helpers\License $licenseHelper
     * @param \VisualComposer\Helpers\Url $urlHelper
     *
     * @return mixed
     * @throws \ReflectionException
     */
    protected function checkForUpdate(
        $response,
        $payload,
        Options $optionsHelper,
        Update $hubUpdateHelper,
        License $licenseHelper,
        Url $urlHelper
    ) {     // Check for update in case if activated
        if (intval($optionsHelper->getTransient('lastBundleUpdate')) < time()) {
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

            $result = $hubUpdateHelper->checkVersion($payload);
            if (!vcIsBadResponse($result)) {
                $optionsHelper->setTransient('lastBundleUpdate', time() + DAY_IN_SECONDS);
            } else {
                //if failed try one more time after one hour
                $optionsHelper->setTransient('lastBundleUpdate', time() + 3600);
            }
        }

        return $response;
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionsHelper
     */
    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper
            ->delete('bundleUpdateRequired')
            ->delete('bundleUpdateActions')
            ->delete('bundleUpdateJson')
            ->deleteTransient('bundleUpdateJson')
            ->deleteTransient('lastBundleUpdate');
    }
}
