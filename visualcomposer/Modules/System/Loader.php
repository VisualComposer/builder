<?php
/**
 * Constant that determinates that it is outer-request(ajax)
 */
define('VCV_AJAX_REQUEST_CALL', true);

// Require an action parameter
if (empty($_REQUEST['vcv-action'])) {
    die(json_encode(
        [
            'status' => 'fail',
            'key' => 0,
        ]
    ));
}

$requestAction = $_REQUEST['vcv-action'];
/** @var \VisualComposer\Helpers\Str $strHelper */
$strHelper = vchelper('Str');
/** @var \VisualComposer\Helpers\Nonce $nonceHelper */
$nonceHelper = vchelper('Nonce');
if ($strHelper->contains($requestAction, ':nonce')) {
    if (empty($_REQUEST['vcv-nonce']) || !$nonceHelper->verifyUser($_REQUEST['vcv-nonce'])) {
        die(json_encode(
            [
                'status' => 'fail',
                'key' => 1,
            ]
        ));
    }
} elseif ($strHelper->contains($requestAction, ':adminNonce')) {
    if (empty($_REQUEST['vcv-nonce'])
        || !$nonceHelper->verifyAdmin(
            $_REQUEST['vcv-nonce']
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
do_action('vcv:ajax:loader');
do_action('vcv:ajax:loader:' . $requestAction);

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
