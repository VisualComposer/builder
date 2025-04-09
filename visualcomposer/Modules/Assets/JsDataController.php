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
        $this->wpAddAction('sanitize_post_meta_vcv-settingsLocalJsHead', 'sanitizeJsFields');
        $this->wpAddAction('sanitize_post_meta_vcv-settingsLocalJsFooter', 'sanitizeJsFields');
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
     * @param string $data
     * @return string
     */
    public function sanitizeJsFields($data)
    {
        if (current_user_can('unfiltered_html')) {
            return $data;
        }

        return wp_kses($data, array());
    }
}
