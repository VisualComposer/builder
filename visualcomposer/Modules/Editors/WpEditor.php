<?php

namespace VisualComposer\Modules\Editors;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;

class WpEditor extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\WpEditor::addWpEditorScripts */
        $this->addFilter('vcv:backend:extraOutput vcv:frontend:footer:extraOutput', 'addWpEditorScripts');
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
                'wpautop' => false,
            ]
        );
        $output = ob_get_clean();

        return $output;
    }
}
