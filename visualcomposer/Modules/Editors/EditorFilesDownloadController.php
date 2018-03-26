<?php

namespace VisualComposer\Modules\Editors;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\File;
use VisualComposer\Helpers\Hub\Actions\EditorBundle;
use VisualComposer\Helpers\Logger;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class EditorFilesDownloadController
 * @package VisualComposer\Modules\Editors
 */
class EditorFilesDownloadController extends Container implements Module
{
    use EventsFilters;

    /**
     * EditorFilesDownloadController constructor.
     *
     * @param \VisualComposer\Helpers\Options $optionsHelper
     */
    public function __construct(Options $optionsHelper)
    {
        if (vcvenv('VCV_ENV_EXTENSION_DOWNLOAD')) {
            /** @see \VisualComposer\Modules\Editors\EditorFilesDownloadController::updateEditorFiles */
            $this->addFilter(
                'vcv:hub:download:bundle vcv:hub:download:bundle:editor vcv:hub:download:bundle:editors/*',
                'updateEditorFiles',
                80
            );
        }
    }

    /**
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\File $fileHelper
     * @param \VisualComposer\Helpers\Hub\Actions\EditorBundle $hubBundleHelper
     * @param Logger $loggerHelper
     *
     * @return array|bool
     */
    protected function updateEditorFiles(
        $response,
        $payload,
        File $fileHelper,
        EditorBundle $hubBundleHelper,
        Logger $loggerHelper
    ) {
        $bundleJson = $payload['archive'];
        if (vcIsBadResponse($response) || is_wp_error($bundleJson)) {
            $messages = [];
            $messages[] = __('Failed to update editor', 'vcwb') . ' #10027';
            if (is_wp_error($response)) {
                /** @var \WP_Error $response */
                $messages[] = implode('. ', $response->get_error_messages()) . ' #10028';
            } elseif (is_array($response) && isset($response['body'])) {
                // @codingStandardsIgnoreLine
                $resultDetails = @json_decode($response['body'], 1);
                if (is_array($resultDetails) && isset($resultDetails['message'])) {
                    $messages[] = $resultDetails['message'] . ' #10029';
                }
            }
            if (is_wp_error($bundleJson)) {
                /** @var \WP_Error $bundleJson */
                $messages[] = implode('. ', $bundleJson->get_error_messages()) . ' #10030';
            } elseif (is_array($bundleJson) && isset($bundleJson['body'])) {
                // @codingStandardsIgnoreLine
                $resultDetails = @json_decode($bundleJson['body'], 1);
                if (is_array($resultDetails) && isset($resultDetails['message'])) {
                    $messages[] = $resultDetails['message'] . ' #10031';
                }
            }

            $loggerHelper->log(
                implode('. ', $messages),
                [
                    'response' => is_wp_error($response) ? 'wp error' : $response,
                    'bundleJson' => is_wp_error($bundleJson) ? 'wp error' : $response,
                ]
            );

            return ['status' => false];
        }
        //if (isset($bundleJson['editor']) && $bundleJson['editor']) {
        $fileHelper->createDirectory(VCV_PLUGIN_ASSETS_DIR_PATH . '/editor');
        $fileHelper->copyDirectory(
            $hubBundleHelper->getTempBundleFolder('editor'),
            VCV_PLUGIN_ASSETS_DIR_PATH . '/editor',
            false
        );
        // $optionHelper->set('bundleUpdateRequired', false);
        // $optionHelper->set('bundleVersion', $bundleJson['editor']);
        // }

        return $response;
    }
}
