<?php

namespace VisualComposer\Modules\Editors\EditPostLinks;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
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
        /** @see \VisualComposer\Modules\Editors\EditPostLinks\Controller::addEditLinkToAdminBarOnFrontend */
        $this->wpAddAction(
            'admin_bar_menu',
            'addEditLinkToAdminBarOnFrontend',
            1000
        );

        /** @see \VisualComposer\Modules\Editors\EditPostLinks\Controller::addEditLinkToAdminBarOnAdminArea */
        $this->wpAddAction(
            'admin_bar_menu',
            'addEditLinkToAdminBarOnAdminArea',
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
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Frontend $frontendHelper
     * @param \VisualComposer\Helpers\Access\UserCapabilities $userCapabilitiesHelper
     *
     * @return string
     */
    protected function addEditPostLink(
        $link,
        Request $requestHelper,
        Frontend $frontendHelper,
        UserCapabilities $userCapabilitiesHelper
    ) {
        if ($requestHelper->exists('vcv-editable')) {
            return '';
        }
        if ($userCapabilitiesHelper->canEdit(get_the_ID())) {
            $url = $frontendHelper->getFrontendUrl(get_the_ID());
            $link .= sprintf(
                ' <a href="%s">%s</a>',
                $url,
                $this->getEditPostLinkText()
            );
        }

        return $link;
    }

    /**
     * Add link to admin bar when your log in and browse frontend site area.
     *
     * @param \WP_Admin_Bar $wpAdminBar
     * @param \VisualComposer\Helpers\Frontend $frontendHelper
     */
    protected function addEditLinkToAdminBarOnFrontend(
        $wpAdminBar,
        Frontend $frontendHelper
    ) {
        $wpAdminBar = $this->getAdminBar($wpAdminBar);
        $sourceId = get_the_ID();

        if (!$this->isShowEditLinkToAdminBarOnFrontend($sourceId)) {
            return;
        }

        $url = $frontendHelper->getFrontendUrl($sourceId);
        $wpAdminBar->add_menu(
            [
                'id' => 'edit-with-visual-composer',
                'title' => $this->getEditPostLinkText(),
                'href' => $url,
            ]
        );
    }

    /**
     * Check if we need to show edit link to admin bar on frontend.
     *
     * @param int $sourceId
     *
     * @return bool
     */
    protected function isShowEditLinkToAdminBarOnFrontend($sourceId)
    {
        $accessUserCapabilitiesHelper = vchelper('AccessUserCapabilities');
        if (!$accessUserCapabilitiesHelper->canEdit($sourceId)) {
            return false;
        }

        if (is_front_page()) {
            // wp settings reading section home page option
            $pageOnFrontId = get_option('page_on_front');

            if (!$pageOnFrontId) {
                return false;
            }
        } elseif (is_home()) {
            // wp settings reading section blog page option
            $pageOnBlogId = get_option('page_for_posts');
            if ($pageOnBlogId) {
                return false;
            }
        }

        if (is_archive() || is_search() || is_404()) {
            return false;
        }

        return vcfilter('vcv:editors:editPostLinks:adminRowLinks', true, ['sourceId' => $sourceId]);
    }

    /**
     * Add link to admin bar New+ submenu area in WordPress admin dashboard.
     *
     * @param \WP_Admin_Bar $wpAdminBar
     * @param \VisualComposer\Helpers\Access\UserCapabilities $userCapabilitiesHelper
     * @param \VisualComposer\Helpers\Url $urlHelper
     */
    protected function addEditLinkToAdminBarOnAdminArea(
        $wpAdminBar,
        UserCapabilities $userCapabilitiesHelper,
        Url $urlHelper
    ) {
        $wpAdminBar = $this->getAdminBar($wpAdminBar);

        $cpts = (array)get_post_types(['show_in_admin_bar' => true], 'objects');
        // Add any additional custom post types.
        $actions = [];
        foreach ($cpts as $cpt) {
            if (!current_user_can($cpt->cap->create_posts) || !$userCapabilitiesHelper->isEditorEnabled($cpt->name)) {
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
                    'title' => __('Add New with Visual Composer', 'visualcomposer'),
                    'href' => vcfilter(
                        'vcv:frontend:url',
                        $urlHelper->query(admin_url($key), ['vcv-action' => 'frontend']),
                        ['query' => ['vcv-action' => 'frontend'], 'sourceId' => null]
                    ),
                ]
            );
        }
    }

    /**
     * Get admin bar object.
     *
     * @param object|null $wpAdminBar
     *
     * @return mixed
     */
    protected function getAdminBar($wpAdminBar)
    {
        if (is_object($wpAdminBar)) {
            return $wpAdminBar;
        }

        // @codingStandardsIgnoreStart
        global $wp_admin_bar;
        $wpAdminBar = $wp_admin_bar;
        // @codingStandardsIgnoreEnd

        return $wpAdminBar;
    }

    /**
     * @param $actions
     * @param \VisualComposer\Helpers\Frontend $frontendHelper
     * @param \VisualComposer\Helpers\Access\UserCapabilities $userCapabilitiesHelper
     *
     * @return mixed
     */
    protected function adminRowLinks(
        $actions,
        Frontend $frontendHelper,
        UserCapabilities $userCapabilitiesHelper
    ) {
        $sourceId = get_the_ID();
        if (
            $userCapabilitiesHelper->canEdit($sourceId)
            && vcfilter('vcv:editors:editPostLinks:adminRowLinks', true, ['sourceId' => $sourceId])
        ) {
            $url = $frontendHelper->getFrontendUrl($sourceId);
            $actions['edit_vc5'] = sprintf(
                '<a href="%s" class="vcv-edit-with-vcwb">%s</a>',
                $url,
                $this->getEditPostLinkText()
            );
        }

        return $actions;
    }

    /**
     * Get text for a Edit Post Link with our plugin.
     *
     * @return string|null
     */
    protected function getEditPostLinkText()
    {
        return __('Edit with Visual Composer', 'visualcomposer');
    }
}
