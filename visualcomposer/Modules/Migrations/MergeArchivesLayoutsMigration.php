<?php

namespace VisualComposer\Modules\Migrations;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;

class MergeArchivesLayoutsMigration extends MigrationsController implements Module
{
    protected $migrationId = 'mergeArchivesLayoutsMigrationv40';

    protected $migrationPriority = 1;

    protected function run()
    {
        $args = [
            'numberposts' => -1,
            'post_type' => 'vcv_archives',
            'orderby' => 'title',
            'order' => 'ASC',
            'post_status' => 'any',
        ];
        $archives = get_posts($args);

        foreach ($archives as $archive) {
            set_post_type($archive->ID, 'vcv_layouts');
            update_post_meta($archive->ID, VCV_PREFIX . 'layoutType', 'archiveTemplate');
        }

        return true;
    }
}
