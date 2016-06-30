<?php

namespace VisualComposer\Modules\Editors\EditPostLinks;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\Request;

/**
 * Class Controller.
 */
class Controller extends Container implements Module
{
    /**
     * Controller constructor.
     */
    public function __construct()
    {
        add_action(
            'admin_bar_menu',
            function ($wpAdminBar) {
                /** @see \VisualComposer\Modules\Editors\EditPostLinks\Controller::adminBarEditLink */
                return $this->call('adminBarEditLink', ['wpAdminBar' => $wpAdminBar]);
            },
            1000
        );

        add_filter(
            'edit_post_link',
            function ($link) {
                /** @see \VisualComposer\Modules\Editors\EditPostLinks\Controller::addEditPostLink */
                return $this->call('addEditPostLink', ['link' => $link]);
            }
        );

        /** Admin pages */
        if (is_admin()) {
            add_filter(
                'page_row_actions',
                function ($actions) {
                    /** @see \VisualComposer\Modules\Editors\EditPostLinks\Controller::adminRowLinks */
                    return $this->call('adminRowLinks', ['actions' => $actions]);
                }
            );
            add_filter(
                'post_row_actions',
                function ($actions) {
                    /** @see \VisualComposer\Modules\Editors\EditPostLinks\Controller::adminRowLinks */
                    return $this->call('adminRowLinks', ['actions' => $actions]);
                }
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
                ['\VisualComposer\Modules\Editors\FrontendController', 'getFrontendUrl'],
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
                ['\VisualComposer\Modules\Editors\Frontend\Controller', 'getFrontendUrl'],
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

    private function adminRowLinks($actions)
    {
        $url = vcapp()->call(
            ['\VisualComposer\Modules\Editors\Frontend\Controller', 'getFrontendUrl'],
            ['postId' => get_the_ID()]
        );

        $actions['edit_vc5'] = '<a href="' . $url . '">' . __('Edit with Visual Composer', 'vc5') . '</a>';

        return $actions;
    }
}
