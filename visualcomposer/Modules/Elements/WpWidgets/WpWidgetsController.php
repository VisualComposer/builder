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
        $featureToggle = true;
        if ($featureToggle) {
            // TODO: Feature toggle.
            $this->addFilter('vcv:frontend:extraOutput', 'generateElements');
        }

        /** @see \VisualComposer\Modules\Elements\WpWidgets\WpWidgetsController::render */
        $this->addFilter('vcv:ajax:elements:widget:adminNonce', 'renderEditor');

        /** @see \VisualComposer\Modules\Elements\WpWidgets\WpWidgetsController::renderForm */
        $this->addFilter('vcv:ajaxForm:render:response', 'renderForm');
    }

    /**
     * @param $scripts
     * @param \VisualComposer\Helpers\WpWidgets $widgetsHelper
     *
     * @return array
     */
    protected function generateElements($scripts, WpWidgets $widgetsHelper)
    {
        $widgetScripts = [];
        $widgetScripts[] = sprintf(
            '<script src="%s"></script>',
            $widgetsHelper->getWidgetsUrl()
        );

        return array_merge($scripts, $widgetScripts);
    }

    /**
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\WpWidgets $widgets
     *
     * @return string
     */
    protected function renderEditor($response, Request $requestHelper, WpWidgets $widgets)
    {
        if (!is_array($response)) {
            $response = [];
        }
        $widgetKey = $requestHelper->input('vcv-widget-key');
        $args = $requestHelper->input('vcv-atts');
        $instance = $requestHelper->input('vcv-widget-value');

        if (isset($instance['widget-form'])) {
            $instance = $instance['widget-form'][1];
        }

        $response['status'] = true;
        $response['shortcodeContent'] = $widgets->render($widgetKey, $args, $instance);
        /** @see \VisualComposer\Modules\Elements\WpWidgets\WpWidgetsController::getShortcode */
        $response['shortcode'] = $this->call('getShortcode');

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
    protected function renderForm(WpWidgets $widgets, $response, $payload)
    {
        if ($payload['action'] === 'vcv:wpWidgets:form') {
            $element = $payload['element'];
            $widgetKey = $element['widgetKey'];
            $instance = $payload['value'];
            if (isset($instance['widget-form'])) {
                $instance = $instance['widget-form'][1];
            }

            $form = $widgets->form($widgetKey, $instance);
            // Remove last col from labels
            $form = preg_replace('/(\:)\s*(<\/label>|<input)/', '$2', $form);
            $response['html'] = $form;
        }

        return $response;
    }

    /**
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @return string
     */
    protected function getShortcode(Request $requestHelper)
    {
        return sprintf(
            '[vcv_widgets key="%s" instance="%s" args="%s"]',
            $requestHelper->input('vcv-widget-key'),
            rawurlencode(json_encode($requestHelper->input('vcv-widget-value'))),
            rawurlencode(json_encode($requestHelper->input('vcv-atts')))
        );
    }
}
