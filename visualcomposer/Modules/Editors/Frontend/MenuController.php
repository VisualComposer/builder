<?php

namespace VisualComposer\Modules\Editors\Frontend;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\EditorPostType;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;

class MenuController extends Container implements Module
{
    use WpFiltersActions;

    public function __construct()
    {
        $this->wpAddAction('admin_menu', 'addStyleFixes');
        $this->wpAddAction('admin_menu', 'updateAddNewMenus');
    }

    protected function addStyleFixes()
    {
        evcview('settings/partials/admin-menu');
    }

    protected function updateAddNewMenus()
    {
        global $submenu;
        if (isset($submenu) && !empty($submenu)) {
            foreach ($submenu as $key => $linksData) {
                $match = preg_match('/edit.php(?:\?post_type\=)?(.*)?/', $key, $matches);
                if ($match) {
                    $postType = !empty($matches[1]) ? $matches[1] : 'post';
                    /** @see \VisualComposer\Modules\Editors\Frontend\MenuController::addLinkToSubmenu */
                    $this->call(
                        'addLinkToSubmenu',
                        [
                            $postType,
                            $key,
                            $linksData,
                        ]
                    );
                }
            }
        }
    }

    /**
     * @param $postType
     * @param $linksData
     * @param $key
     * @param \VisualComposer\Helpers\Access\EditorPostType $editorPostType
     * @param \VisualComposer\Helpers\Url $urlHelper
     */
    protected function addLinkToSubmenu(
        $postType,
        $key,
        $linksData,
        EditorPostType $editorPostType,
        Url $urlHelper
    ) {
        global $submenu;
        if ($editorPostType->isEditorEnabled($postType)) {
            foreach ($linksData as $linkIndex => $link) {
                $linkMatch = preg_match('/post-new.php(.*)?/', $link[2]);
                if ($linkMatch) {
                    // Now we know the post_type and can check for "Add New"
                    $newIndex = $linkIndex + 1;
                    while (isset($submenu[ $key ][ $newIndex ])) {
                        $newIndex++;
                    }
                    $link3 = isset($link[3]) ? $link[3] : null;
                    $link4 = isset($link[4]) ? $link[4] : null;
                    $link4 .= ' vcv-dashboard-admin-menu--add';
                    $submenu[ $key ][ $newIndex ] = [
                        __('Add New with Visual&nbsp;Composer', 'vcwb'),
                        $link[1],
                        $urlHelper->query($link[2], ['vcv-action' => 'frontend']),
                        $link3,
                        $link4,
                    ];
                }
            }
        }
    }
}
