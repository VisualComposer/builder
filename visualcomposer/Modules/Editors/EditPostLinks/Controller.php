<?php

namespace VisualComposer\Modules\Editors\EditPostLinks;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\Access\EditorPostType;
use VisualComposer\Helpers\Access\UserCapabilities;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;

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
     * @throws \Exception
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
        if ($currentUserAccess->part('frontend_editor', true)->can()->get()
            && $editorPostTypeHelper->isEditorEnabled(
                get_post_type()
            )
        ) {
            $url = $frontendHelper->getFrontendUrl(get_the_ID());
            $link .= sprintf(
                ' <a href="%s">%s</a>',
                // @codingStandardsIgnoreLine
                $url,
                __('Edit with Visual Composer', 'vcwb')
            );
        }

        return $link;
    }

    /**
     * @param \WP_Admin_Bar $wpAdminBar
     * @param \VisualComposer\Helpers\Frontend $frontendHelper
     * @param \VisualComposer\Helpers\Access\EditorPostType $editorPostTypeHelper
     * @param \VisualComposer\Helpers\Access\UserCapabilities $userCapabilitiesHelper
     * @param \VisualComposer\Helpers\Url $urlHelper
     */
    protected function adminBarEditLink(
        $wpAdminBar,
        Frontend $frontendHelper,
        EditorPostType $editorPostTypeHelper,
        UserCapabilities $userCapabilitiesHelper,
        Url $urlHelper
    ) {
        if (!is_object($wpAdminBar)) {
            // @codingStandardsIgnoreStart
            global $wp_admin_bar;
            $wpAdminBar = $wp_admin_bar;
            // @codingStandardsIgnoreEnd
        }

        if (is_singular() && $editorPostTypeHelper->isEditorEnabled(get_post_type())
            && $userCapabilitiesHelper->canEdit(get_the_ID())
        ) {
            $url = $frontendHelper->getFrontendUrl(get_the_ID());
            $wpAdminBar->add_menu(
                [
                    'id' => __('Edit with Visual Composer', 'vcwb'),
                    'title' => __('Edit with Visual Composer', 'vcwb'),
                    'href' => $url,
                ]
            );
        }

        $cpts = (array)get_post_types(['show_in_admin_bar' => true], 'objects');
        // Add any additional custom post types.
        $actions = [];
        foreach ($cpts as $cpt) {
            if (!current_user_can($cpt->cap->create_posts) || !$editorPostTypeHelper->isEditorEnabled($cpt->name)) {
                continue;
            }
            if (in_array($cpt->name, ['vcv_templates', 'vcv_headers', 'vcv_footers', 'vcv_sidebars'])) {
                continue;
            }
            $key = 'post-new.php?post_type=' . $cpt->name;
            $actions[ $key ] = ['id' => 'new-' . $cpt->name];
        }
        foreach ($actions as $key => $data) {
            $wpAdminBar->add_menu(
                [
                    'parent' => $data['id'],
                    'id' => 'add-new-' . $key . '-vc',
                    'title' => __('Add New with Visual Composer', 'vcwb'),
                    'href' => $urlHelper->query(admin_url($key), ['vcv-action' => 'frontend']),
                ]
            );
        }
    }

    /**
     * @param $actions
     * @param \VisualComposer\Helpers\Frontend $frontendHelper
     * @param \VisualComposer\Helpers\Access\EditorPostType $editorPostTypeHelper
     * @param \VisualComposer\Helpers\Access\UserCapabilities $userCapabilitiesHelper
     *
     * @return mixed
     */
    protected function adminRowLinks(
        $actions,
        Frontend $frontendHelper,
        EditorPostType $editorPostTypeHelper,
        UserCapabilities $userCapabilitiesHelper
    ) {
        if (intval(get_option('page_for_posts')) !== get_the_ID()
            && $editorPostTypeHelper->isEditorEnabled(
                get_post_type()
            )
            && $userCapabilitiesHelper->canEdit(get_the_ID())
            && vcfilter('vcv:editors:editPostLinks:adminRowLinks', true, ['sourceId' => get_the_ID()])) {
            $url = $frontendHelper->getFrontendUrl(get_the_ID());
            $actions['edit_vc5'] = sprintf('<a href="%s">%s</a>', $url, __('Edit with Visual Composer', 'vcwb'));
        }

        return $actions;
    }
}
