<?php
define('VC_V_LOADING_EDITOR', true);

// Require an action parameter
if (empty($_REQUEST['action'])) {
    die(json_encode(
        [
            'status' => 'fail',
            'key' => 0,
        ]
    ));
}

/** Load WordPress Bootstrap */
require_once('../../../../../../wp-load.php'); // @todo it s****

send_origin_headers();

@header('Content-Type: text/html; charset=' . get_option('blog_charset'));
@header('X-Robots-Tag: noindex');

send_nosniff_header();
nocache_headers();

use VisualComposer\Helpers\WordPress\Nonce;

if (strpos($_REQUEST['action'], ':nonce')) {
    if (empty($_REQUEST['nonce']) || !Nonce::verifyUser($_REQUEST['nonce'])) {
        die(json_encode(
            [
                'status' => 'fail',
                'key' => 1,
            ]
        ));
    }
} elseif (strpos($_REQUEST['action'], ':admin-nonce')) {
    if (empty($_REQUEST['nonce']) || !Nonce::verifyAdmin($_REQUEST['nonce'])) {
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
do_action('vc:v:ajax:loader:' . $_REQUEST['action']);

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
