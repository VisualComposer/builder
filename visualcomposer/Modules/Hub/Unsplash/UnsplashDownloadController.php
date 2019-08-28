<?php

namespace VisualComposer\Modules\Hub\Unsplash;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\File;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;

class UnsplashDownloadController extends Container implements Module
{
    use EventsFilters;

    protected $message = false;

    protected $capability = 'upload_files';

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Settings\Ajax\SystemStatusController::runAllChecks */
        $this->addFilter(
            'vcv:ajax:hub:unsplash:download:adminNonce',
            'download'
        );
        $this->addFilter('vcv:editor:variables', 'addVariables');
    }

    /**
     * Download image from Unsplash
     *
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\License $licenseHelper
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserHelper
     *
     * @return array
     * @throws \ReflectionException
     */
    protected function download(
        $response,
        $payload,
        Request $requestHelper,
        License $licenseHelper,
        CurrentUser $currentUserHelper
    ) {
        if ($currentUserHelper->wpAll($this->capability)->get() && $licenseHelper->isActivated()
            && $requestHelper->exists(
                'vcv-imageId'
            )) {
            $imageId = $requestHelper->input('vcv-imageId');
            $imageSize = $requestHelper->input('vcv-imageSize');
            $imageUrl = $this->getDownloadUrl($imageId);

            if ($imageUrl) {
                /** @see \VisualComposer\Modules\Hub\Unsplash\UnsplashDownloadController::downloadImage */
                return $this->call(
                    'downloadImage',
                    [
                        'imageUrl' => $imageUrl,
                        'imageSize' => $imageSize,
                    ]
                );
            }

            $this->message = $this->setMessage(
                __('Failed to get the image id, please try again!', 'vcwb') . ' #10084'
            );
        }

        $this->message = $this->setMessage(
            __('No access, please check your license and make sure your capabilities allow to upload files!', 'vcwb')
            . ' #10083'
        );

        return ['status' => false, 'message' => $this->message];
    }

    /**
     * @param $imageUrl
     * @param $imageSize
     * @param \VisualComposer\Helpers\File $fileHelper
     *
     * @return array
     */
    protected function downloadImage($imageUrl, $imageSize, File $fileHelper)
    {
        $parseUrl = parse_url($imageUrl);
        if (preg_match('/(.*)(\.unsplash\.com)$/', $parseUrl['host'])) {
            $tempImage = $fileHelper->download($imageUrl . '&w=' . intval($imageSize));
            $imageType = exif_imagetype($tempImage);
            if (in_array(
                $imageType,
                [IMAGETYPE_JPEG, IMAGETYPE_PNG]
            )) {
                if (!vcIsBadResponse($tempImage)) {
                    $results = $this->moveTemporarilyToUploads($parseUrl, $imageType, $tempImage);

                    if ($results && !isset($results['error']) && $this->addImageToMediaLibrary($results)) {
                        return ['status' => true];
                    }

                    /** @var \WP_Error $results */
                    $this->message = $this->setMessage(
                        esc_html(
                            is_object($results) ? $results->get_error_message() : __('Wrong image extension.', 'vcwb')
                        ) . ' #10080'
                    );
                }

                $this->message = $this->setMessage(
                    __(
                        'Failed to download image, make sure that your upload folder is writable and please try again!',
                        'vcwb'
                    ) . ' #10081'
                );
            } else {
                $fileHelper->removeFile($tempImage);
                $this->message = $this->setMessage(__('Unknown image format!', 'vcwb') . ' #10085');
            }
        }
        $this->message = $this->setMessage(__('Unknown image provider!', 'vcwb') . ' #10082');

        return ['status' => false, 'message' => $this->message];
    }

    /**
     * @param $message
     *
     * @return bool|string
     */
    protected function setMessage($message)
    {
        if (!$this->message) {
            return $message;
        }

        return $this->message;
    }

    /**
     * @param $variables
     * @param \VisualComposer\Helpers\License $licenseHelper
     *
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserHelper
     *
     * @return array
     */
    protected function addVariables($variables, License $licenseHelper, CurrentUser $currentUserHelper)
    {
        if ($currentUserHelper->wpAll($this->capability)->get() && $licenseHelper->isActivated()) {
            $variables[] = [
                'key' => 'VCV_LICENSE_KEY',
                'value' => $licenseHelper->getKey(),
                'type' => 'constant',
            ];
            $variables[] = [
                'key' => 'VCV_API_URL',
                'value' => vcvenv('VCV_API_URL'),
                'type' => 'constant',
            ];
        }

        return $variables;
    }

    /**
     * Add image to media library
     *
     * @param array $results
     *
     * @return bool|int
     */
    protected function addImageToMediaLibrary(array $results)
    {
        $attachment = [
            'guid' => $results['url'],
            'post_mime_type' => $results['type'],
            'post_title' => preg_replace('/\.[^.]+$/', '', basename($results['file'])),
            'post_content' => '',
            'post_status' => 'inherit',
        ];

        $attachment = wp_insert_attachment(
            $attachment,
            $results['file'],
            get_the_ID()
        );

        if (!function_exists('wp_generate_attachment_metadata')) {
            include_once(ABSPATH . 'wp-admin/includes/image.php');
        }

        return wp_update_attachment_metadata(
            $attachment,
            wp_generate_attachment_metadata(
                $attachment,
                $results['file']
            )
        );
    }

    /**
     * Move temporarily file to uploads folder
     *
     * @param $parseUrl
     * @param $imageType
     * @param $tempImage
     *
     * @return array|bool
     */
    protected function moveTemporarilyToUploads($parseUrl, $imageType, $tempImage)
    {
        $fileName = str_replace('/', '', $parseUrl['path']);

        if ($imageType === IMAGETYPE_JPEG) {
            $extension = 'jpg';
        } elseif ($imageType === IMAGETYPE_PNG) {
            $extension = 'png';
        } else {
            return false;
        }
        $fileName .= '.' . $extension;

        $file = [
            'name' => $fileName,
            'type' => 'image/' . $extension,
            'tmp_name' => $tempImage,
            'error' => 0,
            'size' => filesize($tempImage),
        ];
        $overrides = [
            'test_form' => false,
        ];

        $results = wp_handle_sideload($file, $overrides);

        return $results;
    }

    /**
     * @param $imageId
     *
     * @return mixed
     */
    protected function getDownloadUrl($imageId)
    {
        $licenseHelper = vchelper('License');
        $response = wp_remote_get(
            rtrim(vcvenv('VCV_API_URL'), '\\/') . '/api/unsplash/download/' . $imageId . '?licenseKey='
            . $licenseHelper->getKey(),
            [
                'timeout' => 30,
            ]
        );

        if (!vcIsBadResponse($response)) {
            $response = json_decode($response['body'], true);
            if (isset($response['url'])) {
                return $response['url'];
            }
        }

        return false;
    }
}
