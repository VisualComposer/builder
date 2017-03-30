<?php

namespace VisualComposer\Modules\Editors\Backend;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Wp;

class LayoutSwitcher extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\Backend\LayoutSwitcher::checkBackendMetabox */
        $this->addFilter('vcv:editors:backend:addMetabox', 'checkBackendMetabox');

        /** @see \VisualComposer\Modules\Editors\Backend\LayoutSwitcher::enqueueEditorAssets */
        $this->wpAddAction('admin_enqueue_scripts', 'enqueueEditorAssets');

        $this->wpAddAction('admin_head', 'printScripts');
    }

    protected function printScripts(Frontend $frontendHelper)
    {
        $scriptBody = sprintf('window.vcvFrontendEditorLink = "%s"', $frontendHelper->getFrontendUrl());
        $script = sprintf('<script>%s</script>', $scriptBody);

        echo $script;
    }

    /**
     * @param \VisualComposer\Helpers\Frontend $frontendHelper
     */
    protected function enqueueEditorAssets(Frontend $frontendHelper, BackendController $backendControllerHelper)
    {
        global $post;
        if (empty($post)) {
            $post = get_post();
        }
        if (empty($post)) {
            return;
        }
        if (!$frontendHelper->isFrontend()
            && $backendControllerHelper->checkPostType(
                true,
                // @codingStandardsIgnoreLine
                ['postType' => $post->post_type]
            )
        ) {
            $this->registerEditorAssets();

            wp_enqueue_script('vcv:editors:backendswitcher:bundle');
            wp_enqueue_style('vcv:editors:backendswitcher:bundle');
        }
    }

    /**
     *
     */
    protected function registerEditorAssets()
    {
        $urlHelper = vchelper('Url');
        $bundleJsUrl = $urlHelper->to('public/dist/wpbackendswitch.bundle.js?' . uniqid());
        $bundleCssUrl = $urlHelper->to('public/dist/wpbackendswitch.bundle.css?' . uniqid());
        wp_register_script('vcv:editors:backendswitcher:bundle', $bundleJsUrl);
        wp_register_style('vcv:editors:backendswitcher:bundle', $bundleCssUrl);
    }

    protected function checkBackendMetabox($response, $payload, Request $requestHelper, Wp $wpHelper)
    {
        $status = $wpHelper->getUserSetting(
            get_current_user_id(),
            'vcvEditorsBackendLayoutSwitcher',
            true
        );
        if (is_string($status)) {
            $status = $status !== '0'; // '0' => false, any other => true(add metabox)
        }

        return $response && $status;
    }
}
