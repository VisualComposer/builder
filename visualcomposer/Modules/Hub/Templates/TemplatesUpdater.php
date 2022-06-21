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
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\WpMedia;
use WP_Query;

class TemplatesUpdater extends Container implements Module
{
    use EventsFilters;

    protected $importedImages = [];

    public static $needAttachmentMetadataList = [];

    public function __construct()
    {
        $this->addFilter(
            'vcv:hub:download:bundle vcv:hub:download:bundle:template/* vcv:hub:download:bundle:predefinedTemplate/*',
            'updateTemplate'
        );

        $this->addFilter(
            'vcv:ajax:hub:update:attachment:meta:adminNonce',
            'updateAttachment'
        );
    }

    protected function updateTemplate(
        $response,
        $payload,
        Templates $hubTemplatesHelper,
        WpMedia $wpMediaHelper,
        EditorTemplates $editorTemplatesHelper
    ) {
        $template = isset($payload['archive']) ? $payload['archive'] : false;

        if (vcIsBadResponse($response) || !$template || is_wp_error($template)) {
            return ['status' => false];
        }

        $template['id'] = $payload['actionData']['data']['id'];

        $success = $this->processTemplateDirectories($template, $payload);

        if (!$success) {
            return false;
        }

        $templatePostType = isset($payload['actionData']['action']) && $payload['actionData']['action'] === 'template/tutorial' ? 'vcv_tutorials' : 'vcv_templates';
        $template['name'] = $templatePostType === 'vcv_tutorials' ? 'Tutorial Page' : $payload['actionData']['data']['name'];

        $templateMeta = $hubTemplatesHelper->processTemplateMetaImages(
            [
                'id' => $template['id'],
                'preview' => $templatePostType === 'vcv_tutorials' ? '' : $payload['actionData']['data']['preview'],
                'thumbnail' => $templatePostType === 'vcv_tutorials' ? '' : $payload['actionData']['data']['thumbnail'],
            ]
        );

        $template['description'] = $payload['actionData']['data']['description'];
        $template['thumbnail'] = $templateMeta['thumbnail'];
        $template['preview'] = $templateMeta['preview'];

        if ($templatePostType !== 'vcv_tutorials') {
            $elementsImages = $wpMediaHelper->getTemplateElementMedia($template['data']);
        }

        $templateHelper = vchelper('HubTemplates');
        $templateId = $templateHelper->insertNewTemplate(
            $template['id'],
            $templatePostType,
            $payload['actionData']['data']['name']
        );

        if (isset($payload['actionData']['data']['type'])) {
            $type = $payload['actionData']['data']['type'];
        } else {
            $type = 'hub';
        }

        $templateElements = $this->getTemplateElements($template, $templatePostType, $template['id'], $elementsImages);

        unset($template['data']);

        $templateHelper->updateTemplateMetas(
            $templateId,
            $template,
            $type,
            $payload['actionData']['action'],
            $templateElements,
            $templatePostType
        );

        /** @see \VisualComposer\Modules\Editors\Templates\TemplatesDownloadController::updateTemplates */
        if (!isset($response['templates']) || empty($response['templates'])) {
            $response['templates'] = [];
        }

        $response['additionalActionList'] = self::$needAttachmentMetadataList;
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
     * Get template elements.
     *
     * @param array $template
     * @param string $templatePostType
     * @param string $folder
     * @param array $elementsImages
     *
     * @return mixed
     */
    public function getTemplateElements(
        $template,
        $templatePostType,
        $folder,
        $elementsImages = false
    ) {
        $templateElements = $template['data'];
        if ($templatePostType !== 'vcv_tutorials') {
            if ($elementsImages) {
                unset($template['data']);
                $templateElements = $this->processTemplateImages($elementsImages, $template, $templateElements);
                $templateElements = $this->processDesignOptions($templateElements, $template);
            }
        }

        $hubTemplatesHelper = vchelper('HubTemplates');

        // Check if menu source is exist or not
        $templateElements = $hubTemplatesHelper->isMenuExist($templateElements);

        return $hubTemplatesHelper->replaceTemplateElementPathPlaceholder($templateElements, $folder);
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
        $templatesHelper = vchelper('HubTemplates');
        if (!empty($images) && is_array($images)) {
            foreach ($images as $key => $image) {
                if (is_string($image)) {
                    $newMediaData = $templatesHelper->processSimple($image, $template, $prefix . $key . '-');
                } else {
                    $newMediaData = $templatesHelper->processSimple($image['full'], $template, $prefix . $key . '-');
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
                    $templatesHelper = vchelper('HubTemplates');
                    $imageData = $templatesHelper->processSimple(
                        $media['url'],
                        $template,
                        $element['elementId'] . '-' . $media['key'] . '-'
                    );
                }

                if ($imageData && !is_wp_error($imageData)) {
                    if (is_array($imageData)) {
                        if (isset($templateElements[ $element['elementId'] ][ $media['key'] ]['urls'])) {
                            $templateElements[ $element['elementId'] ][ $media['key'] ]['urls'] = $imageData['newMedia'];
                            $templateElements[ $element['elementId'] ][ $media['key'] ]['ids'] = $imageData['newIds'];
                        } else {
                            // Moved to simple url
                            $templateElements[ $element['elementId'] ][ $media['key'] ][ $key ] = $imageData['newMedia'][0];
                        }
                    } else {
                        $templateElements[ $element['elementId'] ][ $media['key'] ][ $key ] = $imageData;
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

            $attachmentId = wp_insert_attachment(
                $attachment,
                $wpUploadDir['path'] . '/' . basename($localMediaPath),
                get_the_ID()
            );

            $requestHelper = vchelper('Request');
            // update template action
            if (!empty($requestHelper->input('vcv-action'))) {
                self::$needAttachmentMetadataList[$attachmentId] = $imageNewUrl;
                // download template action
            } else {
                $this->updateAttachmentMeta($attachmentId, $imageNewUrl);
            }

            $this->importedImages[ $imageUrl ] = [
                'id' => $attachment,
                'url' => $wpUploadDir['url'] . '/' . basename($localMediaPath),
            ];
        }

        return $this->importedImages[ $imageUrl ];
    }

    /**
     * Update attachment.
     *
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @return bool[]
     */
    protected function updateAttachment(Request $requestHelper)
    {
        $attachmentId = $requestHelper->input('vcv-attachment-id');
        $attachmentPath = $requestHelper->input('vcv-attachment-path');

        $this->updateAttachmentMeta($attachmentId, $attachmentPath);

        return ['status' => true];
    }

    /**
     * Update attachment meta and generate sizes.
     *
     */
    protected function updateAttachmentMeta($attachmentId, $attachmentPath)
    {
        if (version_compare(get_bloginfo('version'), '5.3', '>=')) {
            wp_generate_attachment_metadata(
                $attachmentId,
                $attachmentPath
            );
        } else {
            wp_update_attachment_metadata(
                $attachmentId,
                wp_generate_attachment_metadata(
                    $attachmentId,
                    $attachmentPath
                )
            );
        }
    }

    /**
     * Process creating template access directories.
     *
     * @param array $template
     * @param array $payload
     *
     * @return bool
     */
    protected function processTemplateDirectories($template, $payload)
    {
        $hubTemplatesHelper = vchelper('HubTemplates');
        $fileHelper = vchelper('File');
        $hubTemplatesBundleHelper = vchelper('HubBundle');

        $createDirResult = $fileHelper->createDirectory(
            $hubTemplatesHelper->getTemplatesPath()
        );
        if (vcIsBadResponse($createDirResult) && !$fileHelper->isDir($hubTemplatesHelper->getTemplatesPath())) {
            return false;
        }

        // File is locally available
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

        return true;
    }
}
