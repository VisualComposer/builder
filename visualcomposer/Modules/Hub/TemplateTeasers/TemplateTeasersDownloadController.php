<?php

namespace VisualComposer\Modules\Hub\TemplateTeasers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;

class TemplateTeasersDownloadController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        if (vcvenv('VCV_ENV_HUB_TEMPLATES_TEASER')) {
            $this->addFilter('vcv:hub:process:action:hubTemplates', 'processAction');
        }
    }

    protected function processAction($response, $payload, Options $optionsHelper)
    {
        if (!vcIsBadResponse($response) && $payload['data']) {
            $teaserElements = $this->getTeaserTemplates($payload['data']['templates']);
            $optionsHelper->set('hubTeaserTemplates', $teaserElements);
            $response = ['status' => true];
        }

        return $response;
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
            ];
            $allTemplates[] = $elementData;
        }
        $elements = array_values($dataHelper->arrayDeepUnique($allTemplates));

        return $elements;
    }
}
