<?php

namespace VisualComposer\Modules\Migrations;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;

/**
 * Class PredefinedTemplateMigation
 *
 * This migration sets bundle meta value for predefined templates
 *
 * @package VisualComposer\Modules\Migrations
 */
class PredefinedTemplateMigration extends MigrationsController implements Module
{
    protected $migrationId = 'PredefinedTemplateMigration';

    protected $migrationPriority = 2;

    protected function run()
    {
        $args = [
            'posts_per_page' => '-1',
            'post_type' => 'vcv_templates',
            'meta_query' => [
                'relation' => 'AND',
                [
                    'key' => '_' . VCV_PREFIX . 'bundle',
                    'compare' => 'NOT EXISTS',
                ],
                [
                    'relation' => 'OR',
                    [
                        'key' => '_' . VCV_PREFIX . 'id',
                        'value' => 'TP11000009',        //predefinedTemplate/productCategoryPage
                        'compare' => '=',
                    ],
                    [
                        'key' => '_' . VCV_PREFIX . 'id',
                        'value' => 'TP11000008',        //predefinedTemplate/weddingPage
                        'compare' => '=',
                    ],
                    [
                        'key' => '_' . VCV_PREFIX . 'id',
                        'value' => 'TP11000007',        //predefinedTemplate/personalPage
                        'compare' => '=',
                    ],
                    [
                        'key' => '_' . VCV_PREFIX . 'id',
                        'value' => 'TP11000006',        //predefinedTemplate/mediumStyleArticle
                        'compare' => '=',
                    ],
                    [
                        'key' => '_' . VCV_PREFIX . 'id',
                        'value' => 'TP11000005',        //predefinedTemplate/singleProductPage
                        'compare' => '=',
                    ],
                    [
                        'key' => '_' . VCV_PREFIX . 'id',
                        'value' => 'TP11000004',        //predefinedTemplate/startupPage
                        'compare' => '=',
                    ],
                    [
                        'key' => '_' . VCV_PREFIX . 'id',
                        'value' => 'TP11000003',        //predefinedTemplate/photographyPortfolio
                        'compare' => '=',
                    ],
                    [
                        'key' => '_' . VCV_PREFIX . 'id',
                        'value' => 'TP11000002',        //predefinedTemplate/simpleBlogArticle
                        'compare' => '=',
                    ],
                    [
                        'key' => '_' . VCV_PREFIX . 'id',
                        'value' => 'TP11000001',        //predefinedTemplate/simpleLandingPage
                        'compare' => '=',
                    ],

                ],
            ],
        ];

        $predefinedTemplates = get_posts($args);

        foreach ($predefinedTemplates as $template) {
            $metaValue = get_post_meta($template->ID, '_' . VCV_PREFIX . 'id', true);
            $this->updateMeta($metaValue, $template);
        }

        return true;
    }

    /**
     * @param $metaValue
     * @param $template
     */
    protected function updateMeta($metaValue, $template)
    {
        switch ($metaValue) {
            case 'TP11000001':
                update_post_meta(
                    $template->ID,
                    '_' . VCV_PREFIX . 'bundle',
                    'predefinedTemplate/simpleLandingPage'
                );
                break;
            case 'TP11000002':
                update_post_meta(
                    $template->ID,
                    '_' . VCV_PREFIX . 'bundle',
                    'predefinedTemplate/simpleBlogArticle'
                );
                break;
            case 'TP11000003':
                update_post_meta(
                    $template->ID,
                    '_' . VCV_PREFIX . 'bundle',
                    'predefinedTemplate/photographyPortfolio'
                );
                break;
            case 'TP11000004':
                update_post_meta($template->ID, '_' . VCV_PREFIX . 'bundle', 'predefinedTemplate/startupPage');
                break;
            case 'TP11000005':
                update_post_meta(
                    $template->ID,
                    '_' . VCV_PREFIX . 'bundle',
                    'predefinedTemplate/singleProductPage'
                );
                break;
            case 'TP11000006':
                update_post_meta(
                    $template->ID,
                    '_' . VCV_PREFIX . 'bundle',
                    'predefinedTemplate/mediumStyleArticle'
                );
                break;
            case 'TP11000007':
                update_post_meta($template->ID, '_' . VCV_PREFIX . 'bundle', 'predefinedTemplate/personalPage');
                break;
            case 'TP11000008':
                update_post_meta($template->ID, '_' . VCV_PREFIX . 'bundle', 'predefinedTemplate/weddingPage');
                break;
            case 'TP11000009':
                update_post_meta(
                    $template->ID,
                    '_' . VCV_PREFIX . 'bundle',
                    'predefinedTemplate/productCategoryPage'
                );
                break;
        }
    }
}
