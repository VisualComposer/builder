<?php

namespace VisualComposer\Modules\System\AdminAjax;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

//use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\System\Ajax\Controller as AjaxController;

class Controller extends AjaxController/* implements Module*/
{
    use WpFiltersActions;

    protected $scope = 'adminAjax';

    public function __construct()
    {
        /** @see \VisualComposer\Modules\System\AdminAjax\Controller::listenAjax */
        $this->wpAddAction(
            'wp_ajax_vcv:ajax',
            'listenAjax',
            100
        );
    }

    protected function listenAjax(Request $requestHelper)
    {
        $this->setGlobals();
        /** @see \VisualComposer\Modules\System\AdminAjax\Controller::parseRequest */
        $response = $this->call('parseRequest');
        $output = $this->renderResponse($response);
        $this->output($output);
    }

    protected function setGlobals()
    {
        if (!defined('VCV_ADMIN_AJAX_REQUEST_CALL')) {
            define('VCV_ADMIN_AJAX_REQUEST_CALL', true);
        }
    }
}
