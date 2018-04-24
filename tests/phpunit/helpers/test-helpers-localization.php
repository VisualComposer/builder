<?php

class HelpersLocalizationTest extends WP_UnitTestCase
{
    public function testLocalization()
    {
        /**
         * @var  $helper VisualComposer\Helpers\Localizations
         */
        $helper = vcapp('VisualComposer\Helpers\Localizations');

        $this->assertTrue(is_object($helper), 'File helper should be an object');
        $this->assertTrue(is_array($helper->getLocalizations()), 'Get localization should be an array');

        $keys = [
            'addElement',
            'addTemplate',
            'treeView',
            'undo',
            'redo',
            'responsiveView',
            'desktop',
            'tabletLandscape',
            'tabletPortrait',
            'mobileLandscape',
            'mobilePortrait',
            'settings',
            'update',
            'menu',
            'viewPage',
            'editInBackendEditor',
            'wordPressDashboard',
            'publish',
            'submitForReview',
            'saveDraft',
            'close',
            'premiumElementsButton',
            'premiumTemplatesButton',
            'emptyTreeView',
            'customCSS',
            'localCSS',
            'localCSSLabel',
            'globalCSS',
            'globalCSSLabel',
            'save',
            'templateName',
            'saveTemplate',
            'templateSaveFailed',
            'downloadMoreTemplates',
            'noTemplatesFound',
            'notRightTemplatesFound',
            'removeTemplateWarning',
            'templateRemoveFailed',
            'blankPageHeadingPart1',
            'blankPageHeadingPart2',
            'blankPageHelperText',
            'add',
            'rowLayout',
            'edit',
            'clone',
            'remove',
            'move',
            'searchContentElements',
            'templateAlreadyExists',
            'templateContentEmpty',
            'specifyTemplateName',
            'addOneColumn',
            'addTwoColumns',
            'addThreeColumns',
            'addFourColumns',
            'addFiveColumns',
            'addCustomRowLayout',
            'addTextBlock',
            'frontendEditor',
            'blankPage',
            'searchTemplates',
        ];

        $localications = $helper->getLocalizations();

        foreach ($keys as $k=>$key) {
            $this->assertTrue(array_key_exists($key, $localications), $key.' - key should exist');
        }
    }
}
