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
                    // TODO: Errors
                    // Logger::add error
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
        $currentUserAccessHelper = vchelper('AccessCurrentUser');
        $editorPostTypeHelper = vchelper('AccessEditorPostType');
        $requiredHelper = vchelper('Request');

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
            'key' => 'VCV_STAGING_AVAILABLE',
            'value' => $this->isUrlDev(VCV_PLUGIN_URL),
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
                'value' => __('Create new page', 'visualcomposer'),
                'type' => 'constant',
            ];
        } elseif ($currentUserAccessHelper->wpAll('edit_posts')->get()
            && $editorPostTypeHelper->isEditorEnabled(
                'post'
            )
        ) {
            $variables[] = [
                'key' => 'VCV_CREATE_NEW_URL',
                'value' => vcfilter('vcv:about:postNewUrl', 'post-new.php?vcv-action=frontend'),
                'type' => 'constant',
            ];

            $variables[] = [
                'key' => 'VCV_CREATE_NEW_TEXT',
                'value' => __('Create new post', 'visualcomposer'),
                'type' => 'constant',
            ];
        }

        $vcvRef = $requiredHelper->input('vcv-ref');
        if (!$vcvRef) {
            $vcvRef = 'getting-started';
        }

        $variables[] = [
            'key' => 'VCV_PREMIUM_URL',
            'value' => admin_url('admin.php?page=vcv-go-premium&vcv-ref=' . $vcvRef),
            'type' => 'constant',
        ];

        $variables[] = [
            'key' => 'VCV_GO_PREMIUM_URL',
            'value' => $utmHelper->get($vcvRef),
            'type' => 'constant',
        ];

        $variables[] = [
            'key' => 'VCV_MANAGE_OPTIONS',
            'value' => vchelper('AccessCurrentUser')->wpAll('manage_options')->get(),
            'type' => 'constant',
        ];

        $variables[] = [
            'key' => 'VCV_ACTIVATE_FREE_URL',
            'value' => admin_url('admin.php?page=vcv-activate-free&vcv-ref=' . $vcvRef),
            'type' => 'constant',
        ];

        return $variables;
    }

    /**
     * @return array|bool
     * @throws \ReflectionException
     */
    public function checkVersion()
    {
        $hubBundleHelper = vchelper('HubBundle');
        $tokenHelper = vchelper('Token');
        $token = $tokenHelper->getToken();
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
                $optionsHelper->set('bundleUpdateRequired', true);
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
        }
        if (isset($actions['hubAddons'])) {
            vcevent('vcv:hub:process:action:hubAddons', ['teasers' => $actions['hubAddons']]);
        }
        if (isset($actions['hubTemplates'])) {
            vcevent('vcv:hub:process:action:hubTemplates', ['teasers' => $actions['hubTemplates']]);
        }
    }

    //@codingStandardsIgnoreStart
    protected function isUrlDev($url)
    {
        // Codestyle is disabled due to count of comparisons
        $originalUrl = $url;
        $url = strtolower($url);
        $url = preg_replace('(\/wp-content\/.*)', '', $url);
        $parsedUrl = parse_url($url);
        if (empty($parsedUrl)) {
            return true;
        }
        if (isset($parsedUrl['port']) && !empty($parsedUrl['port'])) {
            return true;
        }
        $pathPattern = '/vc|wordpress|demo|test|staging|stage|dev|sandbox|local|localhost|beta|temp|slot|vcwb|visual\-composer|visualcomposer/';
        if (isset($parsedUrl['path']) && preg_match($pathPattern, $parsedUrl['path'])) {
            return true;
        }

        if (!isset($parsedUrl['host'])) {
            return false;
        }

        $localhostPattern = '/^(((.*)\.localhost)|(localhost)|(((.*)\.)?localhost\.(.*)))$/';
        if (preg_match($localhostPattern, $parsedUrl['host'])) {
            return true;
        }
        $localPattern = '/^(((.*)\.local)|(local)|(((.*)\.)?local\.(.*)))$/';
        if (preg_match($localPattern, $parsedUrl['host'])) {
            return true;
        }
        $betaPattern = '/^(((.*)\.beta)|(beta)|(((.*)\.)?beta\.(.*)))$/';
        if (preg_match($betaPattern, $parsedUrl['host'])) {
            return true;
        }
        $tempPattern = '/^(((.*)\.temp)|(temp)|(((.*)\.)?temp\.(.*)))$/';
        if (preg_match($tempPattern, $parsedUrl['host'])) {
            return true;
        }
        $vcPattern = '/^(((.*)\.vc(\d?))|(vc)|(((.*)\.)?vc(\d?)\.(.*)))$/';
        if (preg_match($vcPattern, $parsedUrl['host'])) {
            return true;
        }
        $stagePattern = '/^(((.*)\.stage(\d?))|(stage)|(((.*)\.)?stage(\d?)\.(.*)))$/';
        if (preg_match($stagePattern, $parsedUrl['host'])) {
            return true;
        }
        $extraStagePattern = '/^(.*)stage(\d?)\.(.[^\.]*)\.(.[^\.]*)$/';
        if (preg_match($extraStagePattern, $parsedUrl['host'])) {
            return true;
        }
        $demoPattern = '/^(((.*)\.demo(\d?))|(demo)|(((.*)\.)?demo(\d?)\.(.*)))$/';
        if (preg_match($demoPattern, $parsedUrl['host'])) {
            return true;
        }
        $devPattern = '/^(((.*)\.dev(\d?))|(dev)|(((.*)\.)?dev(\d?)\.(.*)))$/';
        if (preg_match($devPattern, $parsedUrl['host'])) {
            return true;
        }
        $sandboxPattern = '/^(((.*)\.sandbox(\d?))|(sandbox)|(((.*)\.)?sandbox(\d?)\.(.*)))$/';
        if (preg_match($sandboxPattern, $parsedUrl['host'])) {
            return true;
        }
        $testPattern = '/^(((.*)\.test(\d?))|(test)|(((.*)\.)?test(\d?)\.(.*)))$/';
        if (preg_match($testPattern, $parsedUrl['host'])) {
            return true;
        }
        $stagingPattern = '/^(((.*)\.staging(\d?))|(staging)|(((.*)\.)?staging(\d?)\.(.*)))$/';
        if (preg_match($stagingPattern, $parsedUrl['host'])) {
            return true;
        }
        $extraStagingPattern = '/^(.*)staging(\d?)\.(.[^\.]*)\.(.[^\.]*)$/';
        $subdomainStaging  = '/^(.*)staging(\d?)(.[^\.]*)\.(.[^\.]*)\.(.[^\.]*)$/';
        if (preg_match($extraStagingPattern, $parsedUrl['host']) || preg_match($subdomainStaging, $parsedUrl['host'])) {
            return true;
        }
        $extraTestPattern = '/^(.*)test(\d?)\.(.[^\.]*)\.(.[^\.]*)$/';
        if (preg_match($extraTestPattern, $parsedUrl['host'])) {
            return true;
        }
        $extraDemoPattern = '/^(.*)demo(\d?)\.(.[^\.]*)\.(.[^\.]*)$/';
        if (preg_match($extraDemoPattern, $parsedUrl['host'])) {
            return true;
        }
        $wpEnginePattern = '/^((.*)\.wpengine.com)$/';
        if (preg_match($wpEnginePattern, $parsedUrl['host'])) {
            return true;
        }
        $stackstagingPattern = '/^((.*)\.stackstaging\.com)$/';
        if (preg_match($stackstagingPattern, $parsedUrl['host'])) {
            return true;
        }
        $cloudwaysappsPattern = '/^((.*)\.cloudwaysapps\.com)$/';
        if (preg_match($cloudwaysappsPattern, $parsedUrl['host'])) {
            return true;
        }
        $azurewebsitesPattern = '/^((.*)\.azurewebsites\.net)$/';
        if (preg_match($azurewebsitesPattern, $parsedUrl['host'])) {
            return true;
        }
        $pantheonPattern = '/^((.*)\.pantheonsite\.io)$/';
        if (preg_match($pantheonPattern, $parsedUrl['host'])) {
            return true;
        }
        $ipMatch = '/(\d+(\.|$)){4}/';
        if (preg_match($ipMatch, $parsedUrl['host'])) {
            return true;
        }
        // In case if there is more that 3 subdomains nad pattern matches
        if (substr_count($parsedUrl['host'], '.') > 3 && preg_match($pathPattern, $parsedUrl['host'])) {
            return true;
        }
        // In case if there is no domains then it is local
        if (substr_count($parsedUrl['host'], '.') === 0) {
            return true;
        }

        return false;
    }
}
