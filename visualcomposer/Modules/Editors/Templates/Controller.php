<?php

namespace VisualComposer\Modules\Editors\Templates;

use VisualComposer\Helpers\Filters;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Options;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class Controller.
 */
class Controller extends Container implements Module
{
    use EventsFilters;

    /**
     * @var \VisualComposer\Helpers\Options
     */
    protected $options;

    public function __construct(Options $optionsHelper)
    {
        $this->options = $optionsHelper;
        /** @see \VisualComposer\Modules\Editors\DataAjax\Controller::getData */
        $this->addFilter(
            'vcv:ajax:getData:adminNonce',
            'getMyTemplates'
        );

        /** @see \VisualComposer\Modules\Editors\DataAjax\Controller::setMyTemplates */
        $this->addFilter(
            'vcv:ajax:setData:adminNonce',
            'setMyTemplates'
        );
    }

    /**
     * Get post content.
     *
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @param $response
     *
     * @return mixed|string
     */
    private function getMyTemplates(Request $requestHelper, $response)
    {
        $myTemplates = $this->options->get('myTemplates', '');
        if (strlen($myTemplates) > 0) {
            $response['myTemplates'] = $myTemplates;
        }

        return $response;
    }

    /**
     * Save my templates.
     *
     * @param \VisualComposer\Helpers\Filters $filterHelper
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @return array|null
     */
    private function setMyTemplates(Filters $filterHelper, Request $requestHelper)
    {

        $myTemplates = $requestHelper->input('vcv-my-templates');
        $this->options->set('myTemplates', $myTemplates);

        return [
            'status' => true,
        ];
    }
}
