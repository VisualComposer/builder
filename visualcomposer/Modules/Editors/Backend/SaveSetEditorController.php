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
        $this->wpAddFilter('wp_insert_post_data', 'skipContentUpdate');
    }

    protected function setEditor($postId, Request $requestHelper)
    {
        if (defined('REST_REQUEST') && REST_REQUEST === true) {
            // We are in Gutenberg! It doesn't send all the fields..
            update_post_meta($postId, VCV_PREFIX . 'be-editor', 'gutenberg');
        }
        if ($requestHelper->input('vcv-be-editor')) {
            update_post_meta($postId, VCV_PREFIX . 'be-editor', $requestHelper->input('vcv-be-editor'));
        }
    }

    protected function skipContentUpdate($data)
    {
        $requestHelper = vchelper('Request');
        //prevent p tag removing via backend save
        if ($requestHelper->input('vcv-be-editor') === 'be') {
            /** @var \WP_Post $post */
            $post = get_post();
            // @codingStandardsIgnoreLine
            $data['post_content'] = $post->post_content;
        }

        return $data;
    }
}
