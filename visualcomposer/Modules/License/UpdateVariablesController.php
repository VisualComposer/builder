<?php

namespace VisualComposer\Modules\License;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Hub\Update;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class UpdateVariablesController
 * @package VisualComposer\Modules\License
 */
class UpdateVariablesController extends Container implements Module
{
    use EventsFilters;

    /**
     * UpdateVariablesController constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\License\UpdateVariablesController::addVariables */
        $this->addFilter('vcv:wp:dashboard:variables vcv:editor:variables', 'addVariables');
    }

    /**
     * @param $variables
     * @param $payload
     * @param \VisualComposer\Helpers\Hub\Update $updateHelper
     * @param \VisualComposer\Helpers\License $licenseHelper
     *
     * @return array
     */
    protected function addVariables($variables, $payload, Update $updateHelper, License $licenseHelper)
    {
        if (isset($payload['slug'])) {
            $variables = array_merge($variables, $updateHelper->getVariables());
            if ($payload['slug'] === 'vcv-about') {
                $variables[] = [
                    'key' => 'VCV_ACTIVE_PAGE',
                    'value' => 'last',
                    'type' => 'constant',
                ];
            } elseif ($payload['slug'] === 'vcv-getting-started') {
                $variables[] = [
                    'key' => 'VCV_ACTIVATION_SLIDES',
                    'value' => [
                        [
                            'url' => esc_js('https://cdn.hub.visualcomposer.com/plugin-assets/slideshow-01.png'),
                            'title' => __(
                                'Build your site with the help of the drag and drop builder straight from the frontend editor - it\'s that easy.',
                                'visualcomposer'
                            ),
                        ],
                        [
                            'url' => esc_js('https://cdn.hub.visualcomposer.com/plugin-assets/slideshow-02.png'),
                            'title' => esc_js(
                                __(
                                    'Get more elements and templates from the Visual Composer Hub - a free online marketplace.',
                                    'visualcomposer'
                                )
                            ),
                        ],
                        [
                            'url' => esc_js('https://cdn.hub.visualcomposer.com/plugin-assets/slideshow-03.png'),
                            'title' => esc_js(
                                __(
                                    'Next level website performance to rank higher and deliver faster.',
                                    'visualcomposer'
                                )
                            ),
                        ],
                        [
                            'url' => esc_js('https://cdn.hub.visualcomposer.com/plugin-assets/slideshow-04.png'),
                            'title' => esc_js(
                                __(
                                    'Control every detail of your website with flexible design options and customization tools.',
                                    'visualcomposer'
                                )
                            ),
                        ],
                    ],
                    'type' => 'constant',
                ];
            }
        }

        return $variables;
    }
}
