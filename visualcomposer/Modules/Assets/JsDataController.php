<?php

namespace VisualComposer\Modules\Assets;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class JsDataController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct()
    {
        $this->addFilter(
            'vcv:dataAjax:getData',
            'getData'
        );
        $this->addFilter(
            'vcv:dataAjax:setData',
            'setData'
        );
        $this->wpAddAction('save_post', 'sanitizeJsFields');
    }

    protected function getData($response, $payload, Options $optionsHelper)
    {
        $sourceId = $payload['sourceId'];
        $sourceLocalJsHead = get_post_meta($sourceId, VCV_PREFIX . 'settingsLocalJsHead', true);
        $sourceLocalJsFooter = get_post_meta($sourceId, VCV_PREFIX . 'settingsLocalJsFooter', true);
        $response['jsSettings'] = [
            'localJsHead' => $sourceLocalJsHead ? $sourceLocalJsHead : '',
            'localJsFooter' => $sourceLocalJsFooter ? $sourceLocalJsFooter : '',
            'globalJsHead' => $optionsHelper->get('settingsGlobalJsHead', ''),
            'globalJsFooter' => $optionsHelper->get('settingsGlobalJsFooter', ''),
        ];

        return $response;
    }

    protected function setData($response, $payload)
    {
        $frontendHelper = vchelper('Frontend');
        if (!$frontendHelper->isPreview()) {
            $sourceId = $payload['sourceId'];
            $this->setSourceJs($sourceId);
            $this->setGlobalJs();
        }

        return $response;
    }

    protected function setSourceJs($sourceId)
    {
        $requestHelper = vchelper('Request');
        $jsInputHead = $requestHelper->input('vcv-settings-source-local-head-js', '');
        update_post_meta($sourceId, VCV_PREFIX . 'settingsLocalJsHead', wp_slash($jsInputHead));
        $jsInputFooter = $requestHelper->input('vcv-settings-source-local-footer-js', '');
        update_post_meta($sourceId, VCV_PREFIX . 'settingsLocalJsFooter', wp_slash($jsInputFooter));
    }

    protected function setGlobalJs()
    {
        // save global options
        $requestHelper = vchelper('Request');
        $optionsHelper = vchelper('Options');
        $jsInputHead = $requestHelper->input('vcv-settings-global-head-js', '');
        $optionsHelper->set('settingsGlobalJsHead', $jsInputHead);

        $jsInputFooter = $requestHelper->input('vcv-settings-global-footer-js', '');
        $optionsHelper->set('settingsGlobalJsFooter', $jsInputFooter);
    }

    /**
     * Sanitize JS fields to prevent add scripts for users without unfiltered_html capability
     *
     * @param $postID
     * @return void
     */
    public function sanitizeJsFields($postID)
    {
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        if (current_user_can('unfiltered_html')) {
            return;
        }

        if (!isset($_POST['_wpnonce']) || !check_admin_referer('update-post_' . $postID)) {
            return;
        }

        if (!isset($_POST['meta']) || ! is_array($_POST['meta'])) {
            return;
        }

        foreach ($_POST['meta'] as $metaValues) {
            if (isset($metaValues['key']) && isset($metaValues['value'])) {
                if ($metaValues['key'] === VCV_PREFIX . 'settingsLocalJsHead' || $metaValues['key'] === VCV_PREFIX . 'settingsLocalJsFooter') {
                    $sanitizedValue = wp_kses($metaValues['value'], array());
                    update_post_meta($postID, $metaValues['key'], $sanitizedValue);
                }
            }
        }
    }
}
