<?php

use VisualComposer\Framework\Illuminate\Container\Container as FrameworkContainer;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/**
 * Get the available container instance.
 *
 * @param  string $make
 * @param  array $parameters
 *
 * @return mixed
 * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
 */
function vcapp($make = null, $parameters = [])
{
    if (is_null($make)) {
        return FrameworkContainer::getInstance();
    }

    return FrameworkContainer::getInstance()->make($make, $parameters);
}

function vcapi()
{
    return vcapp('ApiFactory');
}

/**
 * Get the available container instance.
 *
 * @param  string $name
 * @param  array $parameters
 *
 * @return mixed
 */
function vchelper($name, $parameters = [])
{
    return vcapp($name . 'Helper', $parameters);
}

/**
 * Fire an event and call the listeners.
 *
 * @param  string $event
 * @param  mixed $payload
 *
 * @return array|null
 */
function vcevent($event, $payload = [])
{
    /** @see \VisualComposer\Framework\Illuminate\Events\Dispatcher::fire */
    return vchelper('Events')->fire($event, $payload);
}

/**
 * Fire an event and call the listeners.
 *
 * @param  string $filter
 * @param  string $body
 * @param  mixed $payload
 *
 * @return array|null
 */
function vcfilter($filter, $body = '', $payload = [])
{
    /** @see \VisualComposer\Framework\Illuminate\Filters\Dispatcher::fire */
    return vchelper('Filters')->fire($filter, $body, $payload);
}

/**
 * @param $path
 * @param array $args
 *
 * @return mixed|string
 */
function vcview($path, $args = [])
{
    /** @see \VisualComposer\Helpers\Views::render */
    return vchelper('Views')->render($path, $args);
}

/**
 * @param $path
 * @param array $args
 */
function evcview($path, $args = [])
{
    // @codingStandardsIgnoreLine
    echo vcview($path, $args);
}

/**
 * @param $path
 * @param array $args
 *
 * @return mixed|string
 */
function vcelementview($path, $args = [])
{
    /** @see \VisualComposer\Helpers\ElementViews::render */
    return vchelper('ElementViews')->render($path, $args);
}

/**
 * @param $path
 * @param array $args
 *
 * @return mixed|string
 */
function vcaddonview($path, $args = [])
{
    /** @see \VisualComposer\Helpers\AddonViews::render */
    return vchelper('AddonViews')->render($path, $args);
}

if (!function_exists('vcvenv')) {
    /**
     * Gets the value of an environment variable. Supports boolean, empty and null.
     *
     * @param  string $key
     * @param  mixed $default
     *
     * @return mixed
     */
    function vcvenv($key, $default = null)
    {
        $value = defined($key) ? constant($key) : $default;

        return $value;
    }
}

/**
 * @return mixed|\VisualComposer\Application
 */
function vcvboot()
{
    require_once VCV_PLUGIN_DIR_PATH . 'bootstrap/app.php';

    return vcapp();
}

function vcvinit()
{
    require_once VCV_PLUGIN_DIR_PATH . 'bootstrap/app.php';
    vcapp()->init();
}

function vcvadmininit()
{
    require_once VCV_PLUGIN_DIR_PATH . 'bootstrap/app.php';
    vcapp()->adminInit();
}

function vcIsBadResponse($response)
{
    $loggerHelper = vchelper('Logger');
    $isWpError = is_wp_error($response);
    if ($isWpError) {
        /** @var \WP_Error $response */
        $loggerHelper->log(
            implode('. ', $response->get_error_messages()),
            [
                'codes' => $response->get_error_codes(),
            ]
        );

        return true;
    }

    if (is_array($response)) {
        if (isset($response['body'])) {
            $body = $response['body'];
            // Check that body is correct JSON
            if (is_string($body)) {
                // @codingStandardsIgnoreLine
                $arr = @json_decode($body, true);
                $isBodyErr = (is_array($arr) && isset($arr['status']) && !$arr['status']) || !is_array($arr);

                if ($isBodyErr) {
                    // Wrong JSON response
                    $loggerHelper->log(
                        __('Wrong response body received.', 'vcwb'),
                        [
                            'body' => $body,
                        ]
                    );

                    return true;
                }
            } else {
                $isBodyErr = isset($body['status']) && !$body['status'];

                if ($isBodyErr) {
                    // Wrong Response status
                    $additionalMessage = isset($body['message']) ? ' ' . $body['message'] : '';
                    $message = __('Bad status code received.', 'vcwb') . $additionalMessage;
                    $loggerHelper->log(
                        $message,
                        [
                            'body' => $body,
                        ]
                    );

                    return true;
                }
            }
            if (isset($response['response'])) {
                // Remote Request check
                $responseCode = wp_remote_retrieve_response_code($response);
                $isRequestError = $responseCode !== 200;
                if ($isRequestError) {
                    $message = sprintf(__('Bad response status code %d received.', 'vcwb'), $responseCode);
                    $loggerHelper->log(
                        $message,
                        [
                            'body' => $response['body'],
                            'response' => $response['response'],
                        ]
                    );

                    return true;
                }
            }
        }
        $isFilterError = isset($response['status']) && !$response['status'];
        if ($isFilterError) {
            $additionalMessage = isset($response['message']) ? ' ' . $response['message'] : '';
            $message = __('Failed to process action.', 'vcwb') . $additionalMessage;
            $loggerHelper->log(
                $message,
                [
                    '$response' => $response,
                ]
            );

            return true;
        }
    }

    return !$response || $response === 'false';
}

/**
 * @param string $message
 *
 * @throws \Exception
 */
function vcvdie($message = '')
{
    // @codingStandardsIgnoreLine
    echo is_string($message) ? $message : json_encode($message);
    if (defined('VCV_DIE_EXCEPTION') && VCV_DIE_EXCEPTION) {
        throw new \Exception($message);
    } else {
        die;
    }
}
