<?php

namespace VisualComposer\Modules\Hub\StockMedia;

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

class StockMediaDownloadController extends Container implements Module
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
        $this->addFilter(
            'vcv:ajax:hub:giphy:download:adminNonce',
            'download'
        );
        $this->addFilter('vcv:editor:variables', 'addVariables');
        $this->addFilter('vcv:hub:variables', 'addVariables');
    }

    /**
     * Download image from API
     *
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\License $licenseHelper
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserHelper
     *
     * @return array
     * @throws \ReflectionException
     * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
     */
    protected function download(
        $response,
        $payload,
        Request $requestHelper,
        License $licenseHelper,
        CurrentUser $currentUserHelper
    ) {
        $active = $licenseHelper->isPremiumActivated()
            && $requestHelper->exists('vcv-imageId')
            && $currentUserHelper->wpAll($this->capability)->get();

        $active = vcfilter('vcv:modules:hub:stockMedia:download', $active);

        if ($active) {
            $imageId = $requestHelper->input('vcv-imageId');
            $imageSize = $requestHelper->input('vcv-imageSize');
            $stockMediaType = $requestHelper->input('vcv-stockMediaType');
            $imageUrl = $this->getDownloadUrl($imageId, $imageSize, $stockMediaType);

            if ($imageUrl) {
                /** @see \VisualComposer\Modules\Hub\StockMedia\StockMediaDownloadController::downloadImage */
                return $this->call(
                    'downloadImage',
                    [
                        'imageUrl' => $imageUrl,
                        'imageSize' => $imageSize,
                        'stockMediaType' => $stockMediaType,
                    ]
                );
            }

            $this->message = $this->setMessage(
                __('Failed to get the media\'s item ID, please try again.', 'visualcomposer') . ' #10084'
            );

            return ['status' => false, 'message' => $this->message];
        }

        $this->message = $this->setMessage(
            __(
                'No access to upload files. Check your license options to make sure you are allowed to upload files.',
                'visualcomposer'
            )
            . ' #10083'
        );

        return ['status' => false, 'message' => $this->message];
    }

    /**
     * @param $imageUrl
     * @param $imageSize
     * @param $stockMediaType
     * @param \VisualComposer\Helpers\File $fileHelper
     *
     * @return array
     */
    protected function downloadImage($imageUrl, $imageSize, $stockMediaType, File $fileHelper)
    {
        $parseUrl = wp_parse_url($imageUrl);
        if (
            in_array($stockMediaType, ['giphy', 'unsplash'], true)
            && preg_match('/(.*)(\.' . $stockMediaType . '\.com)$/', $parseUrl['host'])
        ) {
            if ($stockMediaType === 'unsplash') {
                $imageUrl = $imageUrl . '&w=' . intval($imageSize);
            }
            $tempImage = $fileHelper->download($imageUrl);
            $imageType = exif_imagetype($tempImage);
            if (
                ($stockMediaType === 'unsplash' && in_array($imageType, [IMAGETYPE_JPEG, IMAGETYPE_PNG], true))
                || ($stockMediaType === 'giphy' && $imageType === IMAGETYPE_GIF)
            ) {
                if (!vcIsBadResponse($tempImage)) {
                    $results = $this->moveTemporarilyToUploads($parseUrl, $imageType, $tempImage);

                    if ($results && !isset($results['error']) && $this->addImageToMediaLibrary($results)) {
                        return ['status' => true];
                    }

                    /** @var \WP_Error $results */
                    if (is_object($results)) {
                        $this->message = $this->setMessage(
                            esc_html(
                                $results->get_error_message()
                            ) . ' #10080'
                        );
                    } else {
                        $this->message = $this->setMessage(
                            esc_html(
                                __(
                                    'Wrong image extension.',
                                    'visualcomposer'
                                )
                            ) . ' #10080'
                        );
                    }

                    return ['status' => false, 'message' => $this->message];
                }

                $this->message = $this->setMessage(
                    __(
                        'Failed to download the image. Make sure the upload folder is writable and try again.',
                        'visualcomposer'
                    ) . ' #10081'
                );

                return ['status' => false, 'message' => $this->message];
            }

            $fileHelper->removeFile($tempImage);
            $this->message = $this->setMessage(__('Unknown image format.', 'visualcomposer') . ' #10085');

            return ['status' => false, 'message' => $this->message];
        }
        $this->message = $this->setMessage(__('Unknown image provider.', 'visualcomposer') . ' #10082');

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
        if ($currentUserHelper->wpAll($this->capability)->get()) {
            $variables[] = [
                'key' => 'VCV_LICENSE_KEY',
                'value' => vcfilter('vcv:modules:Hub:StockMedia:addVariables:licenseKey', $licenseHelper->getKey()),
                'type' => 'constant',
            ];
            if (defined('VCV_AUTHOR_API_KEY') && $licenseHelper->isThemeActivated()) {
                $variables[] = [
                    'key' => 'VCV_LICENSE_UNSPLASH_AUTHOR_API_KEY',
                    'value' => constant('VCV_AUTHOR_API_KEY'),
                    'type' => 'constant',
                ];
            }
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

        if (version_compare(get_bloginfo('version'), '5.3', '>=')) {
            return wp_generate_attachment_metadata(
                $attachment,
                $results['file']
            );
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
        } elseif ($imageType === IMAGETYPE_GIF) {
            $extension = 'gif';
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
     * @param $imageSize
     * @param $stockMediaType
     *
     * @return mixed
     */
    protected function getDownloadUrl($imageId, $imageSize, $stockMediaType)
    {
        $licenseHelper = vchelper('License');
        $licenseKey = vcfilter('vcv:modules:Hub:StockMedia:addVariables:licenseKey', $licenseHelper->getKey());
        if ($stockMediaType === 'giphy') {
            $requestUrl = sprintf(
                '%s/api/giphy/download/%s?size=%s&licenseKey=%s&url=%s',
                rtrim(vcvenv('VCV_API_URL'), '\\/'),
                $imageId,
                $imageSize,
                $licenseKey,
                VCV_PLUGIN_URL
            );
        } else {
            $requestUrl = sprintf(
                '%s/api/unsplash/download/%s?licenseKey=%s&url=%s%s',
                rtrim(vcvenv('VCV_API_URL'), '\\/'),
                $imageId,
                $licenseKey,
                VCV_PLUGIN_URL,
                defined('VCV_AUTHOR_API_KEY') && $licenseHelper->isThemeActivated() ? ('&author_api_key='
                    . constant('VCV_AUTHOR_API_KEY')) : ''
            );
        }
        $response = wp_remote_get(
            $requestUrl,
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
