<?php

namespace VisualComposer\Modules\Editors\EditPostLinks;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Editors\Frontend\Controller as FrontendController;

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
     * @return string
     * @throws \Exception
     */
    private function addEditPostLink(
        $link,
        CurrentUser $currentUserAccess,
        Request $requestHelper
    ) {
        if ($requestHelper->exists('vcv-editable')) {
            return '';
        }
        if ($currentUserAccess->part('frontend_editor', true)->can()->get(true)) {
            $url = vcapp()->call(
                [vcapp('EditorsFrontendController'), 'getFrontendUrl'],
                ['postId' => get_the_ID()]
            );
            $link .= ' <a href="' . esc_url($url) . '">' . __('Edit with VC5', 'vc5') . '</a>';
        }

        return $link;
    }

    /**
     * @param \WP_Admin_Bar $wpAdminBar
     */
    private function adminBarEditLink($wpAdminBar)
    {
        if (!is_object($wpAdminBar)) {
            global $wp_admin_bar;
            $wpAdminBar = $wp_admin_bar;
        }

        if (is_singular()) {
            $url = vcapp()->call(
                [vcapp('EditorsFrontendController'), 'getFrontendUrl'],
                ['postId' => get_the_ID()]
            );
            $wpAdminBar->add_menu(
                [
                    'title' => __('Edit with Visual Composer', 'vc5'),
                    'href' => $url,
                ]
            );
        }
    }

    private function adminRowLinks($actions, FrontendController $frontendController)
    {
        $url = vcapp()->call(
            [$frontendController, 'getFrontendUrl'],
            ['postId' => get_the_ID()]
        );

        $actions['edit_vc5'] = '<a href="' . $url . '">' . __('Edit with Visual Composer', 'vc5') . '</a>';

        return $actions;
    }
}
