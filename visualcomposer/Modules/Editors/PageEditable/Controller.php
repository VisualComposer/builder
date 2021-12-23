<?php

namespace VisualComposer\Modules\Editors\PageEditable;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Assets;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\PostType;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Url;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class Controller.
 */
class Controller extends Container implements Module
{
    use WpFiltersActions;

    protected $jQueryDefined = false;

    /**
     * Controller constructor.
     */
    public function __construct(Request $requestHelper)
    {
        /** @see \VisualComposer\Modules\Editors\PageEditable\Controller::templateRedirect */
        $this->wpAddAction('template_redirect', 'templateRedirect');

        /** @see \VisualComposer\Modules\Editors\PageEditable\Controller::inject404Page */
        $this->wpAddAction('pre_get_posts', 'inject404Page');
        $this->wpAddFilter('pre_handle_404', 'check404');

        /** @see \VisualComposer\Modules\Editors\PageEditable\Controller::pejQueryReady */
        $this->wpAddAction('wp_enqueue_scripts', 'pejQueryReady');
        $this->wpAddAction('wp_enqueue_scripts', 'enqueueAssets');

        // Fix for staging auto urls 404->301
        if ($requestHelper->exists('vcv-editable')) {
            add_filter('redirect_canonical', '__return_false', 100);
        }
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

    protected function inject404Page($wpQuery, Frontend $frontendHelper, PostType $postTypeHelper)
    {
        if ($frontendHelper->isPageEditable()) {
            $wpQuery->query['post_status'] = $postTypeHelper->getPage404StatusList();
            // @codingStandardsIgnoreLine
            $wpQuery->query_vars['post_status'] = $postTypeHelper->getPage404StatusList();

            $post = get_post(vchelper('Request')->input('vcv-source-id'));
            $wpQuery->posts = [
                $post,
            ];
            $wpQuery->post = $post;
            // @codingStandardsIgnoreStart
            $wpQuery->post_count = 1;
            $wpQuery->queried_object = $post;
            $wpQuery->queried_object_id = $post->ID;
            // @codingStandardsIgnoreEnd
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

    protected function buildPageEditable()
    {
        global $post;
        // @codingStandardsIgnoreLine
        $post->post_content = vcview('editor/pageEditable/pageEditable.php');
        wp_cache_add($post->ID, $post, 'posts');
        /** @see \VisualComposer\Modules\Editors\PageEditable\Controller::registerAssets */
        $this->call('registerAssets');
    }

    protected function addTheContentFilteringForPost()
    {
        $sourceId = intval(vchelper("Request")->input('vcv-source-id'));
        if ($sourceId === get_the_ID()) {
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
        }
    }

    protected function pejQueryReady(Frontend $frontendHelper)
    {
        if (!$this->jQueryDefined && $frontendHelper->isPageEditable()) {
            $warn = vcvenv('VCV_DEBUG') ? 'console.warn(\'jquery ready failed\', e, param);' : '';

            $script = '
            (function() {
                var isFrozen = {};
                window.vcvFreezeReady = function (freezeId, freezeValue) {
                    if(!freezeValue) {
                      delete isFrozen[freezeId];
                    } else {
                      isFrozen[freezeId] = true;
                   }
                }      
                
                var callback = function (that, param) {
                    try {
                          window.setTimeout(function () {
                            if(Object.keys(isFrozen).length) {
                                callback(that, param);
                            } else {                    
                                param.call(that, jQuery);
                            }
                          }, 300)
                    } catch (e) {
                       ' . $warn . '
                    }
                }
                jQuery.fn.ready = function (param) {
                    callback(this, param);
                    return this;
                }
                
                window.setTimeout(function() {
                    jQuery.fn.load = function (param) {
                        callback(this, param);
                        return this;
                   }
                }, 1)
            })();';

            wp_add_inline_script('jquery-core', $script);

            $this->jQueryDefined = true;
        }
    }

    /**
     * @param \VisualComposer\Helpers\Url $urlHelper
     * @param \VisualComposer\Helpers\Assets $assetsHelper
     */
    protected function registerAssets(Url $urlHelper, Assets $assetsHelper)
    {
        $bundleJsUrl = $urlHelper->to('public/dist/pe.bundle.js');
        $bundleCssUrl = $urlHelper->to('public/dist/pe.bundle.css');

        wp_register_script('vcv:pageEditable:bundle', $bundleJsUrl, ['vcv:assets:runtime:script'], VCV_VERSION, true);
        wp_register_style('vcv:pageEditable:css', $bundleCssUrl, [], VCV_VERSION);
    }

    protected function enqueueAssets(Frontend $frontendHelper)
    {
        if ($frontendHelper->isPageEditable()) {
            wp_enqueue_script('jquery');
            wp_enqueue_script('vcv:pageEditable:bundle');
            wp_enqueue_style('vcv:pageEditable:css');
        }
    }
}
