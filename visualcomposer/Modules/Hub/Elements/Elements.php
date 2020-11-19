<?php

namespace VisualComposer\Modules\Hub\Elements;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Hub\Elements as HubElements;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class Elements
 * @package VisualComposer\Modules\Hub\Elements
 */
class Elements extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    /**
     * @var
     */
    protected $elements;

    /**
     * Elements constructor.
     */
    public function __construct()
    {
        $this->addFilter(
            'vcv:frontend:head:extraOutput vcv:update:extraOutput',
            'outputWebpackBc'
        );
        $this->addFilter('vcv:frontend:footer:extraOutput', 'outputElementsBundle', 15); // more than addons
        $this->addFilter('vcv:editor:variables vcv:wp:dashboard:variables', 'addVariables');
    }

    /**
     * Backward compatibility for webpack 1v
     *
     * @param $response
     * @param $payload
     *
     * @return array
     */
    protected function outputWebpackBc($response, $payload)
    {
        // BC for Webpack v1
        $response = array_merge(
            $response,
            [
                <<<SCRIPT
    <script>
    (function() {
        var index = 0 // Just to be unique
        window["vcvWebpackJsonp"] = function vcvWebpackJsonp(chunkIds, moreModules) {
            var keys = Object.keys(moreModules)
            index++
            moreModules[keys[1] + '-' + index] = moreModules[0]
            moreModules[0] = undefined
            delete moreModules[0] // To avoid overriding for modules[key]
            var data = [
                [keys[1] + '-' + index], /** chunkId **/
                moreModules, /** moreModules **/
                [[keys[1] + '-' + index]] /** execute module **/
            ]

            return (window["vcvWebpackJsonp4x"] = window["vcvWebpackJsonp4x"] || []).push(data)
        };
    })()
   </script>
SCRIPT
                ,
            ]
        );

        return $response;
    }

    /**
     * @param $variables
     * @param $payload
     * @param HubElements $hubHelper
     *
     * @return array
     */
    protected function addVariables($variables, $payload, HubElements $hubHelper)
    {
        if (isset($payload['slug']) && in_array($payload['slug'], ['vcv-update', 'vcv-update-fe'], true)) {
            // In case if loaded for post-update actions
            return $variables;
        }

        $variables[] = [
            'key' => 'VCV_HUB_GET_ELEMENTS',
            'value' => $hubHelper->getElements(false, false),
            'type' => 'constant',
        ];

        return $variables;
    }

    /**
     * @param $response
     * @param $payload
     * @param HubElements $hubHelper
     *
     * @return array
     */
    protected function outputElementsBundle($response, $payload, HubElements $hubHelper)
    {
        return array_merge(
            $response,
            [
                vcview(
                    'hub/elementsBundle',
                    [
                        'elements' => $hubHelper->getElements(),
                    ]
                ),
            ]
        );
    }
}
