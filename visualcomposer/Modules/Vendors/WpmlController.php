<?php

namespace VisualComposer\Modules\Vendors;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class WpmlController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct()
    {
        $this->wpAddAction('plugins_loaded', 'initialize', 16);
    }

    protected function initialize(Request $requestHelper)
    {
        if (defined('ICL_SITEPRESS_VERSION')) {
            $this->addFilter('vcv:frontend:pageEditable:url', 'addLangToLink');
            $this->addFilter('vcv:frontend:url', 'addLangToLink');
            $this->addFilter('vcv:ajax:setData:adminNonce', 'setDataTrid', -1);
            $this->addFilter('vcv:about:postNewUrl', 'addLangToLink');
            $this->addFilter('vcv:linkSelector:url', 'addLanguageDetails');
            $this->wpAddAction(
                'save_post',
                'insertTrid'
            );
            $this->wpAddAction('admin_print_scripts', 'outputWpml');
            if (class_exists('\SitePress')) {
                /** @see \VisualComposer\Modules\Vendors\WpmlController::disableGutenberg */
                $this->wpAddAction(
                    'admin_init',
                    'disableGutenberg',
                    11
                );
            }
            if ($requestHelper->exists(VCV_AJAX_REQUEST)) {
                global $sitepress;
                remove_action(
                    'wp_loaded',
                    [
                        $sitepress,
                        'maybe_set_this_lang',
                    ]
                );
            }
        }
    }

    /**
     * Disable the gutenberg
     *
     * @param \VisualComposer\Helpers\Request $requestHelper
     */
    protected function disableGutenberg(Request $requestHelper)
    {
        global $pagenow;
        if (!empty($pagenow) && $pagenow === 'post-new.php' && $requestHelper->exists('trid')
            && $requestHelper->exists(
                'source_lang'
            )
            && !$requestHelper->exists('vcv-set-editor')) {
            $trid = intval($requestHelper->input('trid'));
            $sourceElementId = \SitePress::get_original_element_id_by_trid($trid);
            if ($sourceElementId) {
                $isVc = get_post_meta($sourceElementId, VCV_PREFIX . 'pageContent', true);
                if (!empty($isVc)) {
                    if (function_exists('use_block_editor_for_post')) {
                        $this->wpAddFilter('use_block_editor_for_post', '__return_false');
                    } elseif (function_exists('the_gutenberg_project')) {
                        $this->wpAddFilter('gutenberg_can_edit_post_type', '__return_false');
                    }
                    $screen = get_current_screen();
                    if (!$requestHelper->exists('classic-editor')
                        && !(method_exists($screen, 'is_block_editor')
                            && $screen->is_block_editor())) {
                        // Not Block editor, apply only in classic-mode
                        add_filter('user_can_richedit', '__return_false', 50);
                        // $this->addFilter('vcv:helpers:gutenberg:isAvailable', '__return_false');
                        $this->addFilter(
                            'vcv:editors:frontendLayoutSwitcher:currentEditor',
                            function () {
                                return 'be';
                            }
                        );
                    }
                }
            }
        }
    }

    protected function addLangToLink($url, $payload)
    {
        global $sitepress;
        if (is_object($sitepress) && strpos($url, 'lang') === false) {
            $postTypeSupported = true;
            if (isset($payload['query']['vcv-source-id'])) {
                $post = get_post($payload['query']['vcv-source-id']);
                //@codingStandardsIgnoreLine
                $postTypeSupported = $sitepress->is_translated_post_type($post->post_type);
            }

            if ($sitepress->get_current_language() !== 'all' && $postTypeSupported) {
                return apply_filters('wpml_permalink', $url, $sitepress->get_current_language());
            }
        }

        return $url;
    }

    protected function insertTrid($id, $post, Request $requestHelper)
    {
        $trid = $requestHelper->input('trid');
        if ($trid) {
            update_post_meta($id, '_' . VCV_PREFIX . 'wpmlTrid', $trid);
        }
    }

    protected function setDataTrid($response, $payload)
    {
        $this->wpAddFilter('wpml_save_post_trid_value', 'checkTrid');

        return $response;
    }

    protected function checkTrid($trid, $payload, Request $requestHelper)
    {
        if (empty($trid)) {
            $sourceId = $requestHelper->input('vcv-source-id');
            $trid = get_post_meta($sourceId, '_' . VCV_PREFIX . 'wpmlTrid', true);
        }

        return $trid;
    }

    protected function addLanguageDetails($url, $payload)
    {
        $post = $payload['post'];
        $postLang = apply_filters('wpml_post_language_details', null, $post->ID);
        if ($postLang && isset($postLang['language_code']) && $postLang['language_code']) {
            $url = apply_filters(
                'wpml_permalink',
                get_permalink($post->ID),
                $postLang['language_code']
            );
        } else {
            $url = get_permalink($post->ID);
        }

        return $url;
    }

    protected function outputWpml()
    {
        $available = (defined('ICL_SITEPRESS_VERSION')) ? true : false;
        evcview(
            'partials/constant-script',
            [
                'key' => 'VCV_WPML',
                'value' => $available,
                'type' => 'constant',
            ]
        );
    }
}
