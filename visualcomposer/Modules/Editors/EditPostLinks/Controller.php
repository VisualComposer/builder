<?php

namespace VisualComposer\Modules\Editors\EditPostLinks;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\Access\EditorPostType;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class Controller.
 */
class Controller extends Container implements Module
{
    use WpFiltersActions;

    /**
     * Controller constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\EditPostLinks\Controller::adminBarEditLink */
        $this->wpAddAction(
            'admin_bar_menu',
            'adminBarEditLink',
            1000
        );

        /** @see \VisualComposer\Modules\Editors\EditPostLinks\Controller::addEditPostLink */
        $this->wpAddFilter(
            'edit_post_link',
            'addEditPostLink'
        );

        /** Admin pages */
        if (is_admin()) {
            /** @see \VisualComposer\Modules\Editors\EditPostLinks\Controller::adminRowLinks */
            $this->wpAddFilter(
                'page_row_actions',
                'adminRowLinks'
            );
            $this->wpAddFilter(
                'post_row_actions',
                'adminRowLinks'
            );
        }
    }

    /**
     * @param $link
     *
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserAccess
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @param \VisualComposer\Helpers\Frontend $frontendHelper
     *
     * @param \VisualComposer\Helpers\Access\EditorPostType $editorPostTypeHelper
     *
     * @return string
     */
    protected function addEditPostLink(
        $link,
        CurrentUser $currentUserAccess,
        Request $requestHelper,
        Frontend $frontendHelper,
        EditorPostType $editorPostTypeHelper
    ) {
        if ($requestHelper->exists('vcv-editable')) {
            return '';
        }
        if ($currentUserAccess->part('frontend_editor', true)->can()->get(true)
            && $editorPostTypeHelper->isEditorEnabled(
                get_post_type()
            )
        ) {
            $url = $frontendHelper->getFrontendUrl(get_the_ID());
            $link .= sprintf(
                ' <a href="%s">%s</a>',
                esc_url($url),
                __('Edit with Visual Composer', 'vc5')
            ); // TODO: Change text https://app.asana.com/0/214854674604991/236487795091134
        }

        return $link;
    }

    /**
     * @param \WP_Admin_Bar $wpAdminBar
     * @param \VisualComposer\Helpers\Frontend $frontendHelper
     * @param \VisualComposer\Helpers\Access\EditorPostType $editorPostTypeHelper
     */
    protected function adminBarEditLink($wpAdminBar, Frontend $frontendHelper, EditorPostType $editorPostTypeHelper)
    {
        if (!is_object($wpAdminBar)) {
            // @codingStandardsIgnoreStart
            global $wp_admin_bar;
            $wpAdminBar = $wp_admin_bar;
            // @codingStandardsIgnoreEnd
        }

        if (is_singular() && $editorPostTypeHelper->isEditorEnabled(get_post_type())) {
            $url = $frontendHelper->getFrontendUrl(get_the_ID());
            $wpAdminBar->add_menu(
                [
                    'id' => __('Edit with Visual Composer', 'vc5'),
                    'title' => __('Edit with Visual Composer', 'vc5'),
                    'href' => $url,
                ]
            );
        }
    }

    /**
     * @param $actions
     * @param \VisualComposer\Helpers\Frontend $frontendHelper
     *
     * @param \VisualComposer\Helpers\Access\EditorPostType $editorPostTypeHelper
     *
     * @return mixed
     */
    protected function adminRowLinks($actions, Frontend $frontendHelper, EditorPostType $editorPostTypeHelper)
    {
        if ($editorPostTypeHelper->isEditorEnabled(get_post_type())) {
            $url = $frontendHelper->getFrontendUrl(get_the_ID());
            $actions['edit_vc5'] = sprintf('<a href="%s">%s</a>', $url, __('Edit with Visual Composer', 'vc5'));
        }

        return $actions;
    }
}
