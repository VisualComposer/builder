<?php

namespace VisualComposer\Modules\Editors\Attributes;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class WpEditor extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    protected $editorButtonStyles = false;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\Attributes\WpEditor::addWpEditorScripts */
        $this->addFilter('vcv:frontend:head:extraOutput', 'addWpEditorScripts');
    }

    protected function addWpEditorScripts($output)
    {
        $output[] = sprintf(
            '<script type="text/html" id="vcv-wpeditor-template">%s</script>',
            $this->getWpEditor()
        );
        $output[] = sprintf(
            '<script type="text/html" id="vcv-wpeditor-dynamic-template">%s</script>',
            $this->getWpEditorDynamic()
        );

        return $output;
    }

    protected function updateTinymceButtons($mceButtons)
    {
        // Remove default fontselect
        if (($key = array_search('fontselect', $mceButtons, true)) !== false) {
            unset($mceButtons[ $key ]);
        }

        // Remove default fontsizeselect
        if (($key = array_search('fontsizeselect', $mceButtons, true)) !== false) {
            unset($mceButtons[ $key ]);
        }

        return array_values($mceButtons);
    }

    protected function addCustomTinymceButtons($mceButtons)
    {
        // only add in tinymce_2

        // Add custom vcvFontsSelect (with google fonts)
        array_unshift($mceButtons, 'letterSpacing');
        array_unshift($mceButtons, 'lineHeight');
        array_unshift($mceButtons, 'fontSizeSelectAdvanced');
        array_unshift($mceButtons, 'fontWeight');
        array_unshift($mceButtons, 'VcvFontsSelect');

        return $mceButtons;
    }

    protected function addCustomTinymcePlugins($plugins)
    {
        $plugins[] = 'vcvhtmleditor';

        return $plugins;
    }

    protected function getWpEditor()
    {
        // @codingStandardsIgnoreStart
        global $wp_rich_edit;
        $wp_rich_edit = true;
        // @codingStandardsIgnoreEnd
        ob_start();
        $this->getEditorButtonStyles();
        /** @see \VisualComposer\Modules\Editors\Attributes\WpEditor::addCustomTinymcePlugins */
        $filterPlugins = $this->wpAddFilter(
            'tiny_mce_plugins',
            'addCustomTinymcePlugins',
            1000,
            1
        ); // take over of tinymce advanced
        /** @see \VisualComposer\Modules\Editors\Attributes\WpEditor::updateTinymceButtons */
        $filter = $this->wpAddFilter('mce_buttons', 'updateTinymceButtons', 1000, 1); // take over of tinymce advanced
        $filterFirstToolbar = $this->wpAddFilter(
            'mce_buttons_2',
            'updateTinymceButtons',
            1000,
            1
        ); // take over of tinymce advanced
        /** @see \VisualComposer\Modules\Editors\Attributes\WpEditor::addCustomTinymceButtons */
        $filterSecondToolbar = $this->wpAddFilter(
            'mce_buttons_2',
            'addCustomTinymceButtons',
            1000,
            1
        ); // take over of tinymce advanced
        $filterThirdToolbar = $this->wpAddFilter(
            'mce_buttons_3',
            'updateTinymceButtons',
            1000,
            1
        ); // take over of tinymce advanced
        $filterFourthToolbar = $this->wpAddFilter(
            'mce_buttons_4',
            'updateTinymceButtons',
            1000,
            1
        ); // take over of tinymce advanced

        wp_editor(
            '%%content%%',
            '__VCVID__',
            $settings = [
                'media_buttons' => true,
                'tinymce' => [
                    'wordpress_adv_hidden' => false,
                ],
            ]
        );

        remove_filter('mce_buttons', $filter);
        remove_filter('mce_buttons_2', $filterFirstToolbar);
        remove_filter('mce_buttons_2', $filterSecondToolbar);
        remove_filter('mce_buttons_3', $filterThirdToolbar);
        remove_filter('mce_buttons_4', $filterFourthToolbar);
        remove_filter('tiny_mce_plugins', $filterPlugins);

        $output = ob_get_clean();

        return $output;
    }

    protected function getWpEditorDynamic()
    {
        // @codingStandardsIgnoreStart
        global $wp_rich_edit;
        $wp_rich_edit = true;
        // @codingStandardsIgnoreEnd
        ob_start();
        $this->getEditorButtonStyles();
        wp_editor(
            '%%content%%',
            '__VCVIDDYNAMIC__',
            $settings = [
                'media_buttons' => false,
                'default_editor' => 'html',
                'quicktags' => false,
                'tinymce' => [
                    'wordpress_adv_hidden' => false,
                ],
            ]
        );
        $output = ob_get_clean();

        return $output;
    }

    protected function getEditorButtonStyles()
    {
        if (!$this->editorButtonStyles) {
            ob_start();
            wp_print_styles('editor-buttons');
            $this->editorButtonStyles = ob_get_clean();
        }

        echo $this->editorButtonStyles;
    }
}
