<?php

namespace VisualComposer\Helpers\Hub;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

class Update implements Helper
{
    /**
     * @param array $json
     * @return array
     */
    public function getRequiredActions($json = [])
    {
        $optionsHelper = vchelper('Options');
        if (empty($json) || !isset($json['actions'])) {
            $json['actions'] = $optionsHelper->get('bundleUpdateActions');
        }
        $requiredActions = [];
        $downloadHelper = vchelper('HubDownload');
        $needUpdatePost = [];
        foreach ($json['actions'] as $key => $value) {
            if (isset($value['action'])) {
                $action = $value['action'];
                $version = $value['version'];
                $value['name'] = isset($value['name']) && !empty($value['name']) ? $value['name'] : $downloadHelper->getActionName($action);
                $previousVersion = $optionsHelper->get('hubAction:' . $action, '0');
                if ($version && version_compare($version, $previousVersion, '>') || !$version) {
                    if (isset($value['last_post_update']) && version_compare($value['last_post_update'], $previousVersion, '>')) {
                        $posts = vcfilter('vcv:hub:findUpdatePosts:' . $action, [], ['action' => $action]);
                        if (!empty($posts) && is_array($posts)) {
                            $needUpdatePost = $posts + $needUpdatePost;
                        }
                    }
                    $requiredActions[] = $value;
                }
            }
        }
        $optionsHelper->set('bundleUpdateActions', $requiredActions);
        $optionsHelper->set('bundleUpdatePosts', array_unique($needUpdatePost));

        return $requiredActions;
    }
}
