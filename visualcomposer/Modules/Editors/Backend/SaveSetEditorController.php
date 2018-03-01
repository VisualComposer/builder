<?php

namespace VisualComposer\Modules\Editors\Backend;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class Controller.
 */
class SaveSetEditorController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct()
    {
        $this->wpAddAction('save_post', 'setEditor');
    }

    protected function setEditor(Request $requestHelper)
    {
        /** @var \WP_Post $post */
        $post = get_post();
        if ($post && $requestHelper->input('vcv-be-editor')) {
            update_post_meta($post->ID, VCV_PREFIX . 'be-editor', $requestHelper->input('vcv-be-editor'));
        }
    }
}
