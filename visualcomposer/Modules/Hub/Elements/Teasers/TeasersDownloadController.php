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
        if (isset($teasers, $teasers['data'])) {
            $teaserElementsBefore = $optionsHelper->get('hubTeaserElements', false);
            $teaserElements = [
                'All Elements' => [
                    'id' => 'AllElements0',
                    'index' => 0,
                    'title' => 'All Elements',
                    'elements' => $teasers['data']['teasers'],
                ],
            ];
            if ($teaserElementsBefore) {
                // We can compare $teaserElementsBefore with $teaserElements.
                // It will give us list of items that was newly added.
                $dataHelper = vchelper('Data');
                $elementsBefore = $dataHelper->arrayColumn(
                    $teaserElementsBefore['All Elements']['elements'],
                    'tag'
                );
                $newElements = $dataHelper->arrayColumn($teaserElements['All Elements']['elements'], 'tag');
                $difference = array_diff($newElements, $elementsBefore);
                if (!empty($difference)) {
                    // There are new elements
                    foreach ($difference as $diffElement) {
                        // it is new Element so mark it as isNew = true
                        $newElementKey = $dataHelper->arraySearch(
                            $teaserElements['All Elements']['elements'],
                            'tag',
                            $diffElement,
                            true
                        );
                        if ($newElementKey) {
                            $teaserElements['All Elements']['elements'][ $newElementKey ]['isNew'] = true;
                        }
                    }
                }
            }
            $optionsHelper->set('hubTeaserElements', $teaserElements);
        }
    }

    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper->delete('hubTeaserElements');
    }
}
