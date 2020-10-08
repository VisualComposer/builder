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
        $this->addEvent('vcv:hub:teasers:updateStatus', 'setTemplateTeaserStatus');

        $this->addFilter('vcv:editor:variables', 'outputTeaserTemplates');
        $this->addFilter('vcv:hub:variables', 'outputTeaserTemplates');
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\Data $dataHelper
     */
    protected function setTemplateTeaserStatus(
        Options $optionsHelper,
        Data $dataHelper
    ) {
        $teaserTemplates = $optionsHelper->get('hubTeaserTemplates', false);
        if (!empty($teaserTemplates)) {
            while ($newTemplateKey = $dataHelper->arraySearch($teaserTemplates, 'isNew', true, true)) {
                $teaserTemplates[ $newTemplateKey ]['isNew'] = time();
            }
            $optionsHelper->set('hubTeaserTemplates', $teaserTemplates);
        }
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
