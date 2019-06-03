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
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\EventsFilters;

class UpdateVariablesController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:editor:variables', 'addVariables');
//        $this->addFilter('vcv:editor:variables', 'addVariables');
    }

    protected function addVariables($variables, $payload, Update $updateHelper, Token $tokenHelper)
    {
        $variables = array_merge($variables, $updateHelper->getVariables());
        if (isset($payload['slug']) && $payload['slug'] === 'vcv-about') {
            $variables[] = [
                'key' => 'VCV_ACTIVE_PAGE',
                'value' => 'last',
                'type' => 'constant',
            ];
        } elseif (isset($payload['slug']) && $payload['slug'] === 'vcv-getting-started') {
            $variables[] = [
                'key' => 'VCV_ACTIVATION_SLIDES',
                'value' => [
                    [
                        'url' => esc_js('https://cdn.hub.visualcomposer.com/plugin-assets/slideshow-01.png'),
                        'title' => __(
                            'Build your site with the help of drag and drop editor straight from the frontend - it\'s that easy.',
                            'vcwb'
                        ),
                    ],
                    [
                        'url' => esc_js('https://cdn.hub.visualcomposer.com/plugin-assets/slideshow-02.png'),
                        'title' => esc_js(
                            __(
                                'Get more elements and templates from the Visual Composer Hub - a free online marketplace.',
                                'vcwb'
                            )
                        ),
                    ],
                    [
                        'url' => esc_js('https://cdn.hub.visualcomposer.com/plugin-assets/slideshow-03.png'),
                        'title' => esc_js(
                            __(
                                'Unparallel performance for you and your website to rank higher and deliver faster.',
                                'vcwb'
                            )
                        ),
                    ],
                    [
                        'url' => esc_js('https://cdn.hub.visualcomposer.com/plugin-assets/slideshow-04.png'),
                        'title' => esc_js(
                            __(
                                'Control every detail of your website with flexible design options and customization tools.',
                                'vcwb'
                            )
                        ),
                    ],
                ],
                'type' => 'constant',
            ];

            $variables[] = [
                'key' => 'VCV_IS_ACTIVATED',
                'value' => $tokenHelper->isSiteAuthorized(),
                'type' => 'constant',
            ];
        }

        return $variables;
    }
}
