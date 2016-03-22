<?php
/**
 * Constant that determinates that it is outer-request(ajax)
 */
define('VC_V_LOADER', true);

// Require an action parameter
if (empty($_REQUEST['action'])) {
    die(json_encode(
        [
            'status' => 'fail',
            'key' => 0,
        ]
    ));
}
$requestAction = $_REQUEST['action'];
/** Load WordPress Bootstrap */
require_once __DIR__ . '/../../../../../../wp-load.php'; // @todo it s****

send_origin_headers();

@header('Content-Type: text/html; charset=' . get_option('blog_charset'));
@header('X-Robots-Tag: noindex');

send_nosniff_header();
nocache_headers();

if (strpos($requestAction, ':nonce')) {
    if (empty($_REQUEST['nonce']) || !vcapp('nonceHelper')->verifyUser($_REQUEST['nonce'])) {
        die(json_encode(
            [
                'status' => 'fail',
                'key' => 1,
            ]
        ));
    }
} elseif (strpos($requestAction, ':admin-nonce')) {
    if (empty($_REQUEST['nonce'])
        || !vcapp('nonceHelper')->verifyAdmin(
            $_REQUEST['nonce']
        )
    ) {
        die(json_encode(
            [
                'status' => 'fail',
                'key' => 2,
            ]
        ));
    }
}

/**
 * @todo: 1) check access [authorized, permission, guest]
 * @todo: 2) sanitize input
 */
do_action('vc:v:ajax:loader');
do_action('vc:v:ajax:loader:' . $requestAction);

// Detect if output received, just DIE
$sent = headers_sent() || ob_get_status();
if ($sent) {
    die;
} else {
    die(json_encode(
        [
            'status' => 'done',
            'key' => 0,
        ]
    ));
}
