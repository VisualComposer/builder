<?php

namespace VisualComposer\Modules\Vendors\Gutenberg;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\Gutenberg;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class DisableController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    protected $printed = false;

    public function __construct()
    {
        $this->wpAddAction(
            'admin_init',
            'initialize',
            30
        );
    }

    protected function initialize(CurrentUser $currentUserAccess)
    {
        global $pagenow;
        // Run only if pagenow is post editing
        if ($pagenow === 'post-new.php' || $pagenow === 'post.php') {
            if (!function_exists('the_gutenberg_project') && !function_exists('use_block_editor_for_post')) {
                return;
            }
            if (!$currentUserAccess->wpAll('edit_posts')->get()) {
                return;
            }

            /** @see \VisualComposer\Modules\Vendors\Gutenberg\DisableController::disableGutenberg */
            $this->call('disableGutenberg');

            /** @see \VisualComposer\Modules\Vendors\Gutenberg\DisableController::setEditor */
            $this->call('setEditor');

            /** @see \VisualComposer\Modules\Vendors\Gutenberg\DisableController::outputGutenberg */
            $this->wpAddAction('admin_print_scripts', 'outputGutenberg');
        }
    }

    /**
     * Disable the gutenberg
     *
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @throws \ReflectionException
     */
    protected function disableGutenberg(Options $optionsHelper, Request $requestHelper, Gutenberg $gutenbergHelper)
    {
        $sourceId = get_the_ID();
        if (!$sourceId) {
            $sourceId = $requestHelper->input('post');
        }

        $postType = get_post_type($sourceId);
        if (!$postType) {
            $postType = $requestHelper->input('post_type');
        }
        if ($postType === 'vcv_gutenberg_attr') {
            return;
        }

        $savedEditor = get_post_meta($sourceId, VCV_PREFIX . 'be-editor', true);
        $isEnabled = (bool)$optionsHelper->get('settings-gutenberg-editor-enabled', true);

        if (
            ($savedEditor === 'gutenberg' && $isEnabled)
            || $requestHelper->exists('classic-editor__forget')
            || (
                $isEnabled
                && $requestHelper->input('vcv-set-editor') === 'gutenberg'
                && !$requestHelper->exists('classic-editor')
            )
            || (
                $isEnabled
                && $savedEditor !== 'classic'
                && !$requestHelper->exists('classic-editor')
                && !$gutenbergHelper->isVisualComposerPage($sourceId)
            )
        ) {
            return;
        }

        if (function_exists('use_block_editor_for_post')) {
            $this->wpAddFilter('use_block_editor_for_post', '__return_false');
        } elseif (function_exists('the_gutenberg_project')) {
            $this->wpAddFilter('gutenberg_can_edit_post_type', '__return_false');
        }
    }

    /**
     * Set editor to gutenberg, handled by vcv-set-editor parameter
     *
     * @param \VisualComposer\Helpers\Request $requestHelper
     */
    protected function setEditor(Request $requestHelper)
    {
        if ($requestHelper->exists(VCV_PREFIX . 'set-editor')) {
            $sourceId = get_the_ID();
            if (!$sourceId) {
                $sourceId = $requestHelper->input('post');
            }

            /** @var \WP_Post $post */
            $post = get_post($sourceId);
            $editor = $requestHelper->input(VCV_PREFIX . 'set-editor');
            if ($post && $editor) {
                update_post_meta($post->ID, VCV_PREFIX . 'be-editor', $editor);
                $protocol = ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
                    || $_SERVER['SERVER_PORT'] === 443) ? 'https://' : 'http://';
                $url = $protocol . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
                $url = remove_query_arg(VCV_PREFIX . 'set-editor', $url);
                wp_safe_redirect($url);
                exit;
            }
        }
    }

    /**
     * Output global variables for WordPress edit pages
     *
     * @param \VisualComposer\Helpers\Gutenberg $gutenbergHelper
     */
    protected function outputGutenberg(Gutenberg $gutenbergHelper)
    {
        if ($this->printed) {
            return;
        }

        $available = false;
        if ($gutenbergHelper->isGutenbergAvailable()) {
            $available = true;
        }
        evcview(
            'partials/constant-script',
            [
                'key' => 'VCV_GUTENBERG',
                'value' => $available,
                'type' => 'constant',
            ]
        );
        $this->printed = true;
    }
}
