<?php

namespace VisualComposer\Modules\Settings;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class CustomPostTypesController.
 * @codingStandardsIgnoreFile
 */
class CustomPostTypesController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    protected $postType;

    protected $customPostTypes;

    public function __construct()
    {
        $this->customPostTypes = [
            'vcv_headers',
            'vcv_footers',
            'vcv_sidebars',
            'vcv_archives',
            'vcv_layouts',
            'vcv_templates',
        ];

        // Hook once screen is determined to handle VC custom post types listings
        $this->wpAddAction(
            'current_screen',
            'hookCurrentScreen'
        );
        $this->wpAddFilter(
            'screen_options_show_screen',
            function ($show) {
                $page = vchelper('Request')->input('page');
                if (!empty($page) && strpos($page, 'vcv') !== false) {
                    return false;
                }

                return $show;
            }
        );
        $this->wpAddAction('admin_init', 'redirectEditPage', 9);
        $this->wpAddAction('admin_init', 'manipulateGlobalVariables');
        $this->wpAddFilter('admin_title', 'manipulateTitle');
    }

    /**
     * Manipulate global request and pagenow for custom listing pages
     * Fix for custom column of translate plugins
     */
    protected function manipulateGlobalVariables()
    {
        global $pagenow;
        if (isset($_REQUEST['page'])
            && $pagenow === 'admin.php'
            && in_array(
                $_REQUEST['page'],
                $this->customPostTypes,
                true
            )
        ) {
            $pagenow = 'edit.php';
            $_REQUEST['post_type'] = $_REQUEST['page'];
        }
    }

    /**
     * Redirect edit page to VC Dashboard page
     * Fix for duplicate plugins
     */
    protected function redirectEditPage()
    {
        global $pagenow;
        if (isset($_REQUEST['post_type'])
            && $pagenow === 'edit.php'
            && in_array(
                $_REQUEST['post_type'],
                $this->customPostTypes,
                true
            )
        ) {
            wp_redirect(admin_url('admin.php?page=' . $_REQUEST['post_type']));
            exit;
        }
    }

    /**
     * Change title of the admin page.
     *
     * @param $adminTitle
     *
     * @return string
     */
    protected function manipulateTitle($adminTitle)
    {
        global $post_type_object;
        if (isset($_REQUEST['page'])
            && in_array(
                $_REQUEST['page'],
                $this->customPostTypes,
                true
            ))
        {
            $blogTitle = get_bloginfo( 'name' );
            $title = $post_type_object->labels->name;
            $adminTitle = sprintf( __( '%1$s &lsaquo; %2$s &#8212; WordPress' ), $title, $blogTitle );
        }

        return $adminTitle;
    }

    protected function hookCurrentScreen($screen)
    {
        global $page_hook;
        if (strpos($screen->id, 'vcv_') === 0) {
            $page_hook = 'visual-composer_page_' . $screen->id;
        }

        if (strpos($screen->id, 'vcv_') !== false) {
            $this->postType = str_replace('visual-composer_page_', '', $screen->id);
            $this->postType = str_replace('admin_page_', '', $this->postType);

            if (post_type_exists($this->postType)) {
                $screen->post_type = $this->postType;
                $requestHelper = vchelper('Request');
                if ($requestHelper->exists('vcv-post-action')) {
                    if (!$requestHelper->exists('vcv-frontend')) {
                        $this->call('postActions', ['screen' => $screen]);
                    }
                } else {
                    $this->call('setupCustomPostTypeActions', ['screen' => $screen]);
                }
            }
        }
    }

    protected function setupCustomPostTypeActions($screen)
    {
        global $wpdb;
        $postType = $this->postType;
        $postTypeObject = get_post_type_object($postType);
        if (!$postTypeObject) {
            wp_die(__('Invalid post type.'));
        }

        if (!current_user_can($postTypeObject->cap->edit_posts)) {
            wp_die(
                '<h1>' . __('You need a higher level of permission.') . '</h1>' .
                '<p>' . __('Sorry, you are not allowed to edit posts in this post type.') . '</p>',
                403
            );
        }
        $parentFile = "admin.php?page=$postType&post_type=$postType";
        $postNewFile = "post-new.php?post_type=$postType";

        $wpListsTable = vcapp()->make(
            '\VisualComposer\Modules\Settings\VcPostsListTable',
            ['screen' => $screen]
        );
        $pagenum = $wpListsTable->get_pagenum();
        $doaction = $wpListsTable->current_action();

        if ($doaction) {
            check_admin_referer('bulk-posts');

            $sendback = remove_query_arg(['trashed', 'untrashed', 'deleted', 'locked', 'ids'], wp_get_referer());
            if (!$sendback) {
                $sendback = admin_url($parentFile);
            }
            $sendback = add_query_arg('paged', $pagenum, $sendback);
            if (strpos($sendback, 'post.php') !== false) {
                $sendback = admin_url($postNewFile);
            }

            if ('delete_all' === $doaction) {
                // Prepare for deletion of all posts with a specified post status (i.e. Empty Trash).
                $postStatus = preg_replace('/[^a-z0-9_-]+/i', '', $_REQUEST['post_status']);
                // Validate the post status exists.
                if (get_post_status_object($postStatus)) {
                    $postIds = $wpdb->get_col(
                        $wpdb->prepare(
                            "SELECT ID FROM $wpdb->posts WHERE post_type=%s AND post_status = %s",
                            $postType,
                            $postStatus
                        )
                    );
                }
                $doaction = 'delete';
            } elseif (isset($_REQUEST['media'])) {
                $postIds = $_REQUEST['media'];
            } elseif (isset($_REQUEST['ids'])) {
                $postIds = explode(',', $_REQUEST['ids']);
            } elseif (!empty($_REQUEST['post'])) {
                $postIds = array_map('intval', $_REQUEST['post']);
            }

            if (!isset($postIds)) {
                wp_redirect($sendback);
                exit;
            }

            switch ($doaction) {
                case 'trash':
                    $trashed = 0;
                    $locked = 0;

                    foreach ((array)$postIds as $postId) {
                        if (!current_user_can('delete_post', $postId)) {
                            wp_die(__('Sorry, you are not allowed to move this item to the Trash.'));
                        }

                        if (wp_check_post_lock($postId)) {
                            $locked++;
                            continue;
                        }

                        if (!wp_trash_post($postId)) {
                            wp_die(__('Error in moving the item to Trash.'));
                        }

                        $trashed++;
                    }

                    $sendback = add_query_arg(
                        [
                            'trashed' => $trashed,
                            'ids' => implode(',', $postIds),
                            'locked' => $locked,
                        ],
                        $sendback
                    );
                    break;
                case 'untrash':
                    $untrashed = 0;

                    if (isset($_GET['doaction']) && ('undo' === $_GET['doaction'])) {
                        add_filter('wp_untrash_post_status', 'wp_untrash_post_set_previous_status', 10, 3);
                    }

                    foreach ((array)$postIds as $postId) {
                        if (!current_user_can('delete_post', $postId)) {
                            wp_die(__('Sorry, you are not allowed to restore this item from the Trash.'));
                        }

                        if (!wp_untrash_post($postId)) {
                            wp_die(__('Error in restoring the item from Trash.'));
                        }

                        $untrashed++;
                    }
                    $sendback = add_query_arg('untrashed', $untrashed, $sendback);

                    remove_filter('wp_untrash_post_status', 'wp_untrash_post_set_previous_status', 10, 3);

                    break;
                case 'delete':
                    $deleted = 0;
                    foreach ((array)$postIds as $postId) {
                        $postDel = get_post($postId);

                        if (!current_user_can('delete_post', $postId)) {
                            wp_die(__('Sorry, you are not allowed to delete this item.'));
                        }

                        if ('attachment' === $postDel->post_type) {
                            if (!wp_delete_attachment($postId)) {
                                wp_die(__('Error in deleting the attachment.'));
                            }
                        } else {
                            if (!wp_delete_post($postId)) {
                                wp_die(__('Error in deleting the item.'));
                            }
                        }
                        $deleted++;
                    }
                    $sendback = add_query_arg('deleted', $deleted, $sendback);
                    break;
                case 'edit':
                    if (isset($_REQUEST['bulk_edit'])) {
                        $done = bulk_edit_posts($_REQUEST);

                        if (is_array($done)) {
                            $done['updated'] = count($done['updated']);
                            $done['skipped'] = count($done['skipped']);
                            $done['locked'] = count($done['locked']);
                            $sendback = add_query_arg($done, $sendback);
                        }
                    }
                    break;
                default:
                    $screen = get_current_screen()->id;

                    /**
                     * Fires when a custom bulk action should be handled.
                     *
                     * The redirect link should be modified with success or failure feedback
                     * from the action to be used to display feedback to the user.
                     *
                     * The dynamic portion of the hook name, `$screen`, refers to the current screen ID.
                     *
                     * @param string $sendback The redirect URL.
                     * @param string $doaction The action being taken.
                     * @param array $items The items to take the action on. Accepts an array of IDs of posts,
                     *                         comments, terms, links, plugins, attachments, or users.
                     *
                     * @since 4.7.0
                     *
                     */
                    $sendback = apply_filters(
                        "handle_bulk_actions-{$screen}",
                        $sendback,
                        $doaction,
                        $postIds
                    ); // phpcs:ignore WordPress.NamingConventions.ValidHookName.UseUnderscores
                    break;
            }

            $sendback = remove_query_arg(
                [
                    'action',
                    'action2',
                    'tags_input',
                    'post_author',
                    'comment_status',
                    'ping_status',
                    '_status',
                    'post',
                    'bulk_edit',
                    'post_view',
                ],
                $sendback
            );

            wp_redirect($sendback);
            exit;
        } elseif (!empty($_REQUEST['_wp_http_referer'])) {
            wp_redirect(remove_query_arg(['_wp_http_referer', '_wpnonce'], wp_unslash($_SERVER['REQUEST_URI'])));
            exit;
        }
    }

    protected function postActions($screen)
    {
        $postType = $this->postType;
        $parentFile = "admin.php?page=$postType&post_type=$postType";

        wp_reset_vars(['action']);
        $action = $GLOBALS['action'];
        if (isset($_GET['post']) && isset($_POST['post_ID']) && (int)$_GET['post'] !== (int)$_POST['post_ID']) {
            wp_die(
                __('A post ID mismatch has been detected.'),
                __('Sorry, you are not allowed to edit this item.'),
                400
            );
        } elseif (isset($_GET['post'])) {
            $postId = (int)$_GET['post'];
        } elseif (isset($_POST['post_ID'])) {
            $postId = (int)$_POST['post_ID'];
        } else {
            $postId = 0;
        }

        /**
         * @global string $post_type
         * @global object $post_type_object
         * @global WP_Post $post Global post object.
         */
        global $post_type, $post_type_object, $post;

        if ($postId) {
            $post = get_post($postId);
        }

        if ($post) {
            $post_type = $post->post_type;
            $post_type_object = get_post_type_object($post_type);
        }

        if (isset($_POST['post_type']) && $post && $post_type !== $_POST['post_type']) {
            wp_die(
                __('A post type mismatch has been detected.'),
                __('Sorry, you are not allowed to edit this item.'),
                400
            );
        }

        if (!$post_type_object) {
            wp_die(__('Invalid post type.'));
        }

        if (!current_user_can($post_type_object->cap->edit_posts)) {
            wp_die(
                '<h1>' . __('You need a higher level of permission.') . '</h1>' .
                '<p>' . __('Sorry, you are not allowed to edit posts in this post type.') . '</p>',
                403
            );
        }

        if (isset($_POST['deletepost'])) {
            $action = 'delete';
        } elseif (isset($_POST['wp-preview']) && 'dopreview' === $_POST['wp-preview']) {
            $action = 'preview';
        }

        $sendback = wp_get_referer();
        if (!$sendback || false !== strpos($sendback, 'post.php') || false !== strpos($sendback, 'post-new.php')) {
            $sendback = $parentFile;
        } else {
            $sendback = remove_query_arg(['trashed', 'untrashed', 'deleted', 'ids'], $sendback);
        }

        switch ($action) {
            case 'post-quickdraft-save':
                // Check nonce and capabilities.
                $nonce = $_REQUEST['_wpnonce'];
                $errorMsg = false;

                // For output of the Quick Draft dashboard widget.
                require_once ABSPATH . 'wp-admin/includes/dashboard.php';

                if (!wp_verify_nonce($nonce, 'add-post')) {
                    $errorMsg = __('Unable to submit this form, please refresh and try again.');
                }

                if (!current_user_can(get_post_type_object('post')->cap->create_posts)) {
                    exit;
                }

                if ($errorMsg) {
                    return wp_dashboard_quick_press($errorMsg);
                }

                $post = get_post($_REQUEST['post_ID']);
                check_admin_referer('add-' . $post->post_type);

                $_POST['comment_status'] = get_default_comment_status($post->post_type);
                $_POST['ping_status'] = get_default_comment_status($post->post_type, 'pingback');

                // Wrap Quick Draft content in the Paragraph block.
                if (false === strpos($_POST['content'], '<!-- wp:paragraph -->')) {
                    $_POST['content'] = sprintf(
                        '<!-- wp:paragraph -->%s<!-- /wp:paragraph -->',
                        str_replace(["\r\n", "\r", "\n"], '<br />', $_POST['content'])
                    );
                }

                edit_post();
                wp_dashboard_quick_press();
                exit;

            case 'postajaxpost':
            case 'post':
                check_admin_referer('add-' . $post_type);
                $postId = 'postajaxpost' === $action ? edit_post() : write_post();
                redirect_post($postId);
                exit;
            case 'trash':
                check_admin_referer('trash-post_' . $postId);

                if (!$post) {
                    wp_die(__('The item you are trying to move to the Trash no longer exists.'));
                }

                if (!$post_type_object) {
                    wp_die(__('Invalid post type.'));
                }

                if (!current_user_can('delete_post', $postId)) {
                    wp_die(__('Sorry, you are not allowed to move this item to the Trash.'));
                }

                $user_id = wp_check_post_lock($postId);
                if ($user_id) {
                    $user = get_userdata($user_id);
                    /* translators: %s: User's display name. */
                    wp_die(
                        sprintf(
                            __('You cannot move this item to the Trash. %s is currently editing.'),
                            $user->display_name
                        )
                    );
                }

                if (!wp_trash_post($postId)) {
                    wp_die(__('Error in moving the item to Trash.'));
                }

                wp_redirect(
                    add_query_arg(
                        [
                            'trashed' => 1,
                            'ids' => $postId,
                        ],
                        $sendback
                    )
                );
                exit;

            case 'untrash':
                check_admin_referer('untrash-post_' . $postId);

                if (!$post) {
                    wp_die(__('The item you are trying to restore from the Trash no longer exists.'));
                }

                if (!$post_type_object) {
                    wp_die(__('Invalid post type.'));
                }

                if (!current_user_can('delete_post', $postId)) {
                    wp_die(__('Sorry, you are not allowed to restore this item from the Trash.'));
                }

                if (!wp_untrash_post($postId)) {
                    wp_die(__('Error in restoring the item from Trash.'));
                }

                $sendback = add_query_arg(
                    [
                        'untrashed' => 1,
                        'ids' => $postId,
                    ],
                    $sendback
                );
                wp_redirect($sendback);
                exit;

            case 'delete':
                check_admin_referer('delete-post_' . $postId);

                if (!$post) {
                    wp_die(__('This item has already been deleted.'));
                }

                if (!$post_type_object) {
                    wp_die(__('Invalid post type.'));
                }

                if (!current_user_can('delete_post', $postId)) {
                    wp_die(__('Sorry, you are not allowed to delete this item.'));
                }

                if ('attachment' === $post->post_type) {
                    $force = (!MEDIA_TRASH);
                    if (!wp_delete_attachment($postId, $force)) {
                        wp_die(__('Error in deleting the attachment.'));
                    }
                } else {
                    if (!wp_delete_post($postId, true)) {
                        wp_die(__('Error in deleting the item.'));
                    }
                }

                wp_redirect(add_query_arg('deleted', 1, $sendback));
                exit;

            case 'preview':
                check_admin_referer('update-post_' . $postId);

                $url = post_preview();

                wp_redirect($url);
                exit;

            case 'toggle-custom-fields':
                check_admin_referer('toggle-custom-fields');

                $currentUserId = get_current_user_id();
                if ($currentUserId) {
                    $enableCustomFields = (bool)get_user_meta($currentUserId, 'enable_custom_fields', true);
                    update_user_meta($currentUserId, 'enable_custom_fields', !$enableCustomFields);
                }

                wp_safe_redirect(wp_get_referer());
                exit;

            default:
                /**
                 * Fires for a given custom post action request.
                 *
                 * The dynamic portion of the hook name, `$action`, refers to the custom post action.
                 *
                 * @param int $postId Post ID sent with the request.
                 *
                 * @since 4.6.0
                 *
                 */
                do_action("post_action_{$action}", $postId);

                wp_redirect(admin_url('edit.php'));
                exit;
        } // End switch.
    }
}
