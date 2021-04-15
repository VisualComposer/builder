<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
/** @var $controller \VisualComposer\Modules\Settings\Pages\Settings */
/** @var string $slug */
// @codingStandardsIgnoreFile
global $typenow;
$typenow = $slug;
$screen = \WP_Screen::get('edit-' . $slug);
ob_start();

if (!$typenow) {
    wp_die(__('Invalid post type.'));
}

if (!in_array($typenow, get_post_types(['show_ui' => true]), true)) {
    wp_die(__('Sorry, you are not allowed to edit posts in this post type.'));
}

/**
 * @global string $post_type
 * @global WP_Post_Type $post_type_object
 */
global $post_type, $post_type_object;
$post_type = $typenow;
$post_type_object = get_post_type_object($post_type);
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
$wpListTable = vcapp()->make(
    \VisualComposer\Modules\Settings\VcPostsListTable::class,
    [
        'args' => [
            'screen' => $screen,
        ],
    ]
);
$pagenum = $wpListTable->get_pagenum();

$postNewFile = "post-new.php?post_type=$post_type";

$wpListTable->prepare_items();

wp_enqueue_script('inline-edit-post');
wp_enqueue_script('heartbeat');

$title = $post_type_object->labels->name;

get_current_screen()->set_screen_reader_content(
    [
        'heading_views' => $post_type_object->labels->filter_items_list,
        'heading_pagination' => $post_type_object->labels->items_list_navigation,
        'heading_list' => $post_type_object->labels->items_list,
    ]
);

add_screen_option(
    'per_page',
    [
        'default' => 20,
        'option' => 'edit_' . $post_type . '_per_page',
    ]
);

$bulkCounts = [
    'updated' => isset($_REQUEST['updated']) ? absint($_REQUEST['updated']) : 0,
    'locked' => isset($_REQUEST['locked']) ? absint($_REQUEST['locked']) : 0,
    'deleted' => isset($_REQUEST['deleted']) ? absint($_REQUEST['deleted']) : 0,
    'trashed' => isset($_REQUEST['trashed']) ? absint($_REQUEST['trashed']) : 0,
    'untrashed' => isset($_REQUEST['untrashed']) ? absint($_REQUEST['untrashed']) : 0,
];

$bulkMessages = [];
$bulkMessages['post'] = [
    /* translators: %s: Number of posts. */
    'updated' => _n('%s post updated.', '%s posts updated.', $bulkCounts['updated']),
    'locked' => (1 === $bulkCounts['locked'])
        ? __('1 post not updated, somebody is editing it.')
        :
        /* translators: %s: Number of posts. */
        _n(
            '%s post not updated, somebody is editing it.',
            '%s posts not updated, somebody is editing them.',
            $bulkCounts['locked']
        ),
    /* translators: %s: Number of posts. */
    'deleted' => _n('%s post permanently deleted.', '%s posts permanently deleted.', $bulkCounts['deleted']),
    /* translators: %s: Number of posts. */
    'trashed' => _n('%s post moved to the Trash.', '%s posts moved to the Trash.', $bulkCounts['trashed']),
    /* translators: %s: Number of posts. */
    'untrashed' => _n(
        '%s post restored from the Trash.',
        '%s posts restored from the Trash.',
        $bulkCounts['untrashed']
    ),
];
$bulkMessages['page'] = [
    /* translators: %s: Number of pages. */
    'updated' => _n('%s page updated.', '%s pages updated.', $bulkCounts['updated']),
    'locked' => (1 === $bulkCounts['locked'])
        ? __('1 page not updated, somebody is editing it.')
        :
        /* translators: %s: Number of pages. */
        _n(
            '%s page not updated, somebody is editing it.',
            '%s pages not updated, somebody is editing them.',
            $bulkCounts['locked']
        ),
    /* translators: %s: Number of pages. */
    'deleted' => _n('%s page permanently deleted.', '%s pages permanently deleted.', $bulkCounts['deleted']),
    /* translators: %s: Number of pages. */
    'trashed' => _n('%s page moved to the Trash.', '%s pages moved to the Trash.', $bulkCounts['trashed']),
    /* translators: %s: Number of pages. */
    'untrashed' => _n(
        '%s page restored from the Trash.',
        '%s pages restored from the Trash.',
        $bulkCounts['untrashed']
    ),
];
$bulkMessages['wp_block'] = [
    /* translators: %s: Number of blocks. */
    'updated' => _n('%s block updated.', '%s blocks updated.', $bulkCounts['updated']),
    'locked' => (1 === $bulkCounts['locked'])
        ? __('1 block not updated, somebody is editing it.')
        :
        /* translators: %s: Number of blocks. */
        _n(
            '%s block not updated, somebody is editing it.',
            '%s blocks not updated, somebody is editing them.',
            $bulkCounts['locked']
        ),
    /* translators: %s: Number of blocks. */
    'deleted' => _n('%s block permanently deleted.', '%s blocks permanently deleted.', $bulkCounts['deleted']),
    /* translators: %s: Number of blocks. */
    'trashed' => _n('%s block moved to the Trash.', '%s blocks moved to the Trash.', $bulkCounts['trashed']),
    /* translators: %s: Number of blocks. */
    'untrashed' => _n(
        '%s block restored from the Trash.',
        '%s blocks restored from the Trash.',
        $bulkCounts['untrashed']
    ),
];

/**
 * Filters the bulk action updated messages.
 *
 * By default, custom post types use the messages for the 'post' post type.
 *
 * @param array[] $bulkMessages Arrays of messages, each keyed by the corresponding post type. Messages are
 *                               keyed with 'updated', 'locked', 'deleted', 'trashed', and 'untrashed'.
 * @param int[] $bulkCounts Array of item counts for each message, used to build internationalized strings.
 *
 * @since 3.7.0
 *
 */
$bulkMessages = apply_filters('bulk_post_updated_messages', $bulkMessages, $bulkCounts);
$bulkCounts = array_filter($bulkCounts);

?>
    <div class="wrap">
        <h1 class="wp-heading-inline">
            <?php
            echo esc_html($post_type_object->labels->name);
            ?>
        </h1>

        <?php
        if (current_user_can($post_type_object->cap->create_posts)) {
            echo ' <a href="' . esc_url(admin_url($postNewFile)) . '" class="page-title-action">' . esc_html(
                    $post_type_object->labels->add_new
                ) . '</a>';
        }

        if (isset($_REQUEST['s']) && strlen($_REQUEST['s'])) {
            echo '<span class="subtitle">';
            printf(
            /* translators: %s: Search query. */
                __('Search results for: %s'),
                '<strong>' . get_search_query() . '</strong>'
            );
            echo '</span>';
        }
        ?>

        <hr class="wp-header-end">

        <?php
        // If we have a bulk message to issue:
        $messages = [];
        foreach ($bulkCounts as $message => $count) {
            if (isset($bulkMessages[ $post_type ][ $message ])) {
                $messages[] = sprintf($bulkMessages[ $post_type ][ $message ], number_format_i18n($count));
            } elseif (isset($bulkMessages['post'][ $message ])) {
                $messages[] = sprintf($bulkMessages['post'][ $message ], number_format_i18n($count));
            }

            if ('trashed' === $message && isset($_REQUEST['ids'])) {
                $ids = preg_replace('/[^0-9,]/', '', $_REQUEST['ids']);
                $messages[] = '<a href="' . esc_url(
                        wp_nonce_url(
                            "edit.php?post_type=$post_type&doaction=undo&action=untrash&ids=$ids",
                            'bulk-posts'
                        )
                    ) . '">' . __('Undo') . '</a>';
            }

            if ('untrashed' === $message && isset($_REQUEST['ids'])) {
                $ids = explode(',', $_REQUEST['ids']);

                if (1 === count($ids) && current_user_can('edit_post', $ids[0])) {
                    $messages[] = sprintf(
                        '<a href="%1$s">%2$s</a>',
                        esc_url(get_edit_post_link($ids[0])),
                        esc_html(get_post_type_object(get_post_type($ids[0]))->labels->edit_item)
                    );
                }
            }
        }

        if ($messages) {
            echo '<div id="message" class="updated notice is-dismissible"><p>' . implode(' ', $messages) . '</p></div>';
        }
        unset($messages);

        $_SERVER['REQUEST_URI'] = remove_query_arg(
            ['locked', 'skipped', 'updated', 'deleted', 'trashed', 'untrashed'],
            $_SERVER['REQUEST_URI']
        );
        ?>

        <?php $wpListTable->views(); ?>

        <form id="posts-filter" method="get">

            <?php $wpListTable->search_box($post_type_object->labels->search_items, 'post'); ?>

            <input type="hidden" name="post_status" class="post_status_page" value="<?php echo !empty($_REQUEST['post_status'])
                ? esc_attr($_REQUEST['post_status']) : 'all'; ?>" />
            <input type="hidden" name="post_type" class="post_type_page" value="<?php echo $post_type; ?>" />

            <?php if (!empty($_REQUEST['author'])) { ?>
                <input type="hidden" name="author" value="<?php echo esc_attr($_REQUEST['author']); ?>" />
            <?php } ?>

            <?php if (!empty($_REQUEST['show_sticky'])) { ?>
                <input type="hidden" name="show_sticky" value="1" />
            <?php } ?>

            <?php $wpListTable->display(); ?>

        </form>

        <?php
        if ($wpListTable->has_items()) {
            $wpListTable->inline_edit();
        }
        ?>

        <div id="ajax-response"></div>
        <div class="clear"></div>
    </div>

<?php

$content = ob_get_clean();
//$content str_replace('edit.php?post_type=vcv_templates', 'admin.php?page=vcv_templates&post_type=vcv_templates', $content);
$content = str_replace('edit.php?', 'admin.php?page=' . $slug . '&post_type=' . $slug . '&', $content);
$content = str_replace(
    'post.php?',
    'admin.php?vcv-post-action=1&page=' . $slug . '&post_type=' . $slug . '&',
    $content
);
$content = str_replace('edit.php', 'admin.php?page=' . $slug . '&post_type=' . $slug . '&', $content);
$content = str_replace(
    '<form id="posts-filter" method="get">',
    '<form id="posts-filter" method="get"><input type="hidden" name="page" value="' . $slug . '" />',
    $content
);

echo $content;