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
        $a = false;
        if ($a) {
            // TODO: Feature toggle.
            $this->addFilter('vcv:frontend:extraOutput', 'generateElements');
        }

        /** @see \VisualComposer\Modules\Elements\WpWidgets\WpWidgetsController::render */
        $this->addFilter('vcv:ajax:elements:widget:adminNonce', 'renderEditor');
        /** @see \VisualComposer\Modules\Elements\WpWidgets\WpWidgetsController::clean */
        $this->addFilter('vcv:ajax:elements:widget:clean:adminNonce', 'renderShortcode');
    }

    /**
     * @param $scripts
     * @param \VisualComposer\Helpers\WpWidgets $widgetsHelper
     *
     * @return array
     */
    protected function generateElements($scripts, WpWidgets $widgetsHelper)
    {
        $widgets = $widgetsHelper->all();
        $widgetScripts = [];
        foreach ($widgets as $widgetKey => $widget) {
            /** @see \VisualComposer\Helpers\WpWidgets::getWidgetUrl */
            $widgetScripts[] = sprintf(
                '<script src="%s"></script>',
                $this->call([$widgetsHelper, 'getWidgetUrl'], [$widgetKey])
            );
        }

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
    protected function renderForm(Request $requestHelper, WpWidgets $widgets)
    {
        $widget = $requestHelper->input('vcv-widget-key');
        $data = $requestHelper->input('vcv-data');

        ob_start();
        $noform = $widgets->get($widget)->form($data);
        $form = ob_get_clean();
        // In case If Widget doesn't have settings
        if ($noform === 'noform') {
            $form = '';
        }

        return $form;
    }

    /**
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @return string
     */
    protected function renderShortcode(Request $requestHelper)
    {
        return sprintf('[vcv_widgets key="%s"]', $requestHelper->input('vcv-widget-key'));
    }
}
