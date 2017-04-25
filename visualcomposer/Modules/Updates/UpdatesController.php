<?php

namespace VisualComposer\Modules\Updates;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class UpdatesController extends Container implements Module
{
    use WpFiltersActions;

    /**
     * Update path
     *
     * @var string
     */
    protected $updatePath = '..../index.html';

    public function __construct()
    {
        $featureToggle = false;
        if ($featureToggle) {
            /**
             * Init check update.
             *
             * @see \VisualComposer\Modules\Updates\UpdatesController::checkForUpdates
             */
            $this->wpAddFilter(
                'pre_set_site_transient_update_plugins',
                'checkForUpdates'
            );
        }
    }

    /**
     * Check for updates
     *
     * @param object $transient Transient.
     *
     * @return mixed
     */
    protected function checkForUpdates($transient)
    {
        // Extra check for 3rd plugins.
        if (isset($transient->response[ VCV_PLUGIN_BASE_NAME ])) {
            return $transient;
        }

        // Get the remote version.
        $info = $this->getRemoteVersionInfo();
        // If a newer version is available, add the update.
        if ($info && version_compare(VCV_VERSION, $info['version'], '<')) {
            $plugin = [];
            $plugin['slug'] = VCV_PLUGIN_DIRNAME;
            $plugin['plugin'] = VCV_PLUGIN_BASE_NAME;
            $plugin['new_version'] = $info['version'];
            $plugin['url'] = '.../changes.html';
            $plugin['package'] = '.../visual-composer.zip';
            $plugin['tested'] = $info['testedVersion'];
            $transient->response[ VCV_PLUGIN_BASE_NAME ] = $plugin;
        }

        return $transient;
    }

    /**
     * Get remote version
     *
     * @return bool|array
     */
    protected function getRemoteVersionInfo()
    {
        $request = wp_remote_get($this->updatePath);
        if (!is_wp_error($request) || wp_remote_retrieve_response_code($request) === 200) {
            return json_decode($request['body'], true);
        }

        return false;
    }
}
