<?php

namespace VisualComposer\Modules\System\Ajax;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Logger;
use VisualComposer\Helpers\Nonce;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Str;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\PostType;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class Controller extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    protected $scope = 'ajax';

    public function __construct()
    {
        /** @see \VisualComposer\Modules\System\Ajax\Controller::listenAjax */
        $this->addEvent(
            'vcv:inited',
            'listenAjax',
            100
        );
        /** @see \VisualComposer\Modules\System\Ajax\Controller::listenAjax */
        $this->wpAddAction(
            'vcv:boot',
            'disableAjaxErrors',
            10
        );
        /** @see \VisualComposer\Modules\System\Ajax\Controller::listenAjax */
        $this->wpAddAction(
            'wp_loaded',
            'listenLateAjax',
            100
        );
    }

    protected function getResponse($requestAction)
    {
        $requestHelper = vchelper('Request');
        global $post;
        if (empty($post) && $requestHelper->exists('vcv-source-id') && $requestHelper->input('vcv-source-id')
            && $requestHelper->input('vcv-source-id') !== 'template') {
            return '';
        }

        $response = vcfilter(
            'vcv:' . $this->scope . ':' . $requestAction,
            '',
            [
                'sourceId' => $post ? $post->ID : $requestHelper->input('vcv-source-id'),
            ]
        );

        return $response;
    }

    protected function renderResponse($response)
    {
        if (is_string($response)) {
            return $response;
        } elseif ($response === false) {
            return json_encode(['status' => false]);
        }

        return json_encode($response);
    }

    protected function disableAjaxErrors(Request $requestHelper)
    {
        if ($requestHelper->isAjax()) {
            if (!vcvenv('VCV_DEBUG')) {
                ini_set('display_errors', 'Off');
                ini_set('error_reporting', 0);
                error_reporting(0);
            }
        }
    }

    protected function listenAjax(Request $requestHelper)
    {
        if ($requestHelper->isAjax() && !$requestHelper->exists('vcv-late-request')) {
            $this->setGlobals();
            /** @see \VisualComposer\Modules\System\Ajax\Controller::parseRequest */
            $rawResponse = $this->call('parseRequest');
            $output = $this->renderResponse($rawResponse);
            $this->output($output, $rawResponse);
        }
    }

    protected function listenLateAjax(Request $requestHelper)
    {
        if ($requestHelper->isAjax() && $requestHelper->exists('vcv-late-request')) {
            $this->setGlobals();
            /** @see \VisualComposer\Modules\System\Ajax\Controller::parseRequest */
            $rawResponse = $this->call('parseRequest');
            $output = $this->renderResponse($rawResponse);
            $this->output($output, $rawResponse);
        }
    }

    protected function setGlobals()
    {
        if (!defined('VCV_AJAX_REQUEST_CALL')) {
            define('VCV_AJAX_REQUEST_CALL', true);
        }
        if (!defined('DOING_AJAX')) {
            define('DOING_AJAX', true);
        }
    }

    /**
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\PostType $postTypeHelper
     */
    protected function setSource(Request $requestHelper, PostType $postTypeHelper)
    {
        if ($requestHelper->exists('vcv-source-id')) {
            $postTypeHelper->setupPost((int)$requestHelper->input('vcv-source-id'));
        }
    }

    protected function output($response, $rawResponse)
    {
        if (vcIsBadResponse($rawResponse)) {
            $loggerHelper = vchelper('Logger');
            $messages = [];
            if ($loggerHelper->all()) {
                $messages[] = $loggerHelper->all();
            }
            if (is_array($rawResponse)) {
                if (isset($rawResponse['body'])) {
                    $messages[] = $rawResponse['body'];
                }
            }
            if (count($messages) > 0) {
                echo json_encode(
                    [
                        'status' => false,
                        'response' => $rawResponse,
                        'message' => implode('. ', array_unique($messages)),
                        'details' => $loggerHelper->details(),
                    ]
                );
                vcvdie(); // DO NOT USE WP_DIE because it can be overwritten by 3rd and cause plugin issues.
            } else {
                echo json_encode(
                    [
                        'status' => false,
                        'response' => $rawResponse,
                        'details' => $loggerHelper->details(),
                    ]
                );
                vcvdie(); // DO NOT USE WP_DIE because it can be overwritten by 3rd and cause plugin issues.
            }
        }

        vcvdie($response); // DO NOT USE WP_DIE because it can be overwritten by 3rd and cause plugin issues.
    }

    protected function parseRequest(Request $requestHelper, Logger $loggerHelper)
    {
        if ($requestHelper->exists('vcv-zip')) {
            $zip = $requestHelper->input('vcv-zip');
            $basedecoded = base64_decode($zip);
            $newAllJson = zlib_decode($basedecoded);
            $newArgs = json_decode($newAllJson, true);
            $all = $requestHelper->all();
            $new = array_merge($all, $newArgs);
            $requestHelper->setData($new);
        }

        // Require an action parameter.
        if (!$requestHelper->exists('vcv-action')) {
            $loggerHelper->log(
                'Action doesn`t set #10074',
                [
                    'request' => $requestHelper->all(),
                ]
            );

            return false;
        }
        $requestAction = $requestHelper->input('vcv-action');
        /** @see \VisualComposer\Modules\System\Ajax\Controller::validateNonce */
        $validateNonce = $this->call('validateNonce', [$requestAction]);
        if ($validateNonce) {
            /** @see \VisualComposer\Modules\System\Ajax\Controller::setSource */
            $this->call('setSource');

            /** @see \VisualComposer\Modules\System\Ajax\Controller::getResponse */
            return $this->call('getResponse', [$requestAction]);
        }

        return false;
    }

    protected function validateNonce(
        $requestAction,
        Request $requestHelper,
        Str $strHelper,
        Nonce $nonceHelper,
        Logger $loggerHelper
    ) {
        if ($strHelper->endsWith(strtolower($requestAction), 'nonce') && !$requestHelper->exists('vcv-nonce')) {
            $loggerHelper->log(
                'Nonce not provided #3001',
                [
                    'request' => $requestHelper->all(),
                ]
            );

            return false;
        }

        $result = true;
        if ($strHelper->contains($requestAction, ':nonce')) {
            $result = $nonceHelper->verifyUser($requestHelper->input('vcv-nonce'));
        } elseif ($strHelper->contains($requestAction, ':adminNonce')) {
            $result = $nonceHelper->verifyAdmin($requestHelper->input('vcv-nonce'));
        }

        if (!$result) {
            $loggerHelper->log(
                'Nonce not validated #3002',
                [
                    'request' => $requestHelper->all(),
                ]
            );
        }

        return $result;
    }
}
