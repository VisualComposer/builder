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
        if (!defined('ICL_SITEPRESS_VERSION')) {
            return;
        }

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
                'current_screen',
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

        $this->wpAddAction(
            'wpml_pro_translation_completed',
            'completeTranslationJobSaving',
            11,
            3
        );

        $this->wpAddAction(
            'wpml_translation_job_saved',
            'launchOurUpdateAfterPostTranslation',
            10,
            1
        );

        $this->wpAddAction('admin_notices', 'createNotice');

        $this->addFilter('vcv:dataAjax:setData:sourceId', 'changeLanguageWhileUpdate', -1);

        $this->addFilter(
            'vcv:resources:view:settings:pages:handleIframeBodyClick',
            'addHandleIframeBodyClick'
        );
    }

    /**
     * Replace our content data with translation content.
     *
     * @param array $package
     *
     * @return array
     */
    protected function prepareTranslationJobData($package)
    {
        // Not a vc post.
        if (!isset($package['contents']['field-vcv-pageContent-0'])) {
            return $package;
        }

        $pageContent = $package['contents']['field-vcv-pageContent-0'];

        // Content Encoded in Base64 as it is safe to use in URL and JSON
        $pageContent = json_decode(rawurldecode(base64_decode($pageContent['data'])), true);

        $translations = [];

        foreach ($pageContent['elements'] as $elementId => $valueElement) {
            $translations = array_merge(
                $translations,
                $this->getElementTranslation($valueElement, [$elementId])
            );
        }

        $package = $this->setNewContentForTranslationPackage($translations, $package);

        return $this->removeVcvPageContent($package);
    }

    /**
     * Remove vcv-pageContent from translation package.
     *
     * @param array $package
     *
     * @return array
     */
    protected function removeVcvPageContent($package)
    {
        if (isset($package['contents']['field-vcv-pageContent-0'])) {
            unset($package['contents']['field-vcv-pageContent-0']);
        }

        return $package;
    }

    /**
     * Create new sub-list of pageContent inner fields as separate fields for xcliff file
     *
     * @param array $translations
     * @param array $package
     *
     * @return array
     */
    protected function setNewContentForTranslationPackage($translations, $package)
    {
        if (empty($translations)) {
            return $package;
        }

        foreach ($translations as $translation) {
            // we have 'path' and 'value'
            $key = implode('.', $translation['path']);
            $package['contents'][ 'field-vcv-pageContentField--' . $key . '-0' ] = [
                'translate' => 1,
                // Content Encoded in Base64 as it is safe to use in URL and JSON
                // @codingStandardsIgnoreLine
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

        return $package;
    }

    /**
     * Translate our vcv-pageContent editor meta.
     *
     * @param int $translatedPostId
     * @param array $fields
     * @param object $job
     *
     * @return int
     */
    protected function completeTranslationJobSaving($translatedPostId, $fields, $job)
    {
        $dataHelper = vchelper('Data');
        $pageContentIndex = $dataHelper->arraySearch(
            $job->elements,
            'field_type',
            'field-vcv-pageContent-0-name',
            true
        );

        // We do not have vcv-pageContent field, stop translation
        if ($pageContentIndex === false) {
            return $translatedPostId;
        }

        // @codingStandardsIgnoreLine
        $pageContent = get_post_meta($job->original_doc_id, VCV_PREFIX . 'pageContent', true);
        $pageContent = json_decode(rawurldecode($pageContent), true);

        $pageContent = $this->insertTranslatedElementsToVcvPageContent($pageContent, $job->elements);

        $pageContent = rawurlencode(wp_json_encode($pageContent));
        update_post_meta($translatedPostId, VCV_PREFIX . 'pageContent', $pageContent);

        return $translatedPostId;
    }

    /**
     * Insert translated elements to vcv-pageContent.
     *
     * @param string $pageContent
     * @param array $elements
     *
     * @return string
     */
    protected function insertTranslatedElementsToVcvPageContent($pageContent, $elements)
    {
        $dataHelper = vchelper('Data');

        foreach ($elements as $field) {
            // @codingStandardsIgnoreLine
            $isFieldPostContent = isset($field->field_type)
                && // @codingStandardsIgnoreLine
                strpos($field->field_type, 'field-vcv-pageContentField--') !== false;

            // @codingStandardsIgnoreLine
            if (!$field->field_finished || !$isFieldPostContent) {
                continue;
            }
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
        }

        return $pageContent;
    }

    /**
     * Output about update post after translation.
     */
    protected function createNotice()
    {
        global $pagenow;
        $requestHelper = vchelper('Request');
        $page = $requestHelper->input('page');
        if (
            $pagenow === 'admin.php'
            && strpos($page, 'wpml-translation-management') !== false
        ) {
            // Add notice that after translation you have to open automatic post updates page: %url%
            $class = 'notice notice-info';
            printf(
                '<div class="%1$s"><p>%2$s</p></div>',
                esc_attr($class),
                sprintf(
                // translators: %1$s: <strong>, %2$s: </strong>, %3$s: <a href url to automatic post updates page, %4$s: </a>
                    esc_html__(
                        '%1$sVisual Composer:%2$s To complete WPML Translation Manager process for the Visual Composer supported pages you will need to run automatic posts update. %3$sUpdate Posts%4$s',
                        'visualcomposer'
                    ),
                    '<strong>',
                    '</strong>',
                    '<a href="' . esc_url(admin_url('admin.php?page=vcv-update')) . '">',
                    '</a>'
                )
            );
        }
    }

    /**
     * Translate vcv editor element.
     *
     * @param $element
     * @param $initialPath
     *
     * @return array
     */
    protected function getElementTranslation($element, $initialPath)
    {
        $translations = [];
        foreach ($element as $attributeKey => $attributeValue) {
            $translatableAttributes = $this->localizationsHelper->getTranslatableAttributes($element);

            $path = $initialPath;
            $path[] = $attributeKey;
            if (is_array($attributeValue)) {
                $translations = array_merge($translations, $this->getElementTranslation($attributeValue, $path));
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

    /**
     * Add lang to editor url.
     *
     * @param string $url
     * @param array $payload
     *
     * @return mixed|string|null
     */
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

    /**
     * Update wpml trid meta.
     *
     * @param int $id
     * @param \VisualComposer\Helpers\Request $requestHelper
     */
    protected function insertTrid($id, Request $requestHelper)
    {
        $trid = $requestHelper->input('trid');
        if ($trid) {
            update_post_meta($id, '_' . VCV_PREFIX . 'wpmlTrid', $trid);
        }
    }

    /**
     * Set wpml trid.
     *
     * @param $response
     * @param $payload
     *
     * @return mixed
     */
    protected function setDataTrid($response, $payload)
    {
        $this->wpAddFilter('wpml_save_post_trid_value', 'checkTrid');

        return $response;
    }

    /**
     * Check wpml trid.
     *
     * @param $trid
     * @param $payload
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @return mixed
     */
    protected function checkTrid($trid, $payload, Request $requestHelper)
    {
        if (empty($trid)) {
            $sourceId = $requestHelper->input('vcv-source-id');
            $trid = get_post_meta($sourceId, '_' . VCV_PREFIX . 'wpmlTrid', true);
        }

        return $trid;
    }

    /**
     * Add language data to url.
     *
     * @param $url
     * @param $payload
     *
     * @return false|mixed|string|\WP_Error|null
     */
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

    /**
     * Add our wpml specific script.
     */
    protected function outputWpml()
    {
        $available = defined('ICL_SITEPRESS_VERSION');
        evcview(
            'partials/constant-script',
            [
                'key' => 'VCV_WPML',
                'value' => $available,
                'type' => 'constant',
            ]
        );
    }

    /**
     * While post update we need set post lang appropriate to currently updating post.
     *
     * @param int $postId
     *
     * @return int
     */
    protected function changeLanguageWhileUpdate($postId)
    {
        if (!is_numeric($postId)) {
            return $postId;
        }

        global $wpdb;

        $result = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT language_code FROM " . $wpdb->prefix . "icl_translations WHERE element_id = %d",
                $postId
            )
        );

        if (!empty($result[0]->language_code)) {
            $_POST['post_ID'] = $postId;
            $_POST['icl_post_language'] = $result[0]->language_code;
        }

        return $postId;
    }

    /**
     * Add script that help us redirect to wpml translate service inside our iframe settings.
     *
     * @param string $output
     *
     * @return string
     */
    protected function addHandleIframeBodyClick($output)
    {
        $output .= "
            const link = e.target.closest('.js-wpml-translate-link')
            if (link) {
              e.preventDefault();
              window.open(link.href)
            }
        ";

        return $output;
    }

    /**
     * Launch vcv post update after wpml post translation.
     *
     * @param int $newPostId
     */
    protected function launchOurUpdateAfterPostTranslation($newPostId)
    {
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
}
