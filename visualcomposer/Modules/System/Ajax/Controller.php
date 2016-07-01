<?php
namespace VisualComposer\Modules\System\Ajax;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Nonce;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Str;
use VisualComposer\Helpers\Traits\EventsFilters;

class Controller extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\System\Ajax\Controller::listenAjax */
        $this->addEvent(
            'vcv:inited',
            'listenAjax'
        );
    }

    public function getResponse($requestAction)
    {
        $response = vcfilter('vcv:ajax', '');
        $response = vcfilter('vcv:ajax:' . $requestAction, $response);

        return $response;
    }

    public function renderResponse($response)
    {
        if (is_string($response)) {
            return $response;
        }

        return json_encode($response);
    }

    private function listenAjax(Request $requestHelper)
    {
        if ($requestHelper->exists(VCV_AJAX_REQUEST)) {
            define('VCV_AJAX_REQUEST_CALL', true);
            /** @see \VisualComposer\Modules\System\Ajax\Controller::parseRequest */
            $response = $this->call('parseRequest');
            $output = $this->renderResponse($response);
            die($output);
        }
    }

    private function parseRequest(Request $requestHelper)
    {
        // Require an action parameter.
        if (!$requestHelper->exists('vcv-action')) {
            return false;
        }
        $requestAction = $requestHelper->input('vcv-action');
        /** @see \VisualComposer\Modules\System\Ajax\Controller::validateNonce */
        $validateNonce = $this->call('validateNonce', [$requestAction]);
        if ($validateNonce) {
            /** @see \VisualComposer\Modules\System\Ajax\Controller::getResponse */
            return $this->call('getResponse', [$requestAction]);
        }

        return false;
    }

    private function validateNonce($requestAction, Request $requestHelper, Str $strHelper, Nonce $nonceHelper)
    {
        if ($strHelper->contains($requestAction, ':nonce')
            && !$nonceHelper->verifyUser(
                $requestHelper->input('vcv-nonce')
            )
        ) {
            return false;
        } elseif ($strHelper->contains($requestAction, ':adminNonce')
            && !$nonceHelper->verifyAdmin(
                $requestHelper->input('vcv-nonce')
            )
        ) {
            return false;
        }

        return true;
    }
}
