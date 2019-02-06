<?php

namespace VisualComposer\Modules\Editors\DataAjax;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Request;

class RevisionController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\DataAjax\RevisionController::saveRevisionMeta */
        $this->wpAddAction('save_post', 'saveRevisionMeta');
        /** @see \VisualComposer\Modules\Editors\DataAjax\RevisionController::restoreRevision */
        $this->wpAddAction('wp_restore_post_revision', 'restoreRevision');

        /** @see \VisualComposer\Modules\Editors\DataAjax\RevisionController::getRevisionData */
        $this->addFilter(
            'vcv:ajax:getRevisionData:adminNonce',
            'getRevisionData'
        );
    }

    /**
     * Save meta for revision.
     *
     * @param $revisionId
     */
    protected function saveRevisionMeta($revisionId)
    {
        $requestHelper = vchelper('Request');
        $sourceId = $requestHelper->input('post_ID');
        if (empty($sourceId)) {
            $sourceId = $requestHelper->input('vcv-source-id');
        }
        $vcvdata = $requestHelper->input('vcv-data');
        $data = $requestHelper->input('data');

        if (!$vcvdata && $data && isset($data['wp_autosave'])) {
            $sourceId = $data['wp_autosave']['post_id'];
            $vcvdata = $data['wp_autosave']['vcv-data'];
        }

        if (!$vcvdata && $requestHelper->exists('revision')) {
            $sourceId = $requestHelper->input('revision');
            if (intval($sourceId)) {
                $intSourceId = intval($sourceId);
                $vcvdata = get_metadata('post', $intSourceId, VCV_PREFIX . 'pageContent', true);
            } else {
                $vcvdata = false;
            }
        }

        if ($sourceId && wp_is_post_revision($revisionId) === intval($sourceId)) {
            if (false !== $vcvdata) {
                update_metadata('post', $revisionId, VCV_PREFIX . 'pageContent', $vcvdata);
            }
        }
        if ($requestHelper->exists('revision') && wp_is_post_revision($revisionId)) {
            if (!empty($vcvdata)) {
                $latestRevision = wp_get_post_revisions(wp_is_post_revision($revisionId));
                $latestRevisionId = array_values($latestRevision)[0]->ID;
                update_metadata('post', $latestRevisionId, VCV_PREFIX . 'pageContent', $vcvdata);
            }
        }
    }

    /**
     * @param $postId
     * @param $revisionId
     */
    protected function restoreRevision($postId, $revisionId)
    {
        // $post = get_post($postId);
        $revision = get_post($revisionId);
        $pageContent = get_metadata('post', $revision->ID, VCV_PREFIX . 'pageContent', true);

        if (!empty($pageContent)) {
            update_post_meta($postId, VCV_PREFIX . 'pageContent', $pageContent);
        }
    }

    /**
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @return array
     */
    protected function getRevisionData(Request $requestHelper)
    {
        $response = [];
        $sourceId = $requestHelper->input('vcv-source-id');

        // get last auto save
        $postAutoSave = wp_get_post_autosave($sourceId);
        $pageContent = get_post_meta($postAutoSave->ID, 'vcv-pageContent', true);

        $response['pageContent'] = $pageContent;

        return $response;
    }
}
