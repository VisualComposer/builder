<?php

namespace VisualComposer\Modules\Migrations;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\Options;

/**
 * Class CustomTemplatesUpdateMigration
 *
 * This migration fixes the template downloaded images
 *
 * @package VisualComposer\Modules\Migrations
 */
class CustomTemplatesUpdateMigration extends MigrationsController implements Module
{
    protected $migrationId = 'CustomTemplatesUpdateMigration';

    protected $migrationPriority = 2;

    protected function run(Options $optionsHelper, CurrentUser $currentUserAccessHelper)
    {
        $needUpdatePost = $optionsHelper->get('hubAction:updatePosts', []);
        if (!is_array($needUpdatePost)) {
            $needUpdatePost = [];
        }

        $args =
            [
                'posts_per_page' => '-1',
                'post_type' => 'vcv_templates',
                'meta_query' => [
                    'relation' => 'OR',
                    [
                        'key' => '_' . VCV_PREFIX . 'type',
                        'value' => 'custom',
                        'compare' => '=',
                    ],
                    [
                        'key' => '_' . VCV_PREFIX . 'type',
                        'value' => 'customHeader',
                        'compare' => '=',
                    ],
                    [
                        'key' => '_' . VCV_PREFIX . 'type',
                        'value' => 'customFooter',
                        'compare' => '=',
                    ],
                    [
                        'key' => '_' . VCV_PREFIX . 'type',
                        'value' => 'customSidebar',
                        'compare' => '=',
                    ],
                    [
                        'key' => '_' . VCV_PREFIX . 'type',
                        'value' => '',
                        'compare' => '=',
                    ],
                ],
            ];

        $customTemplates = new \WP_Query($args);

        while ($customTemplates->have_posts()) {
            $customTemplates->the_post();
            $postId = get_the_ID();
            if ($currentUserAccessHelper->wpAll('edit_posts')->get()) {
                $needUpdatePost[] = $postId;
            }
        }
        wp_reset_postdata();

        $optionsHelper->set('hubAction:updatePosts', array_unique($needUpdatePost));

        return true;
    }
}
