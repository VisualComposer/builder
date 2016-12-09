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
        $featureToggle = false;
        if ($featureToggle) {
            // TODO: Feature toggle.
            $this->addFilter('vcv:frontend:extraOutput', 'generateElements');
        }

        /** @see \VisualComposer\Modules\Elements\WpWidgets\WpWidgetsController::render */
        $this->addFilter('vcv:ajax:elements:widget:adminNonce', 'renderEditor');
        /** @see \VisualComposer\Modules\Elements\WpWidgets\WpWidgetsController::clean */
        $this->addFilter('vcv:ajax:elements:widget:clean:adminNonce', 'renderShortcode');

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
            $this->call([$widgetsHelper, 'getWidgetsUrl'])
        );

        return array_merge($scripts, $widgetScripts);
    }

    /**
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\WpWidgets $widgets
     *
     * @return string
     */
    protected function renderEditor(Request $requestHelper, WpWidgets $widgets)
    {
        // TODO: Finish it.
        return 'Hi From render';
    }

    /**
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\WpWidgets $widgets
     *
     * @return string
     */
    protected function renderForm(Request $requestHelper, WpWidgets $widgets, $response, $payload)
    {
        if ($payload['action'] === 'vcv:wpWidgets:form') {
            $data = $payload['data'];
            $value = $payload['value'];
            $widget = $data['widgetKey'];

            ob_start();
            $widget = $widgets->get($widget);
            $form = '';
            if (is_object($widget)) {
                $widget->number = 1; //
                $widget->id_base = 'form'; // Encode input name strictly
                $noform = $widget->form($value);
                $form = ob_get_clean();
                // In case If Widget doesn't have settings
                if ($noform === 'noform') {
                    $form = '';
                }
            }
            $response['html'] = $form;
        }

        return $response;
    }

    /**
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @return string
     */
    protected function renderShortcode(Request $requestHelper)
    {
        return sprintf(
            '[vcv_widgets key="%s" value="%s"]',
            $requestHelper->input('vcv-widget-key'),
            rawurlencode(json_encode($requestHelper->input('vcv-atts')))
        );
    }
}
