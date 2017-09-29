<?php

namespace VisualComposer\Modules\Hub\Teaser;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;

class TeaserDownloadController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        if (vcvenv('VCV_ENV_HUB_TEASER')) {
            $this->addFilter('vcv:hub:process:action:hubTeaser', 'processAction');
        }
    }

    protected function processAction($response, $payload, Options $optionsHelper)
    {
        if (!vcIsBadResponse($response) && $payload['data']) {
            $teaserElements = $this->getTeaserElements($payload['data']['teasers']);
            $optionsHelper->set('hubTeaserElements', $teaserElements);
            $response = ['status' => true];
        }

        return $response;
    }

    protected function getTeaserElements($teasers)
    {
        $categoryList = [
            'All' => [
                'id' => 'All0',
                'index' => 0,
                'title' => 'All',
                'elements' => [],
            ],
        ];
        $x = 1;
        $strHelper = vchelper('Str');
        $allElements = [];
        $dataHelper = vchelper('Data');
        foreach ($teasers as $element) {
            $categories = explode(',', $element['category']);
            foreach ($categories as $category) {
                $category = trim($category);
                $catIndex = $x++;
                if (!isset($categoryList[ $category ])) {
                    $categoryList[ $category ] = [
                        'id' => ucfirst(strtolower($category)) . $catIndex,
                        'index' => $catIndex,
                        'title' => $category,
                        'elements' => [],
                    ];
                }
                $elementData = [
                    'tag' => $strHelper->studly($strHelper->slugify($element['name'])),
                    'name' => $element['name'],
                    'metaThumbnailUrl' => $element['thumbnailUrl'],
                    'metaPreviewUrl' => $element['previewUrl'],
                    'metaDescription' => $element['description'],
                ];
                $categoryList[ $category ]['elements'][] = $elementData;
                $categoryList[ $category ]['elements'] = $dataHelper->arrayDeepUnique($categoryList[ $category ]['elements']);
                $allElements[] = $elementData;
            }
        }
        $categoryList['All']['elements'] = $dataHelper->arrayDeepUnique($allElements);

        return $categoryList;
    }
}
