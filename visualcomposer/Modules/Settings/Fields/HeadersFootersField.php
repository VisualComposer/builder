<?php

namespace VisualComposer\Modules\Settings\Fields;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Settings\Traits\Fields;
use VisualComposer\Helpers\Access\EditorPostType;

class HeadersFootersField extends Container implements Module
{
    use Fields;
    use WpFiltersActions;
    use EventsFilters;

    protected $slug = 'vcv-headers-footers';

    /**
     * General constructor.
     */
    public function __construct()
    {
        $this->optionGroup = $this->slug;
        $this->optionSlug = 'vcv-headers-footers';
        $this->wpAddAction(
            'admin_init',
            'buildPage'
        );
        $this->addEvent('vcv:system:factory:reset', 'unsetOptions');
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionsHelper
     */
    protected function buildPage(Options $optionsHelper)
    {
        /**
         * Main section
         */
        $this->addSection(
            [
                'page' => $this->slug,
                'slug' => 'headers-footers-override',
            ]
        );

        $overrideOption = (array)$optionsHelper->get('headerFooterSettings');
        $fieldCallback = function () use ($overrideOption) {
            $args = [
                'options' => $overrideOption,
                'name' => 'vcv-headerFooterSettings',
                'value' => 'headers-footers-override',
                'title' => esc_html__(
                    'Overwrite default theme headers and footers with Visual Composer headers and footers for pages, posts, and custom post types.',
                    'vcwb'
                ),
            ];
            echo $this->call('renderToggle', $args);
        };

        /**
         * All site headers and footers section
         */
        $this->addField(
            [
                'page' => $this->slug,
                'name' => 'headerFooterSettings',
                'id' => 'vcv-headers-footers-override',
                'slug' => 'headers-footers-override',
                'fieldCallback' => $fieldCallback,
                'args' => [
                    'class' => 'vcv-no-title',
                ],
            ]
        );

        $sectionCallbackAllSite = function () {
            echo sprintf(
                '<p class="description">%s</p>',
                esc_html__('Specify custom Visual Composer header and footer for the whole site.', 'vcwb')
            );
        };

        $this->addSection(
            [
                'page' => $this->slug,
                'title' => __('All Site', 'vcwb'),
                'slug' => 'headers-footers-all-site',
                'callback' => $sectionCallbackAllSite,
            ]
        );

        $availableHeaders = $this->call('getPosts', ['vcv_headers']);
        $selectedAllHeader = (int)$optionsHelper->get('headerFooterSettingsAllHeader');

        $fieldCallbackAllSiteHeader = function () use ($availableHeaders, $selectedAllHeader) {
            $args = [
                'options' => $availableHeaders,
                'name' => 'vcv-headerFooterSettingsAllHeader',
                'value' => $selectedAllHeader,
                'emptyOptionTitle' => __('Default', 'vcwb'),
            ];
            echo $this->call('renderDropdown', $args);
        };
        $this->addField(
            [
                'page' => $this->slug,
                'title' => 'Header',
                'name' => 'headerFooterSettingsAllHeader',
                'id' => 'vcv-headers-footers-all-header',
                'slug' => 'headers-footers-all-site',
                'fieldCallback' => $fieldCallbackAllSiteHeader,
            ]
        );

        $availableFooters = $this->call('getPosts', ['vcv_footers']);
        $selectedAllFooter = (int)$optionsHelper->get('headerFooterSettingsAllFooter');

        $fieldCallbackAllSiteFooter = function () use ($availableFooters, $selectedAllFooter) {
            $args = [
                'options' => $availableFooters,
                'name' => 'vcv-headerFooterSettingsAllFooter',
                'value' => $selectedAllFooter,
                'emptyOptionTitle' => __('Default', 'vcwb'),
            ];
            echo $this->call('renderDropdown', $args);
        };
        $this->addField(
            [
                'page' => $this->slug,
                'title' => 'Footer',
                'name' => 'headerFooterSettingsAllFooter',
                'id' => 'vcv-headers-footers-all-footer',
                'slug' => 'headers-footers-all-site',
                'fieldCallback' => $fieldCallbackAllSiteFooter,
            ]
        );

        /**
         * Separate post types headers and footers section
         */
        $this->addSection(
            [
                'page' => $this->slug,
                'slug' => 'headers-footers-separate-post-types',
            ]
        );

        $separateOption = (array)$optionsHelper->get('headerFooterSettingsSeparate');
        $fieldCallbackSeparate = function () use ($separateOption) {
            $args = [
                'options' => $separateOption,
                'name' => 'vcv-headerFooterSettingsSeparate',
                'value' => 'headers-footers-separate',
                'title' => esc_html__('Define headers and footers per post type.', 'vcwb'),
            ];
            echo $this->call('renderToggle', $args);
        };

        $this->addField(
            [
                'page' => $this->slug,
                'name' => 'headerFooterSettingsSeparate',
                'id' => 'vcv-headers-footers-separate',
                'slug' => 'headers-footers-separate-post-types',
                'fieldCallback' => $fieldCallbackSeparate,
                'args' => [
                    'class' => 'vcv-no-title',
                ],
            ]
        );

        $enabledPostTypes = $this->call('getEnabledPostTypes');
        foreach ($enabledPostTypes as $postType) {
            $sectionCallback = function () use ($postType) {
                echo sprintf(
                    __('Define header and footer for %s.'),
                    $postType
                );
            };

            $this->addSection(
                [
                    'page' => $this->slug,
                    'title' => ucfirst($postType),
                    'slug' => 'headers-footers-separate-post-type-' . $postType,
                    'callback' => $sectionCallback,
                ]
            );

            $selectedSeparateHeader = (int)$optionsHelper->get('headerFooterSettingsSeparateHeader-' . $postType);
            $fieldCallback = function () use ($availableHeaders, $selectedSeparateHeader, $postType) {
                $args = [
                    'options' => $availableHeaders,
                    'name' => 'vcv-headerFooterSettingsSeparateHeader-' . $postType,
                    'value' => $selectedSeparateHeader,
                    'emptyOptionTitle' => __('Default', 'vcwb'),
                ];
                echo $this->call('renderDropdown', $args);
            };

            $this->addField(
                [
                    'page' => $this->slug,
                    'title' => __('Header', 'vcwb'),
                    'name' => 'headerFooterSettingsSeparateHeader-' . $postType,
                    'id' => 'vcv-header-footer-settings-separate-header-' . $postType,
                    'slug' => 'headers-footers-separate-post-type-' . $postType,
                    'fieldCallback' => $fieldCallback,
                ]
            );

            $selectedSeparateFooter = (int)$optionsHelper->get('headerFooterSettingsSeparateFooter-' . $postType);
            $fieldCallback = function () use ($availableFooters, $selectedSeparateFooter, $postType) {
                $args = [
                    'options' => $availableFooters,
                    'name' => 'vcv-headerFooterSettingsSeparateFooter-' . $postType,
                    'value' => $selectedSeparateFooter,
                    'emptyOptionTitle' => __('Default', 'vcwb'),
                ];
                echo $this->call('renderDropdown', $args);
            };

            $this->addField(
                [
                    'page' => $this->slug,
                    'title' => __('Footer', 'vcwb'),
                    'name' => 'headerFooterSettingsSeparateFooter-' . $postType,
                    'id' => 'vcv-header-footer-settings-separate-footer-' . $postType,
                    'slug' => 'headers-footers-separate-post-type-' . $postType,
                    'fieldCallback' => $fieldCallback,
                ]
            );
        }
    }

    /**
     * @param $options
     * @param $value
     * @param $name
     *
     * @return mixed|string
     */
    protected function renderToggle($options, $value, $name, $title)
    {
        return vcview(
            'settings/pages/headers-footers/headers-footers-toggle',
            [
                'value' => $value,
                'name' => $name,
                'enabledOptions' => $options,
                'title' => $title,
            ]
        );
    }

    /**
     * @param $options
     * @param $value
     * @param $name
     * @param $emptyOptionTitle
     *
     * @return mixed|string
     */
    protected function renderDropdown($options, $value, $name, $emptyOptionTitle)
    {
        return vcview(
            'settings/pages/headers-footers/headers-footers-dropdown',
            [
                'value' => $value,
                'enabledOptions' => (array)$options,
                'name' => $name,
                'emptyOptionTitle' => $emptyOptionTitle,
            ]
        );
    }

    /**
     * @param $postType
     *
     * @return array
     */
    protected function getPosts($postType)
    {
        $args = [
            'numberposts' => -1,
            'post_type' => $postType,
            'orderby' => 'title',
            'order' => 'ASC',
        ];

        $availablePosts = [];
        $posts = get_posts($args);
        if (!empty($posts)) {
            foreach ($posts as $post) {
                $postData = [];
                $postData['id'] = $post->ID;
                // @codingStandardsIgnoreLine
                $postData['title'] = $post->post_title;
                array_push($availablePosts, $postData);
            }
        }

        return $availablePosts;
    }

    /**
     * @param \VisualComposer\Helpers\Access\EditorPostType $editorPostTypeHelper
     *
     * @return array
     */
    protected function getEnabledPostTypes(EditorPostType $editorPostTypeHelper)
    {
        $enabledPostTypes = $editorPostTypeHelper->getEnabledPostTypes();
        $vcPostTypes = ['vcv_headers', 'vcv_footers', 'vcv_sidebars', 'vcv_templates'];
        $enabledPostTypes = array_diff($enabledPostTypes, $vcPostTypes);

        return $enabledPostTypes;
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionsHelper
     */
    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper->delete('headerFooterSettings');
        $optionsHelper->delete('headerFooterSettingsAllHeader');
        $optionsHelper->delete('headerFooterSettingsAllFooter');
        $optionsHelper->delete('headerFooterSettingsSeparate');
        $enabledPostTypes = $this->call('getEnabledPostTypes');
        if (!empty($enabledPostTypes)) {
            foreach ($enabledPostTypes as $postType) {
                $optionsHelper->delete('headerFooterSettingsSeparateHeader-' . $postType);
                $optionsHelper->delete('headerFooterSettingsSeparateFooter-' . $postType);
            }
        }
    }
}
