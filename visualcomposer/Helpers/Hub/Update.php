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
     *
     * @return array
     * @throws \ReflectionException
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
                $savedJson = $this->checkVersion();
                if (!vcIsBadResponse($savedJson)) {
                    // Everything is ok need to parse $requiredActions['actions']
                    $json = $savedJson['json'];
                } else {
                    $loggerHelper->log('Failed to update required actions list #10012');
                }
            }
        }
        list($needUpdatePost, $requiredActions) = vchelper('HubBundle')->loopActions($json);
        $reRenderPosts = array_unique($needUpdatePost);
        $requiredActions = vchelper('Data')->arrayDeepUnique($requiredActions);
        $postsActions = [];
        if (count($reRenderPosts) > 0) {
            $tempPosts = $this->createPostUpdateObjects($reRenderPosts);
            $postsActions = $tempPosts[0]['data'];
        }

        return ['actions' => $requiredActions, 'posts' => $postsActions];
    }

    public function createPostUpdateObjects(array $posts)
    {
        $result = [];
        $frontendHelper = vchelper('Frontend');
        foreach ($posts as $id) {
            $post = get_post($id);
            if (!is_null($post)) {
                $result[] = [
                    'id' => $id,
                    'editableLink' => $frontendHelper->getEditableUrl($id),
                    'name' => get_the_title($id),
                ];
            }
        }

        return [['action' => 'updatePosts', 'data' => $result]];
    }

    /**
     * @param array $json
     *
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

    /**
     * Remove trashed posts
     *
     * @return array
     */
    public function getUpdatePosts()
    {
        $optionsHelper = vchelper('Options');
        $updatePosts = $optionsHelper->get('hubAction:updatePosts', []);
        $canUpdate = [];

        foreach ($updatePosts as $updatePost) {
            $post = get_post($updatePost);
            // @codingStandardsIgnoreLine
            if ($post && $post->post_status !== 'trash') {
                $canUpdate[] = $updatePost;
            }
        }

        return $canUpdate;
    }

    public function getVariables()
    {
        $urlHelper = vchelper('Url');
        $utmHelper = vchelper('Utm');
        $licenseHelper = vchelper('License');
        $currentUserAccessHelper = vchelper('AccessCurrentUser');
        $editorPostTypeHelper = vchelper('AccessEditorPostType');
        $requestHelper = vchelper('Request');

        if (vchelper('Options')->get('bundleUpdateRequired')) {
            $requiredActions = vchelper('HubUpdate')->getRequiredActions();
        } else {
            $requiredActions = [
                'actions' => [],
                'posts' => [],
            ];
        }
        $variables[] = [
            'key' => 'VCV_UPDATE_ACTIONS',
            'value' => $requiredActions,
            'type' => 'constant',
        ];
        $variables[] = [
            'key' => 'VCV_UPDATE_PROCESS_ACTION_URL',
            'value' => $urlHelper->adminAjax(['vcv-action' => 'hub:action:adminNonce']),
            'type' => 'constant',
        ];
        $variables[] = [
            'key' => 'VCV_UPDATE_SKIP_POST_URL',
            'value' => $urlHelper->adminAjax(['vcv-action' => 'hub:action:postUpdate:skipPost:adminNonce']),
            'type' => 'constant',
        ];
        $variables[] = [
            'key' => 'VCV_UPDATE_WP_BUNDLE_URL',
            'value' => $urlHelper->to('public/dist/wp.bundle.js') . '?v=' . VCV_VERSION,
            'type' => 'constant',
        ];
        $variables[] = [
            'key' => 'VCV_UPDATE_VENDOR_URL',
            'value' => $urlHelper->to('public/dist/vendor.bundle.js') . '?v=' . VCV_VERSION,
            'type' => 'constant',
        ];
        $variables[] = [
            'key' => 'VCV_UPDATE_GLOBAL_VARIABLES_URL',
            'value' => $urlHelper->adminAjax(
                ['vcv-action' => 'elements:globalVariables:adminNonce']
            ),
            'type' => 'constant',
        ];
        $variables[] = [
            'key' => 'VCV_PLUGIN_VERSION',
            'value' => VCV_VERSION,
            'type' => 'constant',
        ];
        $variables[] = [
            'key' => 'VCV_UPDATE_URL',
            'value' => admin_url('admin.php?page=vcv-update'),
            'type' => 'constant',
        ];
        if ($currentUserAccessHelper->wpAll('edit_pages')->get() && $editorPostTypeHelper->isEditorEnabled('page')) {
            $variables[] = [
                'key' => 'VCV_CREATE_NEW_URL',
                'value' => vcfilter('vcv:about:postNewUrl', 'post-new.php?post_type=page&vcv-action=frontend'),
                'type' => 'constant',
            ];
            $variables[] = [
                'key' => 'VCV_CREATE_NEW_TEXT',
                'value' => __('Create a new page', 'visualcomposer'),
                'type' => 'constant',
            ];
        } elseif (
            $currentUserAccessHelper->wpAll('edit_posts')->get()
            && $editorPostTypeHelper->isEditorEnabled('post')
        ) {
            $variables[] = [
                'key' => 'VCV_CREATE_NEW_URL',
                'value' => vcfilter('vcv:about:postNewUrl', 'post-new.php?vcv-action=frontend'),
                'type' => 'constant',
            ];

            $variables[] = [
                'key' => 'VCV_CREATE_NEW_TEXT',
                'value' => __('Create a new post', 'visualcomposer'),
                'type' => 'constant',
            ];
        }

        $vcvRef = $requestHelper->input('vcv-ref');
        if (!$vcvRef) {
            // default UTMs if page opened directly without vcv-ref
            $vcvRef = 'activatepremium';
        }

        // Used in vcv-activate-license page
        $variables[] = [
            'key' => 'vcvGoPremiumUrlWithRef',
            'value' => $utmHelper->premiumBtnUtm($vcvRef),
            'type' => 'variable',
        ];

        $variables[] = [
            'key' => 'VCV_SUPPORT_URL',
            'value' => vcvenv('VCV_SUPPORT_URL'),
            'type' => 'constant',
        ];

        $variables[] = [
            'key' => 'VCV_MANAGE_OPTIONS',
            'value' => vchelper('AccessCurrentUser')->wpAll('manage_options')->get(),
            'type' => 'constant',
        ];

        $licenseType = $licenseHelper->getType();
        $variables[] = [
            'key' => 'VCV_LICENSE_TYPE',
            'value' => $licenseType ? $licenseType : '',
            'type' => 'constant',
        ];

        if (defined('VCV_AUTHOR_API_KEY')) {
            $variables[] = [
                'key' => 'VCV_AUTHOR_API_KEY',
                'value' => VCV_AUTHOR_API_KEY,
                'type' => 'constant',
            ];
        }

        return $variables;
    }

    /**
     * @param array $payload
     *
     * @return array|bool
     * @throws \ReflectionException
     */
    public function checkVersion($payload = [])
    {
        $hubBundleHelper = vchelper('HubBundle');
        $tokenHelper = vchelper('Token');
        if (is_array($payload) && isset($payload['token'])) {
            $token = $payload['token'];
        } else {
            $token = $tokenHelper->getToken();
        }
        if ($token) {
            $url = $hubBundleHelper->getJsonDownloadUrl(['token' => $token]);
            $json = $hubBundleHelper->getRemoteBundleJson($url);
            if ($json) {
                return $this->processJson($json);
            }
        }

        return ['status' => false];
    }

    /**
     * @param $json
     *
     * @return bool|array
     * @throws \ReflectionException
     */
    protected function processJson($json)
    {
        if (is_array($json) && isset($json['actions'])) {
            $this->processTeasers($json['actions']);
            $optionsHelper = vchelper('Options');
            $hubUpdateHelper = vchelper('HubUpdate');
            if ($hubUpdateHelper->checkIsUpdateRequired($json)) {
                $optionsHelper->set('bundleUpdateRequired', 1);
                // Save in database cache for 30m
                $optionsHelper->setTransient('bundleUpdateJson', $json, 1800);
            }

            return ['status' => true, 'json' => $json];
        }

        return false;
    }

    protected function processTeasers($actions)
    {

        if (isset($actions['hubTeaser'])) {
            vcevent('vcv:hub:process:action:hubTeaser', ['teasers' => $actions['hubTeaser']]);
            $optionsHelper = vchelper('Options');
            $optionsHelper->set('hubAction:hubTeaser', $actions['hubTeaser']['version']);
        }
        if (isset($actions['hubAddons'])) {
            vcevent('vcv:hub:process:action:hubAddons', ['teasers' => $actions['hubAddons']]);
        }
        if (isset($actions['hubTemplates'])) {
            vcevent('vcv:hub:process:action:hubTemplates', ['teasers' => $actions['hubTemplates']]);
        }
    }
}
