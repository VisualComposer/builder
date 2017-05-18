<?php

namespace VisualComposer\Modules\Editors\Internationalization;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;

class Locale extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\Internationalization\Locale::outputLocalizations */
        $this->addFilter('vcv:backend:extraOutput vcv:frontend:head:extraOutput', 'outputLocalizations');
    }

    protected function outputLocalizations($response, $payload)
    {
        $response = array_merge(
            $response,
            [
                vcview(
                    'i18n/locale',
                    [
                        'locale' => [
                            'addElement' => __('Pievienot elementu', 'vcwb'),
                            'addTemplate' => __('Pievienot veidni', 'vcwb'),
                            'treeView' => __('Koka skats', 'vcwb'),
                            'undo' => __('Atpakaļ', 'vcwb'),
                            'redo' => __('Uz priekšu', 'vcwb'),
                            'responsiveView' => __('Responsīvais skats', 'vcwb'),
                            'desktop' => __('Desktops', 'vcwb'),
                            'tabletLandscape' => __('Planšete ainava', 'vcwb'),
                            'tabletPortrait' => __('Planšete portrets', 'vcwb'),
                            'mobileLandscape' => __('Mobilais ainava', 'vcwb'),
                            'mobilePortrait' => __('Mobilais portrets', 'vcwb'),
                            'settings' => __('Iestatījumi', 'vcwb'),
                            'update' => __('Atjaunot', 'vcwb'),
                            'menu' => __('Izvēlne', 'vcwb'),
                            'viewPage' => __('Rādīt lapu', 'vcwb'),
                            'backendEditor' => __('Atpakaļeditors', 'vcwb'),
                            'editInBackendEditor' => __('Rediģēt atpakaļeditorā', 'vcwb'),
                            'wordPressDashboard' => __('WordPress panelis', 'vcwb'),
                            'publish' => __('Publicēt', 'vcwb'),
                            'submitForReview' => __('Iesniegt pārskatīšanai', 'vcwb'),
                            'saveDraft' => __('Saglabāt melnrakstu', 'vcwb'),
                            'close' => __('Aizvērt', 'vcwb'),
                            'premiumElementsButton' => __('Premium elementi - iznāk drīz', 'vcwb'),
                            'premiumTemplatesButton' => __('Premium veidnes - iznāk drīz', 'vcwb'),
                            // @codingStandardsIgnoreLine
                            'emptyTreeView' => __('There are no elements on your canvas - start by adding element or template', 'vcwb'),
                            'customCSS' => __('Custom CSS', 'vcwb'),
                            'localCSS' => __('Local CSS', 'vcwb'),
                            'localCSSLabel' => __('Local CSS will be applied to this particular page only', 'vcwb'),
                            'globalCSS' => __('Global CSS', 'vcwb'),
                            'globalCSSLabel' => __('Global CSS will be applied site wide', 'vcwb'),
                            'save' => __('Save', 'vcwb'),
                            'templateName' => __('Template Name', 'vcwb'),
                            'saveTemplate' => __('Save Template', 'vcwb'),
                            'templateSaveFailed' => __('Template save failed.', 'vcwb'),
                            'downloadMoreTemplates' => __('Download More Templates', 'vcwb'),
                            // @codingStandardsIgnoreLine
                            'noTemplatesFound' => __('You don\'t have any templates yet. Try to save your current layout as a template or download templates from Visual Composer Hub.', 'vcwb'),
                            // @codingStandardsIgnoreLine
                            'notRightTemplatesFound' => __('Didn\'t find the right template? Check out Visual Composer Hub for more layout templates.', 'vcwb'),
                            'removeTemplateWarning' => __('Do you want to remove this template?', 'vcwb'),
                            'templateRemoveFailed' => __('Template remove failed.', 'vcwb'),
                            'blankPageHeadingPart1' => __('Select Blank Canvas', 'vcwb'),
                            'blankPageHeadingPart2' => __('or Start With a Template', 'vcwb'),
                            // @codingStandardsIgnoreLine
                            'blankPageHelperText' => __('Visual Composer Hub will offer you unlimited download of premium quality templates, elements, extensions and more.', 'vcwb'),
                            'add' => __('Add', 'vcwb'),
                            'rowLayout' => __('Row Layout', 'vcwb'),
                            'edit' => __('Edit', 'vcwb'),
                            'clone' => __('Clone', 'vcwb'),
                            'remove' => __('Remove', 'vcwb'),
                            'move' => __('Move', 'vcwb'),
                        ],
                    ]
                ),
            ]
        );

        return $response;
    }
}
