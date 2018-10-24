<?php

namespace VisualComposer\Modules\License\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\Access\EditorPostType;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Url;
use VisualComposer\Modules\Settings\Traits\Page;
use VisualComposer\Modules\Settings\Traits\SubMenu;

/**
 * Class GetPremiumRedesign.
 */
class GetPremiumRedesign extends Container implements Module
{
    use Page;
    use SubMenu;
    use EventsFilters;
    use WpFiltersActions;

    /**
     * @var string
     */
    protected $slug = 'vcv-go-premium';

    /**
     * @var string
     */
    protected $templatePath = 'license/activation/layout';

    public function __construct(License $licenseHelper, Token $tokenHelper)
    {
        if (!vcvenv('VCV_FT_ACTIVATION_REDESIGN')) {
            return;
        }

        // Setting site authorized for new activation
        $tokenHelper->setSiteAuthorized();

        $this->wpAddAction(
            'admin_menu',
            function (License $licenseHelper, Request $requestHelper) {
                if (!$licenseHelper->isActivated()) {
                    /** @see \VisualComposer\Modules\License\Pages\GetPremium::addPage */
                    $this->call('addPage');
                } elseif ($requestHelper->input('page') === $this->getSlug()) {
                    wp_redirect(admin_url('admin.php?page=vcv-about'));
                    exit;
                }
            },
            70
        );

        if (!$licenseHelper->isActivated()) {
            $this->wpAddFilter(
                'plugin_action_links_' . VCV_PLUGIN_BASE_NAME,
                'pluginsPageLink'
            );
        }
    }

    /**
     *
     */
    protected function beforeRender()
    {
        $urlHelper = vchelper('Url');
        wp_register_script(
            'vcv:wpActivationRedesign:script',
            $urlHelper->assetUrl('dist/wpActivationRedesign.bundle.js'),
            [],
            VCV_VERSION
        );
        wp_register_style(
            'vcv:wpActivationRedesign:style',
            $urlHelper->assetUrl('dist/wpActivationRedesign.bundle.css'),
            [],
            VCV_VERSION
        );
        wp_enqueue_script('vcv:wpActivationRedesign:script');
        wp_enqueue_style('vcv:wpActivationRedesign:style');
        $this->addFilter('vcv:license:variables', 'addActivationVariables');
    }

    protected function addActivationVariables(
        $variables,
        CurrentUser $currentUserAccessHelper,
        EditorPostType $editorPostTypeHelper,
        Url $urlHelper
    ) {
        $variables[] = [
            'key' => 'VCV_ACTIVATION_CURRENT_PAGE',
            'value' => '',
            'type' => 'constant',
        ];
        $variables[] = [
            'key' => 'VCV_PLUGIN_VERSION',
            'value' => VCV_VERSION,
            'type' => 'constant',
        ];
        $variables[] = [
            'key' => 'VCV_ACTIVATION_SLIDES',
            'value' => [
                [
                    'url' => esc_js($urlHelper->assetUrl('images/account/slideshow-01.png')),
                    'title' => esc_js(__(
                        'Build your site with the help of drag and drop editor straight from the frontend - it\'s that easy.',
                        'vcwb'
                    )),
                ],
                [
                    'url' => esc_js($urlHelper->assetUrl('images/account/slideshow-02.png')),
                    'title' => esc_js(__(
                        'Get more elements and templates from the Visual Composer Hub - a free online marketplace.',
                        'vcwb'
                    )),
                ],
                [
                    'url' => esc_js($urlHelper->assetUrl('images/account/slideshow-03.png')),
                    'title' => esc_js(__(
                        'Unparallel performance for you and your website to rank higher and deliver faster.',
                        'vcwb'
                    )),
                ],
                [
                    'url' => esc_js($urlHelper->assetUrl('images/account/slideshow-04.png')),
                    'title' => esc_js(__(
                        'Control every detail of your website with flexible design options and customization tools.',
                        'vcwb'
                    )),
                ],
            ],
            'type' => 'constant',
        ];

        if ($currentUserAccessHelper->wpAll('edit_pages')->get() && $editorPostTypeHelper->isEditorEnabled('page')) {
            $variables[] = [
                'key' => 'VCV_CREATE_NEW_URL',
                'value' => vcfilter('vcv:about:postNewUrl', 'post-new.php?post_type=page&vcv-action=frontend'),
                'type' => 'constant',
            ];
            $variables[] = [
                'key' => 'VCV_CREATE_NEW_TEXT',
                'value' => __('Create new page', 'vcwb'),
                'type' => 'constant',
            ];
        } elseif ($currentUserAccessHelper->wpAll('edit_posts')->get()
            && $editorPostTypeHelper->isEditorEnabled(
                'post'
            )) {
            $variables[] = [
                'key' => 'VCV_CREATE_NEW_URL',
                'value' => vcfilter('vcv:about:postNewUrl', 'post-new.php?vcv-action=frontend'),
                'type' => 'constant',
            ];

            $variables[] = [
                'key' => 'VCV_CREATE_NEW_TEXT',
                'value' => __('Create new post', 'vcwb'),
                'type' => 'constant',
            ];
        }
        $variables[] = [
            'key' => 'VCV_ACTIVATION_PREMIUM_URL',
            'value' => admin_url('admin.php?page=vcv-upgrade'),
            'type' => 'constant',
        ];


        return $variables;
    }

    /**
     *
     */
    protected function addPage()
    {
        $page = [
            'slug' => $this->getSlug(),
            'title' => $this->buttonTitle(),
            'layout' => 'standalone',
            'showTab' => false,
            'controller' => $this,
            'capability' => 'manage_options',
        ];
        $this->addSubmenuPage($page);
    }

    protected function buttonTitle()
    {
        return sprintf(
            '<strong style="vertical-align: middle;font-weight:500;">%s</strong>',
            __('Go Premium', 'vcwb')
        );
    }

    /**
     * Add go premium link in plugins page
     *
     * @param $links
     *
     * @return mixed
     */
    protected function pluginsPageLink($links)
    {
        $goPremiumLink = sprintf(
            '<a href="%s">%s</a>',
            esc_url(admin_url('admin.php?page=vcv-go-premium')) . '&vcv-ref=plugins-page',
            __('Go Premium', 'vcwb')
        );

        array_push($links, $goPremiumLink);

        return $links;
    }
}
