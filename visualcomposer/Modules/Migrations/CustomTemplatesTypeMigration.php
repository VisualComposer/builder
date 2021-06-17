<?php

namespace VisualComposer\Modules\Migrations;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;

class CustomTemplatesTypeMigration extends MigrationsController implements Module
{
    protected $migrationId = 'CustomTemplatesTypeMigration38';

    protected $migrationPriority = 2;

    protected function queryTemplatesId()
    {
        // We cannot use get_posts because of high memory usage (>100mb on 60 templates)
        // Problems: multilingual translations are not filtered, but 3rd party can use filters if they wish so
        // Additionally: we load just all templates now.
        global $wpdb;
        $results = $wpdb->get_results(
            " select distinct a.ID as id
from {$wpdb->posts} a
         left join {$wpdb->postmeta} b on b.post_id = a.ID
where a.post_type = 'vcv_templates'
  and a.post_status in ('draft', 'publish')
  and a.ID not in (
    select a.ID
    from {$wpdb->posts} a
             left join {$wpdb->postmeta} b on b.post_id = a.ID
    where a.post_type = 'vcv_templates'
      and a.post_status in ('draft', 'publish')
      and b.meta_key = '_vcv-type'
)",
            ARRAY_A
        );

        return $results;
    }

    protected function run()
    {
        $ids = $this->queryTemplatesId();
        if (!empty($ids)) {
            foreach ($ids as $idData) {
                $id = $idData['id'];
                update_post_meta($id, '_vcv-type', 'custom');
            }
        }

        return true;
    }
}
