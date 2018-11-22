<?php

namespace VisualComposer\Modules\Hub\Elements\Teasers;

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
        $this->addEvent('vcv:hub:process:action:hubTeaser', 'processAction');
        $this->addEvent('vcv:system:factory:reset', 'unsetOptions');
    }

    protected function processAction($teasers, Options $optionsHelper)
    {
        if (isset($teasers) && isset($teasers['data'])) {
            $teaserElements = $this->getTeaserElements($teasers['data']['teasers']);
            $optionsHelper->set('hubTeaserElements', $teaserElements);
        }
    }

    protected function getTeaserElements($teasers)
    {
        $groupList = [
            'All Elements' => [
                'id' => 'AllElements0',
                'index' => 0,
                'title' => 'All Elements',
                'elements' => [],
            ],
        ];
        $x = 1;
        $strHelper = vchelper('Str');
        $allElements = [];
        $dataHelper = vchelper('Data');
        foreach ($teasers as $element) {
            $groups = explode(',', $element['group']);
            foreach ($groups as $group) {
                $group = trim($group);
                if (!isset($groupList[ $group ])) {
                    $catIndex = $x++;
                    $groupList[ $group ] = [
                        'id' => ucfirst(strtolower($group)) . $catIndex,
                        'index' => $catIndex,
                        'title' => $group,
                        'elements' => [],
                    ];
                }
                if (isset($element['tag']) && !empty($element['tag'])) {
                    $tag = $element['tag'];
                } else {
                    $tag = lcfirst(
                        $strHelper->studly($strHelper->slugify($element['name'], false))
                    );
                }
                $elementData = [
                    'tag' => $tag,
                    'name' => $element['name'],
                    'metaThumbnailUrl' => $element['thumbnailUrl'],
                    'metaPreviewUrl' => $element['previewUrl'],
                    'metaDescription' => $element['description'],
                    'update' => isset($element['update']) ? $element['update'] : false,
                    'allowDownload' => isset($element['allowDownload']) ? $element['allowDownload'] : false,
                    'bundleType' => isset($element['bundleType']) ? $element['bundleType'] : [],
                ];
                $groupList[ $group ]['elements'][] = $elementData;
                $groupList[ $group ]['elements'] = array_values(
                    $dataHelper->arrayDeepUnique($groupList[ $group ]['elements'])
                );
                $allElements[] = $elementData;
            }
        }
        $groupList['All Elements']['elements'] = array_values($dataHelper->arrayDeepUnique($allElements));

        return $groupList;
    }

    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper->delete('hubTeaserElements');
    }
}
