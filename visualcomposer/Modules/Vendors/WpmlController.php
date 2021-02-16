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

    protected $localizationsHelper;

    public function __construct()
    {
        $this->wpAddAction('plugins_loaded', 'initialize', 16);
    }

    protected function initialize(Request $requestHelper)
    {
        if (defined('ICL_SITEPRESS_VERSION')) {
            $this->localizationsHelper = vchelper('Localizations');

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

            $this->wpAddFilter(
                'wpml_tm_translation_job_data',
                'prepareTranslationJobData',
                11,
                2
            );

            $this->wpAddFilter(
                'wpml_tm_job_fields',
                'completeTranslationJobSaving',
                11,
                2
            );

            $this->wpAddAction(
                'wpml_translation_job_saved',
                function ($newPostId) {
                    $optionsHelper = vchelper('Options');
                    $updatePosts = $optionsHelper->get('hubAction:updatePosts', []);
                    if (!is_array($updatePosts)) {
                        $updatePosts = [];
                    }
                    $updatePosts[] = $newPostId;
                    // Mark post as pending for update
                    $optionsHelper->set('hubAction:updatePosts', array_unique($updatePosts));
                    $optionsHelper->set('bundleUpdateRequired', 1);
                }
            );

            $this->wpAddAction('admin_notices', 'createNotice');
        }
    }

    protected function prepareTranslationJobData($package, $post)
    {
        if (isset($package['contents'])) {
            $fields = $package['contents'];
            foreach ($fields as $fieldKey => $field) {
                if ($fieldKey === 'field-vcv-pageContent-0') {
                    // Make the magic
                    $pageContent = json_decode(rawurldecode(base64_decode($field['data'])), true);

                    $translations = [];
                    foreach ($pageContent['elements'] as $elementId => $valueElement) {
                        $translations = array_merge(
                            $translations,
                            $this->getTranslations($valueElement, [$elementId])
                        );
                    }

                    // Create new sub-list of pageContent inner fields as separate fields for xcliff file
                    if (!empty($translations)) {
                        foreach ($translations as $translation) {
                            // we have 'path' and 'value'
                            $key = implode('.', $translation['path']);
                            $package['contents'][ 'field-vcv-pageContentField--' . $key . '-0' ] = [
                                'translate' => 1,
                                'data' => base64_encode($translation['value']),
                                'format' => 'base64',
                            ];
                            $package['contents'][ 'field-vcv-pageContentField--' . $key . '-0-name' ] = [
                                'translate' => 0,
                                'data' => 'vcv-pageContentField--' . $key,
                            ];
                            $package['contents'][ 'field-vcv-pageContentField--' . $key . '-0-type' ] = [
                                'translate' => 0,
                                'data' => 'custom_field',
                            ];
                        }
                    }
                }

                // Remove 'body' as it not needed
                if ($fieldKey === 'body') {
                    unset($package['contents'][ $fieldKey ]);
                }
            }
        }

        return $package;
    }

    protected function completeTranslationJobSaving($fields, $job)
    {
        // update JOB->elements (obj by reference)
        $dataHelper = vchelper('Data');
        $pageContentIndex = $dataHelper->arraySearch(
            $job->elements,
            'field_type',
            'field-vcv-pageContent-0',
            true
        );

        // We have vcv-pageContent field continue translation
        if ($pageContentIndex !== false) {
            $pageContent = json_decode(
            // @codingStandardsIgnoreLine
                rawurldecode(base64_decode($job->elements[ $pageContentIndex ]->field_data_translated)),
                true
            );
            $elements = $job->elements;
            foreach ($elements as $index => $field) {
                if (
                    // @codingStandardsIgnoreLine
                    $field->field_finished && isset($field->field_type)
                    && strpos(
                    // @codingStandardsIgnoreLine
                        $field->field_type,
                        'field-vcv-pageContentField--'
                    ) !== false
                ) {
                    // @codingStandardsIgnoreLine
                    if (substr($field->field_type, -2) === '-0') {
                        // actual field with value
                        $path = 'elements.';
                        $path .= substr(
                        // @codingStandardsIgnoreLine
                            str_replace('field-vcv-pageContentField--', '', $field->field_type),
                            0,
                            -2
                        );
                        // @codingStandardsIgnoreLine
                        $value = base64_decode($field->field_data_translated);

                        $dataHelper->set($pageContent, $path, $value);
                    }
                    unset($job->elements[ $index ]);
                }
            }

            // Encode back updated translation
            // @codingStandardsIgnoreLine
            $job->elements[ $pageContentIndex ]->field_data_translated = base64_encode(
                rawurlencode(json_encode($pageContent))
            );
        }

        return $fields;
    }

    protected function createNotice()
    {
        global $pagenow;

        if (
            isset($_GET['page']) && $pagenow === 'admin.php'
            && strpos($_GET['page'], 'wpml-translation-management') !== false
        ) {
            // Add notice that after translation you have to open automatic post updates page: %url%
            $class = 'notice notice-info';
            printf(
                '<div class="%1$s"><p>%2$s</p></div>',
                esc_attr($class),
                sprintf(
                    __(
                        '<b>Visual Composer:</b> To complete WPML Translation Manager process for the Visual Composer supported pages you will need to run automatic posts update. <a href="%s">Update Posts</a>',
                        'visualcomposer'
                    ),
                    admin_url('admin.php?page=vcv-update')
                )
            );
        }
    }

    protected function getTranslations($element, $initialPath)
    {

        $translations = [];
        foreach ($element as $attributeKey => $attributeValue) {
            $translatableAttributes = $this->localizationsHelper->getTranslatableAttributes($element);

            $path = $initialPath;
            $path[] = $attributeKey;
            if (is_array($attributeValue)) {
                $translations = array_merge($translations, $this->getTranslations($attributeValue, $path));
            } elseif (is_string($attributeValue) && in_array($attributeKey, $translatableAttributes, true)) {
                $translations[] = [
                    'path' => $path,
                    'value' => $attributeValue,
                ];
            }
        }

        return $translations;
    }

    /**
     * Disable the gutenberg
     *
     * @param \VisualComposer\Helpers\Request $requestHelper
     */
    protected function disableGutenberg(Request $requestHelper)
    {
        global $pagenow;
        if (
            !empty($pagenow)
            && $pagenow === 'post-new.php'
            && $requestHelper->exists('trid')
            && $requestHelper->exists(
                'source_lang'
            )
            && !$requestHelper->exists('vcv-set-editor')
        ) {
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
                    if (
                        !$requestHelper->exists('classic-editor')
                        && !(
                            method_exists($screen, 'is_block_editor')
                            && $screen->is_block_editor()
                        )
                    ) {
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
                if (
                    isset($payload['query'], $payload['query']['vcv-action'])
                    && $payload['query']['vcv-action'] === 'frontend'
                ) {
                    return add_query_arg(['lang' => $sitepress->get_current_language()], $url);
                } else {
                    return apply_filters('wpml_permalink', $url, $sitepress->get_current_language());
                }
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
