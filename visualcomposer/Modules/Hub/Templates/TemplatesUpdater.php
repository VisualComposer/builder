<?php

namespace VisualComposer\Modules\Hub\Templates;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\EditorTemplates;
use VisualComposer\Helpers\File;
use VisualComposer\Helpers\Hub\Templates;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\WpMedia;
use WP_Query;

class TemplatesUpdater extends Container implements Module
{
    use EventsFilters;

    protected $importedImages = [];

    protected $templatePostType;

    /** @noinspection PhpMissingParentConstructorInspection */
    public function __construct()
    {
        $this->addFilter(
            'vcv:hub:download:bundle vcv:hub:download:bundle:template/* vcv:hub:download:bundle:predefinedTemplate/*',
            'updateTemplate'
        );
    }

    protected function updateTemplate(
        $response,
        $payload,
        File $fileHelper,
        Templates $hubTemplatesHelper,
        WpMedia $wpMediaHelper,
        EditorTemplates $editorTemplatesHelper
    ) {
        $bundleJson = isset($payload['archive']) ? $payload['archive'] : false;
        if (vcIsBadResponse($response) || !$bundleJson || is_wp_error($bundleJson)) {
            return ['status' => false];
        }

        /** @see \VisualComposer\Modules\Editors\Templates\TemplatesDownloadController::updateTemplates */
        if (!isset($response['templates']) || empty($response['templates'])) {
            $response['templates'] = [];
        }

        $createDirResult = $fileHelper->createDirectory(
            $hubTemplatesHelper->getTemplatesPath()
        );
        if (vcIsBadResponse($createDirResult) && !$fileHelper->isDir($hubTemplatesHelper->getTemplatesPath())) {
            return false;
        }
        $template = $bundleJson;
        $template['id'] = $payload['actionData']['data']['id'];
        // File is locally available
        $hubTemplatesBundleHelper = vchelper('HubBundle');
        $hubTemplatesBundleHelper->setTempBundleFolder(
            VCV_PLUGIN_ASSETS_DIR_PATH . '/temp-bundle-' . str_replace('/', '-', $payload['actionData']['action'])
        );
        $tempTemplatePath = $hubTemplatesBundleHelper->getTempBundleFolder('templates/' . $template['id']);
        if (is_dir($tempTemplatePath)) {
            // We have local assets for template, so we need to copy them to real templates folder
            $createDirResult = $fileHelper->createDirectory($hubTemplatesHelper->getTemplatesPath($template['id']));
            if (
                vcIsBadResponse($createDirResult)
                && !$fileHelper->isDir($hubTemplatesHelper->getTemplatesPath($template['id']))
            ) {
                return false;
            }
            $copyDirResult = $fileHelper->copyDirectory(
                $tempTemplatePath,
                $hubTemplatesHelper->getTemplatesPath($template['id'])
            );
            if (vcIsBadResponse($copyDirResult)) {
                return false;
            }
        }

        $this->templatePostType = isset($payload['actionData']['action']) && $payload['actionData']['action'] === 'template/tutorial' ? 'vcv_tutorials' : 'vcv_templates';
        $template['name'] = $this->templatePostType === 'vcv_tutorials' ? 'Tutorial Page' : $payload['actionData']['data']['name'];
        $templateElements = $template['data'];
        $templateMeta = $this->processTemplateMetaImages(
            [
                'id' => $template['id'],
                'preview' => $this->templatePostType === 'vcv_tutorials' ? '' : $payload['actionData']['data']['preview'],
                'thumbnail' => $this->templatePostType === 'vcv_tutorials' ? '' : $payload['actionData']['data']['thumbnail'],
            ]
        );
        if ($this->templatePostType !== 'vcv_tutorials') {
            $elementsImages = $wpMediaHelper->getTemplateElementMedia($templateElements);
            $templateElements = $this->processTemplateImages($elementsImages, $template, $templateElements);
            $templateElements = $this->processDesignOptions($templateElements, $template);
        }
        // Check if menu source is exist or not
        $templateElements = $this->isMenuExist($templateElements);
        $templateElements = json_decode(
            str_replace(
                '[publicPath]',
                $hubTemplatesHelper->getTemplatesUrl($template['id']),
                wp_json_encode($templateElements)
            ),
            true
        );
        unset($template['data']);

        $savedTemplates = new WP_Query(
            [
                'post_type' => $this->templatePostType,
                'post_status' => ['publish', 'pending', 'draft', 'auto-draft', 'future', 'private', 'trash'],
                'meta_query' => [
                    [
                        'key' => '_' . VCV_PREFIX . 'id',
                        'value' => $template['id'],
                        'compare' => '=',
                    ],
                    [
                        'key' => '_' . VCV_PREFIX . 'type',
                        'value' => 'custom',
                        'compare' => '!=',
                    ],
                ],
            ]
        );

        if (!$savedTemplates->have_posts()) {
            $templateId = wp_insert_post(
                [
                    'post_title' => $template['name'],
                    'post_type' => $this->templatePostType,
                    'post_status' => 'publish',
                ]
            );
        } else {
            $savedTemplates->the_post();
            $templateId = get_the_ID();
            wp_reset_postdata();
            wp_update_post(
                [
                    'ID' => $templateId,
                    'post_title' => $payload['actionData']['data']['name'],
                    'post_type' => $this->templatePostType,
                    'post_status' => 'publish',
                ]
            );
        }
        $template['description'] = $payload['actionData']['data']['description'];
        $template['thumbnail'] = $templateMeta['thumbnail'];
        $template['preview'] = $templateMeta['preview'];

        if (isset($payload['actionData']['data']['type'])) {
            $type = $payload['actionData']['data']['type'];
        } else {
            $type = 'hub';
        }

        $this->updatePostMetas($templateId, $template, $type, $payload, $templateElements);

        $response['templates'][] = [
            'id' => $templateId,
            'tag' => $payload['actionData']['action'],
            'bundle' => $payload['actionData']['action'],
            'name' => $template['name'],
            'description' => $template['description'],
            'data' => $templateElements,
            'thumbnail' => $template['thumbnail'],
            'preview' => $template['preview'],
            'type' => $type,
        ];
        $response['templateGroup'] = [
            'name' => $editorTemplatesHelper->getGroupName($type),
            'type' => $type,
        ];

        return $response;
    }

    /**
     * Update post metas for template
     *
     * @param $templateId
     * @param $template
     * @param $type
     * @param $payload
     * @param $templateElements
     */
    protected function updatePostMetas($templateId, $template, $type, $payload, $templateElements)
    {
        update_post_meta($templateId, '_' . VCV_PREFIX . 'description', $template['description']);
        update_post_meta($templateId, '_' . VCV_PREFIX . 'type', $type);
        update_post_meta($templateId, '_' . VCV_PREFIX . 'thumbnail', $template['thumbnail']);
        update_post_meta($templateId, '_' . VCV_PREFIX . 'preview', $template['preview']);
        update_post_meta($templateId, '_' . VCV_PREFIX . 'id', $template['id']);
        update_post_meta($templateId, '_' . VCV_PREFIX . 'bundle', $payload['actionData']['action']);
        update_post_meta($templateId, 'vcvEditorTemplateElements', $templateElements);

        if ($this->templatePostType === 'vcv_tutorials') {
            if (isset($template['postMeta']['vcvSourceCss'][0])) {
                update_post_meta(
                    $templateId,
                    'vcvSourceCss',
                    $template['postMeta']['vcvSourceCss'][0]
                );
            }

            if (isset($template['postMeta']['vcvSettingsSourceCustomCss'][0])) {
                update_post_meta(
                    $templateId,
                    'vcvSettingsSourceCustomCss',
                    $template['postMeta']['vcvSettingsSourceCustomCss'][0]
                );
            }
        }
    }

    /**
     * @param $template
     *
     * @return mixed
     */
    protected function processTemplateMetaImages($template)
    {
        $wpMediaHelper = vchelper('WpMedia');
        $urlHelper = vchelper('Url');
        if ($wpMediaHelper->checkIsImage($template['preview'])) {
            $url = $template['preview'];
            if (!$urlHelper->isUrl($url) && strpos($url, '[publicPath]') === false) {
                $url = '[publicPath]' . $url;
            }

            $preview = $this->processSimple($url, $template);
            if ($preview) {
                $template['preview'] = $preview;
            }
        }

        if ($wpMediaHelper->checkIsImage($template['thumbnail'])) {
            $url = $template['thumbnail'];
            if (!$urlHelper->isUrl($url) && strpos($url, '[publicPath]') === false) {
                $url = '[publicPath]' . $url;
            }

            $thumbnail = $this->processSimple($url, $template);
            if ($thumbnail) {
                $template['thumbnail'] = $thumbnail;
            }
        }

        return $template;
    }

    /**
     * @param $url
     * @param $template
     * @param string $prefix
     *
     * @return bool|mixed|string
     */
    protected function processSimple($url, $template, $prefix = '')
    {
        $fileHelper = vchelper('File');
        $hubTemplatesHelper = vchelper('HubTemplates');
        $urlHelper = vchelper('Url');
        $assetsHelper = vchelper('Assets');

        if ($urlHelper->isUrl($url)) {
            $imageFile = $fileHelper->download($url);
            $localImagePath = strtolower($prefix . '' . basename($url));
            if (!vcIsBadResponse($imageFile)) {
                $templatePath = $hubTemplatesHelper->getTemplatesPath($template['id']);
                $fileHelper->createDirectory(
                    $templatePath
                );
                if (!file_exists($templatePath)) {
                    return false;
                }

                if (rename($imageFile, $templatePath . '/' . $localImagePath)) {
                    return $assetsHelper->getAssetUrl(
                        'templates/' . $template['id'] . '/' . $localImagePath
                    );
                }
            } else {
                return false;
            }
        } else {
            // File located locally
            if (strpos($url, '[publicPath]') !== false) {
                $url = str_replace('[publicPath]', '', $url);

                return $hubTemplatesHelper->getTemplatesUrl($template['id'] . '/' . ltrim($url, '\\/'));
            }

            if (strpos($url, 'assets/elements/') !== false) {
                return $hubTemplatesHelper->getTemplatesUrl($template['id'] . '/' . ltrim($url, '\\/'));
            }

            return $url; // it is local file url (default file)
        }

        return false;
    }

    /**
     * @param $imageData
     * @param $template
     * @param string $prefix
     *
     * @return array
     */
    protected function processWpMedia($imageData, $template, $prefix = '')
    {
        $newMedia = [];
        $newIds = [];

        $value = $imageData['value'];
        $images = is_array($value) && isset($value['urls']) ? $value['urls'] : $value;
        if (is_string($images)) {
            $images = [
                $images => $images,
            ];
        }
        if (!empty($images) && is_array($images)) {
            foreach ($images as $key => $image) {
                if (is_string($image)) {
                    $newMediaData = $this->processSimple($image, $template, $prefix . $key . '-');
                } else {
                    $newMediaData = $this->processSimple($image['full'], $template, $prefix . $key . '-');
                }
                if ($newMediaData) {
                    $attachment = $this->addImageToMediaLibrary($newMediaData);

                    if (is_string($image)) {
                        $image = $attachment['url'];
                    } else {
                        $image['url'] = $attachment['url'];
                    }
                    $newMedia[] = $image;
                    $newIds[] = $attachment['id'];
                }
            }
        }

        return ['newMedia' => $newMedia, 'newIds' => $newIds];
    }

    /**
     * @param $templateElements
     * @param $template
     * @param $newTemplateId
     *
     * @return mixed
     */
    protected function processDesignOptions($templateElements, $template)
    {
        $arrayIterator = new \RecursiveArrayIterator($templateElements);
        $recursiveIterator = new \RecursiveIteratorIterator($arrayIterator, \RecursiveIteratorIterator::SELF_FIRST);

        $keys = [
            'image',
            'images',
        ];

        foreach ($recursiveIterator as $key => $value) {
            if (is_array($value) && in_array($key, $keys, true) && isset($value['urls'])) {
                $newValue = $this->processWpMedia(['value' => $value], $template);

                if ($newValue) {
                    $newMedia = [];
                    $newMedia['ids'] = $newValue['newIds'];
                    $newMedia['urls'] = $newValue['newMedia'];
                    // Get the current depth and traverse back up the tree, saving the modifications
                    $currentDepth = $recursiveIterator->getDepth();
                    for ($subDepth = $currentDepth; $subDepth >= 0; $subDepth--) {
                        // Get the current level iterator
                        $subIterator = $recursiveIterator->getSubIterator($subDepth);
                        // If we are on the level we want to change
                        // use the replacements ($value) other wise set the key to the parent iterators value
                        if ($subDepth === $currentDepth) {
                            $subIterator->offsetSet(
                                $subIterator->key(),
                                $newMedia
                            );
                        } else {
                            $subIterator->offsetSet(
                                $subIterator->key(),
                                $recursiveIterator->getSubIterator(
                                    ($subDepth + 1)
                                )->getArrayCopy()
                            );
                        }
                    }
                }
            }
        }

        return $recursiveIterator->getArrayCopy();
    }

    /**
     * @param $templateElements
     *
     * @return mixed
     */
    protected function isMenuExist($templateElements)
    {
        foreach ($templateElements as $element) {
            if (isset($element['menuSource']) && !empty($element['menuSource'])) {
                $menusFromKey = get_terms(
                    [
                        'taxonomy' => 'nav_menu',
                        'slug' => $element['menuSource'],
                    ]
                );
                if (empty($menusFromKey)) {
                    $templateElements[ $element['id'] ]['menuSource'] = '';
                }
            }
        }

        return $templateElements;
    }

    /**
     * @param $elementsImages
     * @param $template
     * @param $templateElements
     *
     * @return mixed
     */
    protected function processTemplateImages($elementsImages, $template, $templateElements)
    {
        foreach ($elementsImages as $element) {
            foreach ($element['media'] as $key => $media) {
                if (isset($media['complex']) && $media['complex']) {
                    $imageData = $this->processWpMedia(
                        $media,
                        $template,
                        $element['elementId'] . '-' . $media['key'] . '-'
                    );
                } else {
                    // it is simple url
                    $imageData = $this->processSimple(
                        $media['url'],
                        $template,
                        $element['elementId'] . '-' . $media['key'] . '-'
                    );
                }
                $newImageData = $imageData['newMedia'];
                if (!is_wp_error($newImageData) && $newImageData) {
                    if (isset($templateElements[ $element['elementId'] ][ $media['key'] ]['urls'])) {
                        $templateElements[ $element['elementId'] ][ $media['key'] ]['urls'] = $imageData['newMedia'];
                        $templateElements[ $element['elementId'] ][ $media['key'] ]['ids'] = $imageData['newIds'];
                    } else {
                        $templateElements[ $element['elementId'] ][ $media['key'] ][ $key ] = $newImageData[0];
                    }
                }
            }
        }

        return $templateElements;
    }

    /**
     * Add image to media library
     *
     * @param $imageUrl
     *
     * @return array
     */
    protected function addImageToMediaLibrary($imageUrl)
    {
        if (array_key_exists($imageUrl, $this->importedImages) === false) {
            $fileHelper = vchelper('File');
            $wpUploadDir = wp_upload_dir();
            $localMediaPath = str_replace($wpUploadDir['baseurl'], $wpUploadDir['basedir'], $imageUrl);
            $fileType = wp_check_filetype(basename($localMediaPath), null);
            $imageNewUrl = $wpUploadDir['path'] . '/' . basename($localMediaPath);
            $fileHelper->copyFile($localMediaPath, $imageNewUrl);

            $attachment = [
                'guid' => $wpUploadDir['url'] . '/' . basename($localMediaPath),
                'post_mime_type' => $fileType['type'],
                'post_title' => preg_replace('/\.[^.]+$/', '', basename($localMediaPath)),
                'post_content' => '',
                'post_status' => 'inherit',
            ];

            $attachment = wp_insert_attachment(
                $attachment,
                $wpUploadDir['path'] . '/' . basename($localMediaPath),
                get_the_ID()
            );

            if (version_compare(get_bloginfo('version'), '5.3', '>=')) {
                wp_generate_attachment_metadata(
                    $attachment,
                    $imageNewUrl
                );
            } else {
                wp_update_attachment_metadata(
                    $attachment,
                    wp_generate_attachment_metadata(
                        $attachment,
                        $imageNewUrl
                    )
                );
            }

            $this->importedImages[ $imageUrl ] = [
                'id' => $attachment,
                'url' => $wpUploadDir['url'] . '/' . basename($localMediaPath),
            ];
        }

        return $this->importedImages[ $imageUrl ];
    }
}
