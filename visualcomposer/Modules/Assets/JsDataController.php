<?php

namespace VisualComposer\Modules\Assets;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;

class JsDataController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        if (vcvenv('VCV_TF_JS_SETTINGS')) {
            $this->addFilter(
                'vcv:dataAjax:getData',
                'getData'
            );
            $this->addFilter(
                'vcv:dataAjax:setData',
                'setData'
            );
        }
    }

    protected function getData($response, $payload, CurrentUser $currentUserAccessHelper, Options $optionsHelper)
    {
        // @codingStandardsIgnoreLine
        global $post_type_object;
        $sourceId = $payload['sourceId'];
        if (is_numeric($sourceId)
            // @codingStandardsIgnoreLine
            && $currentUserAccessHelper->wpAll([$post_type_object->cap->read, $sourceId])->get()
        ) {
            $sourceLocalJs = get_post_meta($sourceId, 'vcv-settingsLocalJs', true);
            $response['jsSettings'] = [
                'local' => $sourceLocalJs ? $sourceLocalJs : '',
                'global' => $optionsHelper->get('settingsGlobalJs', ''),
            ];

            return $response;
        }

        return $response;
    }

    protected function setData($response, $payload, CurrentUser $currentUserAccessHelper)
    {
        $requestHelper = vchelper('Request');
        $sourceId = $payload['sourceId'];
        // @codingStandardsIgnoreLine
        global $post_type_object;
        // @codingStandardsIgnoreLine
        if (is_numeric($sourceId)
            && $currentUserAccessHelper->wpAll(
            // @codingStandardsIgnoreLine
                [$post_type_object->cap->edit_post, $sourceId]
            )->get()
        ) {
            if ($requestHelper->input('wp-preview', '') === 'dopreview') {
                $this->setPreviewLocalJs($sourceId);
                $this->setPreviewGlobalJs($sourceId);
            } else {
                $this->setSourceJs($sourceId);
                $this->setGlobalJs();
            }
        }

        return $response;
    }

    protected function setPreviewLocalJs($sourceId)
    {
        $requestHelper = vchelper('Request');
        $localJsInput = $requestHelper->input('vcv-settings-source-local-js', '');
        update_post_meta($sourceId, 'vcv-preview-settingsLocalJs', $localJsInput);
    }

    protected function setPreviewGlobalJs($sourceId)
    {
        $requestHelper = vchelper('Request');
        $globalJsInput = $requestHelper->input('vcv-settings-global-js', '');
        update_post_meta($sourceId, 'vcv-preview-settingsGlobalJs', $globalJsInput);
    }

    protected function setSourceJs($sourceId)
    {
        // save source meta
        $requestHelper = vchelper('Request');
        $jsInput = $requestHelper->input('vcv-settings-source-local-js', '');
        update_post_meta($sourceId, 'vcv-settingsLocalJs', $jsInput);
    }

    protected function setGlobalJs()
    {
        // save global options
        $requestHelper = vchelper('Request');
        $optionsHelper = vchelper('Options');
        $jsInput = $requestHelper->input('vcv-settings-global-js', '');
        $optionsHelper->set('settingsGlobalJs', $jsInput);
    }
}
