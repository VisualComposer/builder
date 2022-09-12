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
 * @param string $make
 * @param array $parameters
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

/**
 * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
 */
function vcapi()
{
    return vcapp('ApiFactory');
}

/**
 * Get the available container instance.
 *
 * @param string $name
 * @param array $parameters
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
 * @param string $event
 * @param mixed $payload
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
 * @param string $filter
 * @param string $body
 * @param mixed $payload
 * @param bool $haltable
 *
 * @return mixed
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
 * @return string
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
    $outputHelper = vchelper('Output');

    $outputHelper->printNotEscaped(vcview($path, $args));
}

/**
 * @param $path
 * @param array $args
 *
 * @return string
 * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
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
 * @return string
 * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
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
     * @param string $key
     * @param mixed $default
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
 * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
 */
function vcvboot()
{
    require_once VCV_PLUGIN_DIR_PATH . 'bootstrap/app.php';

    return vcapp();
}

/**
 * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
 */
function vcvinit()
{
    require_once VCV_PLUGIN_DIR_PATH . 'bootstrap/app.php';
    vcapp()->init();
}

/**
 * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
 */
function vcvadmininit()
{
    require_once VCV_PLUGIN_DIR_PATH . 'bootstrap/app.php';
    vcapp()->adminInit();
}

/**
 * @param $code
 *
 * @return string
 * @internal
 *
 */
function vcLogWpHttpCodes($code)
{
    $message = '';
    switch ($code) {
        case 'http_no_url':
            $message = __(
                'An error occurred while retrieving the download URL for Visual Composer extensions. Deactivate other plugins, re-install Visual Composer and try again.',
                'visualcomposer'
            );
            break;
        case 'http_no_file':
            $message = __(
                'An error occurred when creating temporary installation files. Verify that WP_TEMP_DIR exists and is writable.',
                'visualcomposer'
            );
            break;
        case 'http_404':
            $message = __(
                'An error occurred during the Visual Composer extension download process.
<ul><li>- Check if your server has a connection to the Internet.</li><li>- Check if your server proxy has proper configuration settings.</li><li>- Check your server firewall settings and access to https://my.visualcomposer.com</li><li>- Check if your server has access to the <a href="https://cdn.hub.visualcomposer.com/vcwb-teasers/youtubePlayer.3307569.1518529200.youtube-player-preview.jpg" target="_blank" rel="noopener noreferrer">Amazon AWS</a></li></ul>',
                'visualcomposer'
            );
            break;
        case 'http_request_failed':
            $message = __(
                'An HTTP requests failed during the download process of the plugin.
<ul><li>- Check if your server has a connection to the Internet.</li><li>- Check if your server proxy has proper configuration settings.</li><li>- Check your server firewall settings and access to <a href="https://my.visualcomposer.com" target="_blank" rel="noopener noreferrer">https://my.visualcomposer.com</a></li><li>- Check if your server has access to the <a href="https://cdn.hub.visualcomposer.com/vcwb-teasers/youtubePlayer.3307569.1518529200.youtube-player-preview.jpg" target="_blank">Amazon AWS</a></li></ul>',
                'visualcomposer'
            );
            break;
    }

    return $message;
}

/**
 * @param $code
 * @param $errorMessage
 *
 * @return bool
 * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
 * @internal
 *
 */
function vcLogWpErrorByCode($code, $errorMessage)
{
    $message = vcLogWpHttpCodes($code);
    switch ($code) {
        case 'fs_unavailable':
            $message = __(
                'An error occurred when extracting Visual Composer extension files. Visual Composer requires direct access to the file system of your server. Check if FS_METHOD is defined in wp-config.php and disable it.',
                'visualcomposer'
            );
            break;
        case 'incompatible_archive':
        case 'stat_failed_ziparchive':
            $message = __(
                'A .zip file of Visual Composer is broken - the checksum check failed. Check your Internet connection, initiate reset under Visual Composer Settings, and try again.',
                'visualcomposer'
            );
            break;
        case 'disk_full_unzip_file':
            $message = __(
                'We could not copy files to your server. It seems that you have run out of the disk space. Increase your server disk space and try again.',
                'visualcomposer'
            );
            break;
        case 'mkdir_failed_ziparchive':
        case 'mkdir_failed_copy_dir':
            $message = __(
                'We could not create a directory for the plugin in wp-content/uploads. Check if your server has "write" permissions for wp-content/uploads.',
                'visualcomposer'
            );
            break;
        case 'copy_failed_ziparchive':
            $message = __(
                'We could not copy a directory for the plugin in wp-content/uploads. Check if your server has a "write" permissions for wp-content/uploads.',
                'visualcomposer'
            );
            break;
        case 'copy_failed_copy_dir':
            $message = __(
                'We could not copy a directory for the plugin in wp-content/uploads. Please check if your server has write permissions for wp-content/uploads.',
                'visualcomposer'
            );
            break;
    }
    if (!empty($message)) {
        $message .= sprintf(
            '%s<span class="vcv-error-screen-text-default">You may need to contact your hosting provider for assistance. If the problem still occurs, visit <a href="%s" target="_blank" rel="noopener noreferrer">my.visualcomposer.com/support</a> for technical assistance</span>',
            PHP_EOL,
            str_replace('utm_content=button', 'utm_content=text', vcvenv('VCV_SUPPORT_URL'))
        );
    }

    // translators: %s: error message
    $message .= PHP_EOL . sprintf(__('WordPress Error: %s', 'visualcomposer'), $errorMessage);
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
 * @param $response
 *
 * @return bool
 * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
 * @internal
 *
 */
function _vcCheckIsResponseBad($response)
{
    $loggerHelper = vchelper('Logger');
    if (isset($response['body'])) {
        $body = $response['body'];
        // Check that body is correct JSON
        if (is_string($body)) {
            // @codingStandardsIgnoreLine
            $arr = json_decode($body, true);
            $isBodyErr = (is_array($arr) && isset($arr['status']) && !$arr['status']) || !is_array($arr);

            if ($isBodyErr) {
                // Wrong JSON response
                $loggerHelper->log(
                    esc_html__('A wrong response body was received.', 'visualcomposer'),
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
                $message = esc_html__('Bad status code was received.', 'visualcomposer') . $additionalMessage;
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
                // translators: %d: response error code
                $message = sprintf(esc_html__('A bad response status code %d was received.', 'visualcomposer'), $responseCode);
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
        $message = esc_html__('Failed to process the action.', 'visualcomposer') . $additionalMessage;
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
    $outputHelper = vchelper('Output');
    $outputHelper->printNotEscaped(is_string($message) ? $message : wp_json_encode($message));
    if (defined('VCV_DIE_EXCEPTION') && VCV_DIE_EXCEPTION) {
        throw new Exception($message);
    } else {
        exit;
    }
}
