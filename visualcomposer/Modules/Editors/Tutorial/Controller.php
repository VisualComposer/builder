<?php

namespace VisualComposer\Modules\Editors\Tutorial;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\PostType;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class EnvController
 * @package VisualComposer\Modules\Editors
 */
class Controller extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    protected $postType = 'vcv_tutorials';

    public function __construct()
    {
        $this->addFilter('vcv:editor:variables vcv:wp:dashboard:variables', 'addVariables');
        $this->addFilter('vcv:ajax:editors:tutorial:create:adminNonce', 'createTutorialPage', 10);
        $this->wpAddFilter('template_include', 'templatesEditorBlankTemplate', 30);
    }

    /**
     * @param $variables
     *
     * @return array
     */
    protected function addVariables($variables)
    {
        // Get Tutorial Template Post ID
        $frontendHelper = vchelper('Frontend');
        $tutorialTemplate = get_posts(['post_type' => $this->postType, 'post_status' => 'publish', 'numberposts' => 1]);
        if(isset($tutorialTemplate) && !empty($tutorialTemplate)){
            $tutorialTemplateId = $tutorialTemplate[0]->ID;
            $tutorialUrl = $frontendHelper->getFrontendUrl($tutorialTemplateId);
            $variables[] = [
                'type' => 'constant',
                'key' => 'VCV_TUTORIAL_PAGE_URL',
                'value' => $tutorialUrl,
            ];
        }

        return $variables;
    }

    /**
     * Download and import tutorial template
     * @return array|false[]
     */
    protected function createTutorialPage()
    {
        $frontendHelper = vchelper('Frontend');
        vchelper('Request')->setData(['vcv-bundle'=>'template/sharedMazaisTemp']);
        $response = vcfilter('vcv:ajax:hub:download:template:adminNonce', ['isTutorial' => true], ['sourceId' => '']);
        if (!vcIsBadResponse($response)) {
            $tutorialId = isset($response['templates'][0]['id']) ? $response['templates'][0]['id'] : '';
            $tutorialUrl = $frontendHelper->getFrontendUrl($tutorialId);
            return ['status' => true, 'tutorialUrl' => $tutorialUrl];
        }
        return ['status' => false];
    }

    /**
     * The tutorial page editors should have always "blank" behaviour
     *
     * @param $originalTemplate
     * @param \VisualComposer\Helpers\PostType $postTypeHelper
     * @param \VisualComposer\Helpers\Frontend $frontendHelper
     *
     * @return string
     * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
     */
    protected function templatesEditorBlankTemplate(
        $originalTemplate,
        PostType $postTypeHelper,
        Frontend $frontendHelper
    ) {
        if (
            $frontendHelper->isPageEditable()
            && $postTypeHelper->get()->post_type === $this->postType
        ) {
            $template = 'blank-stretched-template.php';

            return vcapp()->path('visualcomposer/resources/views/editor/templates/') . $template;
        }

        return $originalTemplate;
    }
}
