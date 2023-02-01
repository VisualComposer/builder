<?php

namespace VisualComposer\Modules\Editors\Frontend;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class VariablesController
 * @package VisualComposer\Modules\Editors\Frontend
 */
class VariablesController extends Container implements Module
{
    use EventsFilters;

    /**
     * VariablesController constructor.
     */
    public function __construct()
    {
        $this->addFilter('vcv:editor:variables vcv:wp:dashboard:variables', 'addRequestVariables');
        $this->addFilter('vcv:editor:variables', 'addVariables');
    }

    /**
     * @param $variables
     * @param $payload
     *
     * @return array
     */
    protected function addRequestVariables($variables, $payload)
    {
        $urlHelper = vchelper('Url');
        $nonceHelper = vchelper('Nonce');

        $variables[] = [
            'key' => 'ajaxurl',
            'value' => set_url_scheme(admin_url('admin-ajax.php', 'relative')),
            'type' => 'variable',
        ];
        $variables[] = [
            'key' => 'vcvAjaxUrl',
            'value' => $urlHelper->ajax(),
            'type' => 'variable',
        ];
        $variables[] = [
            'key' => 'vcvAdminAjaxUrl',
            'value' => $urlHelper->adminAjax(),
            'type' => 'variable',
        ];
        $variables[] = [
            'key' => 'vcvNonce',
            'value' => $nonceHelper->admin(),
            'type' => 'variable',
        ];
        $variables[] = [
            'key' => 'vcvPageEditableNonce',
            'value' => $nonceHelper->pageEditable(),
            'type' => 'variable',
        ];
        $variables[] = [
            'key' => 'vcvPluginUrl',
            'value' => VCV_PLUGIN_URL,
            'type' => 'variable',
        ];
        $variables[] = [
            'key' => 'vcvPluginSourceUrl',
            'value' => VCV_PLUGIN_URL . 'public/sources/',
            'type' => 'variable',
        ];
        $variables[] = [
            'key' => 'vcvGutenbergEditorUrl',
            'value' => set_url_scheme(admin_url('post-new.php?post_type=vcv_gutenberg_attr')),
            'type' => 'variable',
        ];
        $variables[] = [
            'type' => 'variable',
            'key' => 'vcvManageOptions',
            'value' => vchelper('AccessCurrentUser')->wpAll('manage_options')->get(),
        ];
        $variables[] = [
            'key' => 'vcvCreateMenuUrl',
            'value' => set_url_scheme(admin_url('nav-menus.php?action=edit&menu=0')),
            'type' => 'variable',
        ];
        $variables[] = [
            'key' => 'vcvManageMenuUrl',
            'value' => set_url_scheme(admin_url('nav-menus.php')),
            'type' => 'variable',
        ];
        $variables[] = [
            'key' => 'vcvWpAdminUrl',
            'value' => set_url_scheme(admin_url()),
            'type' => 'variable',
        ];
        $variables[] = [
            'key' => 'vcvCreateTemplateUrl',
            'value' => set_url_scheme(admin_url('post-new.php?post_type=vcv_templates')),
            'type' => 'variable',
        ];

        return $variables;
    }

    /**
     * @param $variables
     * @param $payload
     *
     * @return array
     */
    protected function addVariables($variables, $payload)
    {
        if (isset($payload['sourceId'])) {
            $postTypeHelper = vchelper('PostType');

            $sourceId = $payload['sourceId'];

            $feError = (int)get_option('page_for_posts') === $sourceId ? 'page_for_posts' : false;
            $variables[] = [
                'key' => 'vcvFeError',
                'value' => $feError,
                'type' => 'variable',
            ];

            $variables[] = [
                'key' => 'vcvSourceID',
                'value' => $sourceId,
                'type' => 'variable',
            ];
            $variables[] = [
                'key' => 'vcvPostData',
                'value' => $postTypeHelper->getPostData(),
                'type' => 'variable',
            ];
            $variables[] = [
                'key' => 'vcvPostPermanentLink',
                'value' => set_url_scheme(get_permalink(get_the_ID())),
                'type' => 'variable',
            ];
            $variables[] = [
                'key' => 'vcvIsAtarimActive',
                'value' => defined('WPF_PLUGIN_NAME') ? true : false,
                'type' => 'variable',
            ];
        }

        return $variables;
    }
}
