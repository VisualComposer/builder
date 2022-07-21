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
        if (isset($teasers['data'])) {
            $teaserTemplatesBefore = $optionsHelper->get('hubTeaserTemplates', false);
            $teaserTemplates = $this->getTeaserTemplates($teasers['data']['templates']);
            if ($teaserTemplatesBefore) {
                $teaserTemplates = $this->compareTeaserTemplates($teaserTemplatesBefore, $teaserTemplates);
            }
            $optionsHelper->set('hubTeaserTemplates', $teaserTemplates);
        }
    }

    protected function getTeaserTemplates($teasers)
    {
        $allTemplates = [];
        $dataHelper = vchelper('Data');
        foreach ($teasers as $template) {
            $templateData = [
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
                'introPageImageUrl' => isset($template['introPageImageUrl']) ? $template['introPageImageUrl'] : '',
                'isPageIntro' => empty($template['isPageIntro']) ? false : true,
            ];
            $allTemplates[] = $templateData;
        }
        $templates = array_values($dataHelper->arrayDeepUnique($allTemplates));

        return $templates;
    }

    /**
     * @param array $teaserTemplatesBefore
     * @param array $teaserTemplates
     *
     * @return array
     */
    protected function compareTeaserTemplates($teaserTemplatesBefore, $teaserTemplates)
    {
        // Compare old with new
        // It will give us list of items that was newly added.
        $dataHelper = vchelper('Data');

        // Merge items that already isNew
        while (
            $newTemplateKey = $dataHelper->arraySearchKey(
                $teaserTemplatesBefore,
                'isNew'
            )
        ) {
            $newTeaserTemplateKey = $dataHelper->arraySearch(
                $teaserTemplates,
                'bundle',
                $teaserTemplatesBefore[ $newTemplateKey ]['bundle'],
                true
            );
            if ($newTeaserTemplateKey !== false) {
                $teaserTemplates[ $newTeaserTemplateKey ]['isNew'] = $teaserTemplatesBefore[ $newTemplateKey ]['isNew'];
            }
            unset($teaserTemplatesBefore[ $newTemplateKey ]['isNew']);
        }

        $templatesBefore = $dataHelper->arrayColumn(
            $teaserTemplatesBefore,
            'bundle'
        );
        $newTemplates = $dataHelper->arrayColumn($teaserTemplates, 'bundle');

        $difference = array_diff($newTemplates, $templatesBefore);
        if (!empty($difference)) {
            // There are new item
            foreach ($difference as $diffTemplate) {
                // it is new item so mark it as isNew = true
                $newTemplateKey = $dataHelper->arraySearch(
                    $teaserTemplates,
                    'bundle',
                    $diffTemplate,
                    true
                );
                if ($newTemplateKey !== false) {
                    $teaserTemplates[ $newTemplateKey ]['isNew'] = true;
                }
            }
        }

        return $teaserTemplates;
    }
}
