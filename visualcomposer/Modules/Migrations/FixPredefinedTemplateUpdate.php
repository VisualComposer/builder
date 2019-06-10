<?php

namespace VisualComposer\Modules\Migrations;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;

/**
 * Class CustomTemplatesUpdate24Migration
 *
 * This migration fixes predefined template update, by removing vcv-pageContent that shouldn't be there.
 *
 * @package VisualComposer\Modules\Migrations
 */
class FixPredefinedTemplateUpdate extends MigrationsController implements Module
{
    protected $migrationId = 'FixPredefinedTemplateUpdate';

    protected $migrationPriority = 21;

    /**
     * @return void
     */
    protected function run()
    {
        $args = [
            'posts_per_page' => '-1',
            'post_type' => 'vcv_templates',
        ];

        $predefinedTemplates = get_posts($args);

        foreach ($predefinedTemplates as $template) {
            $type = get_post_meta($template->ID, '_' . VCV_PREFIX . 'type', true);
            $content = get_post_meta($template->ID, VCV_PREFIX . 'pageContent', true);
            if ($type === 'hub' && $content) {
                delete_post_meta($template->ID, VCV_PREFIX . 'pageContent');
            }
        }
    }
}
