<?php

namespace VisualComposer\Modules\Elements\WpWidgets;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\WpWidgets;

/**
 * Class WpWidgetsController
 * @package VisualComposer\Modules\Elements\WpWidgets
 */
class WpWidgetsController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    /**
     * WpWidgetsController constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Elements\WpWidgets\WpWidgetsController::addGlobalVariables */
        $this->addFilter('vcv:frontend:head:extraOutput', 'addGlobalVariables');

        /** @see \VisualComposer\Modules\Elements\WpWidgets\WpWidgetsController::renderForm */
        $this->addFilter('vcv:ajaxForm:render:response', 'renderForm');
    }

    /**
     * @param $scripts
     * @param $payload
     *
     * @return array
     */
    protected function addGlobalVariables($scripts, $payload)
    {
        /** @see visualcomposer/resources/views/elements/widgets/variables.php */
        $variables = [];
        $variables[] = sprintf('<script>%s</script>', vcview('elements/widgets/variables'));

        return array_merge($scripts, $variables);
    }

    /**
     * @param \VisualComposer\Helpers\WpWidgets $widgets
     *
     * @param $response
     * @param $payload
     *
     * @return string
     */
    protected function renderForm($response, $payload, WpWidgets $widgets)
    {
        if ($payload['action'] === 'vcv:wpWidgets:form') {
            $element = $payload['element'];
            $widgetKey = $element['widgetKey'];
            $tag = $element['tag'];
            $instance = $payload['value'];
            if (isset($instance['widget-form'])) {
                $instance = $instance['widget-form'][1];
            }
            if (isset($instance['widget-rss'])) {
                $instance = $instance['widget-rss'][1];
            }
            if (!$widgetKey) {
                $widgetKey = $widgets->defaultKey($tag);
            }
            if (!$widgetKey) {
                return $response;
            }
            $form = $widgets->form($widgetKey, $instance);
            // Remove last col from labels
            $form = preg_replace('/(\:)\s*(<\/label>|<input)/', '$2', $form);
            $response['html'] = vcfilter(
                'vcv:api:widgets:response',
                $form,
                [
                    'key' => $widgetKey,
                    'payload' => $payload,
                ]
            );
        }

        return $response;
    }
}
