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
        $this->wpAddFilter('pre_handle_404', 'check404');
    }

    protected function check404($response, Frontend $frontendHelper)
    {
        // @codingStandardsIgnoreStart
        global $wp_query;
        if ($frontendHelper->isPageEditable()) {
            $post = get_post(vchelper('Request')->input('vcv-source-id'));
            $wp_query->posts = [
                $post,
            ];
            $wp_query->post = $post;
            $wp_query->post_count = 1;

            // @codingStandardsIgnoreEnd
            return true;
        }

        return $response;
    }

    protected function inject404Page($wpQuery, Frontend $frontendHelper)
    {
        if ($frontendHelper->isPageEditable()) {
            $wpQuery->query['post_status'] = [
                'publish',
                'unpublish',
                'draft',
                'pending',
                'auto-draft',
                'private',
                'future',
            ];
            // @codingStandardsIgnoreLine
            $wpQuery->query_vars['post_status'] = [
                'publish',
                'unpublish',
                'draft',
                'pending',
                'auto-draft',
                'private',
                'future',
            ];

            $post = get_post(vchelper('Request')->input('vcv-source-id'));
            $wpQuery->posts = [
                $post,
            ];
            $wpQuery->post = $post;
            // @codingStandardsIgnoreLine
            $wpQuery->post_count = 1;
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
        wp_enqueue_script('vcv:assets:vendor:script', $vendorBundleJsUrl, ['jquery'], VCV_VERSION, true);
        wp_enqueue_script('vcv:pageEditable:bundle', $bundleJsUrl, ['vcv:assets:vendor:script'], VCV_VERSION, true);
        wp_enqueue_style('vcv:pageEditable:css', $bundleCssUrl, [], VCV_VERSION);
    }

    protected function addTheContentFilteringForPost()
    {
        $sourceId = intval(vchelper("Request")->input('vcv-source-id'));
        if ($sourceId === get_the_ID()) {
            // remove_all_filters('the_content'); // TODO: Check this. causes a bunch of problems with assets/enqueue

            // This is to "remove" all the content to disable extra js appending
            $this->wpAddFilter(
                'the_content',
                function () {
                    return '';
                },
                -100
            );

            // This is required to place editor in correct place
            $this->wpAddFilter(
                'the_content',
                function () {
                    return vcview('editor/pageEditable/pageEditable.php');
                },
                9999
            );
            // In case if the_content wasn't triggered
            //            $this->wpAddFilter(
            //                'the_excerpt',
            //                function () {
            //                    return vcview('editor/pageEditable/pageEditable.php');
            //                },
            //                9999
            //            );
        }
    }
}
