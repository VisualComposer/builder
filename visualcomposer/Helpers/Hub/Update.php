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
        $loggerHelper = vchelper('Logger');
        if (empty($json) || !isset($json['actions'])) {
            $json = $optionsHelper->getTransient('bundleUpdateJson');
            if (!$json) {
                $json = [];
                // Current json is expired, need to update actions
                $savedJson = vcfilter('vcv:hub:update:checkVersion', ['status' => false]);
                if (!vcIsBadResponse($savedJson)) {
                    // Everything is ok need to parse $requiredActions['actions']
                    $json = $savedJson['json'];
                } else {
                    // Logger::add error
                    $loggerHelper->add('Failed to update required actions list');
                }
            }
        }
        list($needUpdatePost, $requiredActions) = vchelper('HubBundle')->loopActions($json);
        $optionsHelper->set('bundleUpdateActions', $requiredActions);
        $optionsHelper->set('bundleUpdatePosts', array_unique($needUpdatePost));

        return $requiredActions;
    }

    /**
     * @param array $json
     * @return bool
     */
    public function checkIsUpdateRequired($json = [])
    {
        if (empty($json) || !isset($json['actions'])) {
            return false;
        }
        list($needUpdatePost, $requiredActions) = vchelper('HubBundle')->loopActions($json);

        return !empty($requiredActions) || !empty($needUpdatePost);
    }
}
