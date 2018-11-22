<?php

namespace VisualComposer\Modules\Hub\Templates\Teasers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;

class TeasersDownloadController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addEvent('vcv:hub:process:action:hubTemplates', 'processAction');
    }

    protected function processAction($teasers, Options $optionsHelper)
    {
        if (isset($teasers) && isset($teasers['data'])) {
            $teaserTemplates = $this->getTeaserTemplates($teasers['data']['templates']);
            $optionsHelper->set('hubTeaserTemplates', $teaserTemplates);
        }
    }

    protected function getTeaserTemplates($teasers)
    {
        $allTemplates = [];
        $dataHelper = vchelper('Data');
        foreach ($teasers as $template) {
            $elementData = [
                'bundle' => $template['bundle'],
                'name' => $template['name'],
                'metaThumbnailUrl' => $template['thumbnailUrl'],
                'metaPreviewUrl' => $template['previewUrl'],
                'metaDescription' => $template['description'],
                'type' => 'template',
                'templateType' => $template['type'],
                'id' => $template['id'],
                'update' => isset($template['update']) ? $template['update'] : false,
                'allowDownload' => isset($template['allowDownload']) ? $template['allowDownload'] : false,
                'bundleType' => isset($template['bundleType']) ? $template['bundleType'] : [],
            ];
            $allTemplates[] = $elementData;
        }
        $elements = array_values($dataHelper->arrayDeepUnique($allTemplates));

        return $elements;
    }
}
