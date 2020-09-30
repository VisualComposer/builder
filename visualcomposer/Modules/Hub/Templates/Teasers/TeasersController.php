<?php

namespace VisualComposer\Modules\Hub\Templates\Teasers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Data;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;

class TeasersController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:ajax:hub:templates:teasers:updateStatus:adminNonce', 'ajaxSetTemplateTeaserStatus');

        $this->addFilter('vcv:editor:variables', 'outputTeaserTemplates');
        $this->addFilter('vcv:hub:variables', 'outputTeaserTemplates');
    }

    /**
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\Data $dataHelper
     *
     * @return bool
     */
    protected function ajaxSetTemplateTeaserStatus(
        $response,
        $payload,
        Request $requestHelper,
        Options $optionsHelper,
        Data $dataHelper
    ) {
        $tag = $requestHelper->input('vcv-item-tag');
        $teaserTemplates = $optionsHelper->get('hubTeaserTemplates', false);
        $newTemplateKey = $dataHelper->arraySearch(
            $teaserTemplates,
            'bundle',
            $tag,
            true
        );
        if ($newTemplateKey !== false) {
            $teaserTemplates[ $newTemplateKey ]['isNew'] = false;
            $optionsHelper->set('hubTeaserTemplates', $teaserTemplates);
        }

        return true;
    }

    protected function outputTeaserTemplates($variables, Options $optionsHelper)
    {
        $value = array_values(
            (array)$optionsHelper->get(
                'hubTeaserTemplates',
                []
            )
        );
        $key = 'VCV_HUB_GET_TEMPLATES_TEASER';

        $variables[] = [
            'key' => $key,
            'value' => $value,
            'type' => 'constant',
        ];

        return $variables;
    }
}
