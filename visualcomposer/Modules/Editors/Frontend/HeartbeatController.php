<?php

namespace VisualComposer\Modules\Editors\Frontend;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\Nonce;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class HeartbeatController extends Container implements Module
{
    use WpFiltersActions;

    public function __construct()
    {
        $this->wpAddFilter('wp_refresh_nonces', 'addNonce', 11);
        $this->wpAddFilter('heartbeat_settings', 'addMinimalInterval');
    }

    protected function addNonce($response, $data, Nonce $nonceHelper, CurrentUser $currentUser, Request $requestHelper)
    {
        if (isset($response['wp-refresh-post-nonces']) && isset($data['wp-refresh-post-nonces'])) {
            $sourceId = $data['wp-refresh-post-nonces']['post_id'];
            if ($sourceId && $currentUser->wpAll(['edit_post', $sourceId])->get()) {
                $response['wp-refresh-post-nonces']['vcvNonce'] = $nonceHelper->admin();
            }
        }

        return $response;
    }

    protected function addMinimalInterval($settings)
    {
        $settings['minimalInterval'] = 30;

        return $settings;
    }
}
