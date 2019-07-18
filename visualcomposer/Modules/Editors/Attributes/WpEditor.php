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

class WpEditor extends Container implements Module
{
    use EventsFilters;

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

    protected function getWpEditor()
    {
        // @codingStandardsIgnoreStart
        global $wp_rich_edit;
        $wp_rich_edit = true;
        // @codingStandardsIgnoreEnd
        ob_start();
        $this->getEditorButtonStyles();
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
