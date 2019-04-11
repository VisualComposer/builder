<?php

namespace VisualComposer\Modules\Elements\WpWidgets;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Access\CurrentUser;
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
        $this->addFilter('vcv:frontend:head:extraOutput', 'addGlobalVariables');
        /** @see \VisualComposer\Modules\Elements\WpWidgets\WpWidgetsController::render */
        $this->addFilter('vcv:ajax:elements:widget:adminNonce', 'renderEditor');

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
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\WpWidgets $widgets
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserAccessHelper
     *
     * @return array
     */
    protected function renderEditor(
        $response,
        $payload,
        Request $requestHelper,
        WpWidgets $widgets,
        CurrentUser $currentUserAccessHelper
    ) {
        $sourceId = (int)$requestHelper->input('vcv-source-id');
        if ($sourceId && $currentUserAccessHelper->wpAll(['edit_posts', $sourceId])->get()) {
            if (!is_array($response)) {
                $response = [];
            }
            $widgetKey = $requestHelper->input('vcv-widget-key');
            if (!$widgetKey) {
                $widgetKey = $widgets->defaultKey($requestHelper->input('vcv-element-tag'));
            }
            // If still not key return!
            if (!$widgetKey) {
                return $response;
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
                urlencode($requestHelper->input('vcv-widget-key')),
                rawurlencode(json_encode($requestHelper->input('vcv-widget-value'))),
                rawurlencode(json_encode($requestHelper->input('vcv-atts')))
            );
        }

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
                $widgetKey = $widgets->defaultKey($tag);
            }
            if (!$widgetKey) {
                return $response;
            }
            $form = $widgets->form($widgetKey, $instance);
            // Remove last col from labels
            $form = preg_replace('/(\:)\s*(<\/label>|<input)/', '$2', $form);
            $response['html'] = $form;
        }

        return $response;
    }
}
