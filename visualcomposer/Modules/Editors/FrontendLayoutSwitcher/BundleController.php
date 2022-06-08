<?php

namespace VisualComposer\Modules\Editors\FrontendLayoutSwitcher;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\UserCapabilities;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;

class BundleController extends Container implements Module
{
    use WpFiltersActions;

    public function __construct()
    {
        $this->wpAddAction('edit_form_top', 'addCurrentEditorField');
        $this->wpAddAction('edit_form_advanced', 'addCurrentEditorField');
        $this->wpAddAction('admin_enqueue_scripts', 'addBundleStyle');
        $this->wpAddAction('admin_enqueue_scripts', 'addBundleScript');
    }

    protected function addCurrentEditorField(
        $post,
        UserCapabilities $userCapabilitiesHelper,
        Options $optionsHelper,
        Request $requestHelper
    ) {
        if ($userCapabilitiesHelper->canEdit($post->ID)) {
            $savedEditor = get_post_meta(get_the_ID(), VCV_PREFIX . 'be-editor', true);
            $isGutenbergEnabled = (bool)$optionsHelper->get('settings-gutenberg-editor-enabled', true);

            // New page/post
            $editor = $isGutenbergEnabled ? 'gutenberg' : 'classic';

            // Give a preference to saved editor
            if ($savedEditor) {
                $editor = $savedEditor;
                // but we can't load gutenberg if it is disabled in settings
                if (!$isGutenbergEnabled && $savedEditor === 'gutenberg') {
                    $editor = 'classic';
                }
            }

            // Handle the click on "Gutenberg Editor" button
            if (
                $isGutenbergEnabled
                && $requestHelper->input('vcv-set-editor') === 'gutenberg'
                && !$requestHelper->exists('classic-editor')
            ) {
                $editor = 'gutenberg';
            }

            // Handle the click on "Classic Editor" button
            if (!$isGutenbergEnabled && $requestHelper->exists('classic-editor')) {
                $editor = 'classic';
            }

            echo sprintf(
                '<input type="hidden" name="vcv-be-editor" id="vcv-be-editor" value="%s">',
                esc_attr(
                    vcfilter('vcv:editors:frontendLayoutSwitcher:currentEditor', $editor)
                )
            );
        }
    }

    protected function addBundleStyle(
        Url $urlHelper,
        Frontend $frontendHelper,
        UserCapabilities $userCapabilitiesHelper
    ) {
        $screen = get_current_screen();
        if (
            // @codingStandardsIgnoreLine
            $screen->post_type === get_post_type()
            && !$frontendHelper->isFrontend()
            && $userCapabilitiesHelper->isEditorEnabled(get_post_type())
        ) {
            // Add CSS
            wp_enqueue_style(
                'vcv:editors:backendswitcher:style',
                $urlHelper->to('public/dist/wpbackendswitch.bundle.css'),
                [],
                VCV_VERSION
            );
        }
    }

    protected function addBundleScript(
        Url $urlHelper,
        Frontend $frontendHelper,
        UserCapabilities $userCapabilitiesHelper
    ) {
        $screen = get_current_screen();
        if (
            // @codingStandardsIgnoreLine
            $screen->post_type === get_post_type()
            && !$frontendHelper->isFrontend()
            && $userCapabilitiesHelper->isEditorEnabled(get_post_type())
        ) {
            wp_register_script(
                'vcv:editors:backendswitcher:script',
                $urlHelper->to('public/dist/wpbackendswitch.bundle.js'),
                ['vcv:assets:vendor:script'],
                VCV_VERSION
            );
            wp_enqueue_script('vcv:editors:backendswitcher:script');

            // Add JS
            $scriptBody = sprintf('window.vcvFrontendEditorLink = "%s";', $frontendHelper->getFrontendUrl());
            wp_add_inline_script('vcv:editors:backendswitcher:script', $scriptBody, 'before');
            wp_enqueue_script('vcv:assets:runtime:script');
        }
    }
}
