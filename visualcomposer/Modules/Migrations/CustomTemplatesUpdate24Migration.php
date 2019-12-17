<?php

namespace VisualComposer\Modules\Migrations;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;

/**
 * Class CustomTemplatesUpdate24Migration
 *
 * This migration fixes the template post_content/assets and etc
 *
 * @package VisualComposer\Modules\Migrations
 */
class CustomTemplatesUpdate24Migration extends MigrationsController implements Module
{
    protected $migrationId = 'CustomTemplatesUpdate24Migration';

    protected $migrationPriority = 2;

    /**
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return bool
     */
    protected function run(Options $optionsHelper)
    {
        $needUpdatePost = $optionsHelper->get('hubAction:updatePosts', []);
        if (!is_array($needUpdatePost)) {
            $needUpdatePost = [];
        }

        $args = [
            'posts_per_page' => '-1',
            'post_type' => 'vcv_templates',
        ];

        $customTemplates = get_posts($args);

        foreach ($customTemplates as $template) {
            $metaValue = get_post_meta($template->ID, '_' . VCV_PREFIX . 'type', true);
            if (!$metaValue) {
                $metaValue = '';
            }
            $listOfMetaValues = [
                '', // same as Custom BC
                'custom',
                'customHeader',
                'customFooter',
                'customSidebar',
            ];
            if (in_array($metaValue, $listOfMetaValues)) {
                $needUpdatePost[] = $template->ID;
            }
        }
        $optionsHelper->set('hubAction:updatePosts', array_unique($needUpdatePost));

        return true;
    }
}
