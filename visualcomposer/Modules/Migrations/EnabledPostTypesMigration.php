<?php

namespace VisualComposer\Modules\Migrations;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;

class EnabledPostTypesMigration extends MigrationsController implements Module
{
    use EventsFilters;

    protected $migrationId = 'enabledPostTypesMigrationv37';

    protected $migrationPriority = 1;

    public function __construct()
    {
        parent::__construct();
        $this->addEvent('vcv:migration:enabledPostTypesMigration', 'run');
    }

    protected function run(Options $optionsHelper)
    {
        $enabledPostTypes = $optionsHelper->get('post-types', ['page', 'post']);
        $roles = ['administrator', 'editor', 'author', 'contributor'];
        $roleHelper = vchelper('AccessRole');
        if (!empty($enabledPostTypes) && is_array($enabledPostTypes)) {
            foreach ($roles as $role) {
                $roleObject = get_role($role);
                if (!$roleObject) {
                    continue;
                }
                foreach ($enabledPostTypes as $postType) {
                    $postTypeObject = get_post_type_object($postType);

                    if ($postTypeObject && $roleObject->has_cap($postTypeObject->cap->edit_posts)) {
                        $roleHelper->who($role)->part('post_types')->setCapRule('edit_' . $postType, true);
                    }
                }
            }
        }

        $optionsHelper->delete('post-types');

        return true;
    }
}
