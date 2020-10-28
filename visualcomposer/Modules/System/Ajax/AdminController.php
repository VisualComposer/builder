<?php

namespace VisualComposer\Modules\System\Ajax;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class AdminController extends Controller implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    protected $scope = 'ajax';

    /** @noinspection PhpMissingParentCallCommonInspection */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\System\Ajax\Controller::listenAjax */
        $this->wpAddAction(
            'wp_ajax_vcv:admin:ajax',
            'listenAjax',
            100
        );
        $this->wpAddAction(
            'wp_ajax_vcv-admin-ajax',
            'listenAjax',
            100
        );
        /** @see \VisualComposer\Modules\System\Ajax\AdminController::disableAjaxErrors */
        $this->wpAddAction(
            'vcv:boot',
            'disableAjaxErrors',
            10
        );
    }

    protected function listenAjax(Request $requestHelper)
    {
        if ($requestHelper->exists(VCV_ADMIN_AJAX_REQUEST)) {
            $this->setGlobals();
            /** @see \VisualComposer\Modules\System\Ajax\Controller::parseRequest */
            $rawResponse = $this->call('parseRequest');
            $output = $this->renderResponse($rawResponse);
            $this->output($output, $rawResponse);
        }
    }

    protected function disableAjaxErrors(Request $requestHelper)
    {
        if ($requestHelper->exists(VCV_ADMIN_AJAX_REQUEST)) {
            // Silence required to avoid warnings in case if function is restricted
            // @codingStandardsIgnoreStart
            @set_time_limit(120);
            if (!vcvenv('VCV_DEBUG')) {
                @ini_set('display_errors', 'Off');
                @ini_set('error_reporting', 0);
                @error_reporting(0);
            }
            // @codingStandardsIgnoreEnd
        }
    }
}
