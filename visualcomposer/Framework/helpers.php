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
 * @param bool $haltable
 *
 * @return array|null
 */
function vcfilter($filter, $body = '', $payload = [], $haltable = false)
{
    /** @see \VisualComposer\Framework\Illuminate\Filters\Dispatcher::fire */
    return vchelper('Filters')->fire($filter, $body, $payload, $haltable);
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
        return VcvEnv::get($key, $default);
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

/**
 * @internal
 *
 * @param $code
 *
 * @return string
 */
function vcLogWpHttpCodes($code)
{
    $message = '';
    switch ($code) {
        case 'http_no_url':
            $message = __(
                'An error occurred while retrieving the download URL for Visual Composer extensions. Please deactivate other plugins, re-install Visual Composer and try again.',
                'vcwb'
            );
            break;
        case 'http_no_file':
            $message = __(
                'An error occurred when creating temporary installation files. Please verify that WP_TEMP_DIR exists and is writable.',
                'vcwb'
            );
            break;
        case 'http_404':
            $message = __(
                'An error occurred during the Visual Composer extension download process. 
<ul><li>- Check if your server has a connection to the Internet</li><li>- Check your server proxy configuration settings</li><li>- Check your server firewall settings and access to https://account.visualcomposer.io</li><li>- Check if your server has access to the <a href="https://s3-us-west-2.amazonaws.com/updates.wpbakery.com/vcwb-teasers/youtubePlayer.3307569.1518529200.youtube-player-preview.jpg" target="_blank">Amazon AWS</a></li></ul>',
                'vcwb'
            );
            break;
        case 'http_request_failed':
            $message = __(
                'An HTTP requests failed during the download process of the plugin.
<ul><li>- Check if your server has a connection to the Internet</li><li>- Check your server proxy configuration settings</li><li>- Check your server firewall settings and access to <a href="https://account.visualcomposer.io" target="_blank">https://account.visualcomposer.io</a></li><li>- Check if your server has access to the <a href="https://s3-us-west-2.amazonaws.com/updates.wpbakery.com/vcwb-teasers/youtubePlayer.3307569.1518529200.youtube-player-preview.jpg" target="_blank">Amazon AWS</a></li></ul>',
                'vcwb'
            );
            break;
    }

    return $message;
}

/**
 * @internal
 *
 * @param $code
 * @param $errorMessage
 *
 * @return bool
 */
function vcLogWpErrorByCode($code, $errorMessage)
{
    $message = vcLogWpHttpCodes($code);
    switch ($code) {
        case 'fs_unavailable':
            $message = __(
                'An error occurred when extracting Visual Composer extension files. Visual Composer requires a direct access to the file system of your server. Check if FS_METHOD is defined in wp-config.php and disable it.',
                'vcwb'
            );
            break;
        case 'incompatible_archive':
        case 'stat_failed_ziparchive':
            $message = __(
                'A zip file of Visual Composer extension is broken. Please check your Internet connection, run Reset in Visual Composer Settings and try again.',
                'vcwb'
            );
            break;
        case 'disk_full_unzip_file':
            $message = __(
                'We could not copy files to your server. It seems that you have run out of the disk space. Please increase your server disk space and try again.',
                'vcwb'
            );
            break;
        case 'mkdir_failed_ziparchive':
        case 'mkdir_failed_copy_dir':
            $message = __(
                'We could not create a directory for the plugin in wp-content/uploads. Please check if your server has write permissions for wp-content/uploads.',
                'vcwb'
            );
            break;
        case 'copy_failed_ziparchive':
            $message = __(
                'We could not copy a directory for the plugin in wp-content/uploads. Please check if your server has write permissions for wp-content/uploads.',
                'vcwb'
            );
            break;
        case 'copy_failed_copy_dir':
            $message = __(
                'We could not copy a directory for the plugin in wp-content/uploads. Please check if your server has write permissions for wp-content/uploads.',
                'vcwb'
            );
            break;
    }
    if (!empty($message)) {
        $message .= PHP_EOL
            . '<span class="vcv-error-screen-text-default">You may need to contact your hosting provider for assistance. If the problem still occurs, visit <a href="https://support.visualcomposer.io/" target="_blank">support.visualcomposer.io</a> for technical assistance</span>';
    }
    $message .= PHP_EOL . sprintf(__('WordPress Error: %s', 'vcwb'), $errorMessage);
    vchelper('Logger')->log($message);

    return true;
}

function vcIsBadResponse($response)
{
    $isWpError = is_wp_error($response);
    if ($isWpError) {
        /** @var \WP_Error $response */
        foreach ($response->errors as $code => $messages) {
            vcLogWpErrorByCode($code, implode('. ', $messages));
        }

        return true;
    }

    $isResponseBad = false;
    if (is_array($response)) {
        $isResponseBad = _vcCheckIsResponseBad($response);
    }

    return !$response || $response === 'false' || $isResponseBad;
}

/**
 * @internal
 *
 * @param $response
 *
 * @return bool
 */
function _vcCheckIsResponseBad($response)
{
    $loggerHelper = vchelper('Logger');
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

    return false;
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
