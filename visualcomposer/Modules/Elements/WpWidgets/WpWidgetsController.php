<?php

namespace VisualComposer\Modules\Elements\WpWidgets;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\WpWidgets;

/**
 * Class WpWidgetsController
 * @package VisualComposer\Modules\Elements\WpWidgets
 */
class WpWidgetsController extends Container implements Module
{
    use EventsFilters;

    /**
     * WpWidgetsController constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Elements\WpWidgets\WpWidgetsController::generateElements */
        //        $featureToggle = false;
        //        if ($featureToggle) {
        //            // TODO: Feature toggle.
        //            $this->addFilter('vcv:frontend:extraOutput', 'generateElements');
        //        }
        $this->addFilter('vcv:frontend:extraOutput', 'addGlobalVariables');
        /** @see \VisualComposer\Modules\Elements\WpWidgets\WpWidgetsController::render */
        $this->addFilter('vcv:ajax:elements:widget:adminNonce', 'renderEditor');

        /** @see \VisualComposer\Modules\Elements\WpWidgets\WpWidgetsController::renderForm */
        $this->addFilter('vcv:ajaxForm:render:response', 'renderForm');
        $this->addFilter('vcv:elements:widgets:defaultKey', 'defaultKey');
    }

    /**
     * @param $scripts
     * @param $payload
     * @param \VisualComposer\Helpers\WpWidgets $widgetsHelper
     *
     * @return array
     */
    protected function addGlobalVariables($scripts, $payload, WpWidgets $widgetsHelper)
    {
        /** @see visualcomposer/resources/views/elements/widgets/variables.php */
        $variables = [];
        $variables[] = sprintf('<script>%s</script>', vcview('elements/widgets/variables'));

        return array_merge($scripts, $variables);
    }

    /**
     * @param $scripts
     * @param $payload
     * @param \VisualComposer\Helpers\WpWidgets $widgetsHelper
     *
     * @return array
     */
    protected function generateElements($scripts, $payload, WpWidgets $widgetsHelper)
    {
        // WARN: Disabled Currently
        // TODO: Remove later if not needed
        /** @see visualcomposer/resources/views/elements/widgets/element.php */
        $widgetScripts = [];
        $widgetScripts[] = sprintf(
            '<script src="%s"></script>',
            $widgetsHelper->getWidgetsUrl()
        );

        return array_merge($scripts, $widgetScripts);
    }

    /**
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\WpWidgets $widgets
     *
     * @return string
     */
    protected function renderEditor($response, $payload, Request $requestHelper, WpWidgets $widgets)
    {
        if (!is_array($response)) {
            $response = [];
        }
        $widgetKey = $requestHelper->input('vcv-widget-key');
        if (!$widgetKey) {
            $widgetKey = vcfilter('vcv:elements:widgets:defaultKey', $requestHelper->input('vcv-element-tag'));
        }
        $args = $requestHelper->input('vcv-atts');
        $instance = $requestHelper->input('vcv-widget-value');

        if (isset($instance['widget-form'])) {
            $instance = $instance['widget-form'][1];
        }

        $response['status'] = true;
        $response['shortcodeContent'] = $widgets->render($widgetKey, $args, $instance);
        $response['shortcode'] = $widgets->getShortcode(
            $requestHelper->input('vcv-element-tag'),
            $requestHelper->input('vcv-widget-key'),
            rawurlencode(json_encode($requestHelper->input('vcv-widget-value'))),
            rawurlencode(json_encode($requestHelper->input('vcv-atts')))
        );

        return $response;
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
            if (!$widgetKey) {
                $widgetKey = vcfilter('vcv:elements:widgets:defaultKey', $tag);
            }
            $form = $widgets->form($widgetKey, $instance);
            // Remove last col from labels
            $form = preg_replace('/(\:)\s*(<\/label>|<input)/', '$2', $form);
            $response['html'] = $form;
        }

        return $response;
    }

    protected function defaultKey($tag, $payload, WpWidgets $widgetsHelper)
    {
        $all = $widgetsHelper->allGrouped();

        return get_class(reset($all[ $tag ]));
    }
}
