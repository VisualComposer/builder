<?php

namespace VisualComposer\Modules\Editors\PageEditable;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\Url;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class Controller.
 */
class Controller extends Container implements Module
{
    use WpFiltersActions;

    /**
     * Controller constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\PageEditable\Controller::templateRedirect */
        $this->wpAddAction('template_redirect', 'templateRedirect');

        /** @see \VisualComposer\Modules\Editors\PageEditable\Controller::inject404Page */
        $this->wpAddAction('pre_get_posts', 'inject404Page');
    }

    protected function inject404Page($wpQuery, Frontend $frontendHelper)
    {
        if ($frontendHelper->isPageEditable()) {
            // TODO: Check another post statuses
            $wpQuery->query['post_status'] = ['publish', 'unpublish', 'draft', 'pending', 'auto-draft'];
            // @codingStandardsIgnoreLine
            $wpQuery->query_vars['post_status'] = ['publish', 'unpublish', 'draft', 'pending', 'auto-draft'];
        }
    }

    protected function templateRedirect(Frontend $frontendHelper)
    {
        if ($frontendHelper->isPageEditable()) {
            /** @see \VisualComposer\Modules\Editors\PageEditable\Controller::buildPageEditable */
            $this->wpAddFilter('show_admin_bar', '__return_false');
            $this->call('buildPageEditable');
        }
    }

    protected function buildPageEditable(Url $urlHelper)
    {
        /** @see \VisualComposer\Modules\Editors\PageEditable\Controller::addTheContentFilteringForPost */
        $this->wpAddAction(
            'the_post',
            'addTheContentFilteringForPost',
            9999 // Do with high weight - when all other actions is done
        );
        if (vcvenv('VCV_ENV_EXTENSION_DOWNLOAD')) {
            $bundleJsUrl = content_url() . '/' . VCV_PLUGIN_ASSETS_DIRNAME . '/editor/pe.bundle.js';
            $bundleCssUrl = content_url() . '/' . VCV_PLUGIN_ASSETS_DIRNAME . '/editor/pe.bundle.css';
        } else {
            $bundleJsUrl = $urlHelper->to('public/dist/pe.bundle.js');
            $bundleCssUrl = $urlHelper->to('public/dist/pe.bundle.css');
        }
        if (vcvenv('VCV_ENV_EXTENSION_DOWNLOAD')) {
            $vendorBundleJsUrl = content_url() . '/' . VCV_PLUGIN_ASSETS_DIRNAME . '/editor/vendor.bundle.js';
        } else {
            $vendorBundleJsUrl = $urlHelper->to('public/dist/vendor.bundle.js');
        }
        wp_enqueue_script('vcv:pageEditable:vendor', $vendorBundleJsUrl, ['jquery'], VCV_VERSION);
        wp_enqueue_script('vcv:pageEditable:bundle', $bundleJsUrl, ['vcv:pageEditable:vendor'], VCV_VERSION);
        wp_enqueue_style('vcv:pageEditable:css', $bundleCssUrl, [], VCV_VERSION);
    }

    protected function addTheContentFilteringForPost()
    {
        // remove_all_filters('the_content'); // TODO: Check this. causes a bunch of problems with assets/enqueue
        $this->wpAddFilter(
            'the_content',
            function () {
                return vcview('editor/pageEditable/pageEditable.php');
            },
            9999
        );
    }
}
