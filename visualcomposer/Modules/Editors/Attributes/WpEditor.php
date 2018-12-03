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

        return $output;
    }

    protected function getWpEditor()
    {
        ob_start();
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
}
