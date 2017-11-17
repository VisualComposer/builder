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
            $this->addFilter('vcv:frontend:head:extraOutput vcv:backend:extraOutput', 'outputTeaserTemplates');
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
        $groupList = [
            'All' => [
                'id' => 'All0',
                'index' => 0,
                'title' => 'All',
                'elements' => [],
            ],
        ];
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
            ];
            $allTemplates[] = $elementData;
        }
        $groupList['All']['elements'] = array_values($dataHelper->arrayDeepUnique($allTemplates));

        return $groupList;
    }

    protected function outputTeaserTemplates($response, $payload, Options $optionsHelper)
    {
        $value = array_values(
            (array)$optionsHelper->get(
                'hubTeaserTemplates',
                [
                    'All' => [
                        'id' => 'All0',
                        'index' => 0,
                        'title' => 'All',
                        'elements' => [],
                    ],
                ]
            )
        );

        return array_merge(
            $response,
            [
                vcview(
                    'partials/constant-script',
                    [
                        'key' => 'VCV_HUB_GET_TEMPLATES_TEASER',
                        'value' => $value,
                    ]
                ),
            ]
        );
    }
}
