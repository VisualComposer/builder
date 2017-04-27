<?php

namespace VisualComposer\Modules\Editors\PageEditable;

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
        $bundleJsUrl = $urlHelper->to('public/dist/pe.bundle.js?' . uniqid());
        $vendorBundleJsUrl = $urlHelper->to('public/dist/vendor.bundle.js?' . uniqid());
        $newWebpack = true;
        if ($newWebpack) {
            // TODO: Feature toggle.
            wp_enqueue_script('vcv:pageEditable:vendor', $vendorBundleJsUrl);
        }
        wp_enqueue_script('vcv:pageEditable:bundle', $bundleJsUrl);
        $bundleCssUrl = $urlHelper->to('public/dist/pe.bundle.css?' . uniqid());
        wp_enqueue_style('vcv:pageEditable:css', $bundleCssUrl);
    }

    protected function addTheContentFilteringForPost()
    {
        remove_all_filters('the_content'); // TODO: Check this. causes a bunch of problems with assets/enqueue
        $this->wpAddFilter(
            'the_content',
            function () {
                return vcview('editor/pageEditable/pageEditable.php');
            },
            9999
        );
    }
}
