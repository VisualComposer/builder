<?php
/**
 * Constant that determinates that it is outer-request(ajax).
 */
define('VCV_AJAX_REQUEST_CALL', true);

/** @var \VisualComposer\Helpers\Request $requestHelper */
$requestHelper = vchelper('Request');
// Require an action parameter.
if (!$requestHelper->exists('vcv-action')) {
    die(json_encode(
        [
            'status' => 0,
            'key' => 0,
        ]
    ));
}

$requestAction = $requestHelper->input('vcv-action');
/** @var \VisualComposer\Helpers\Str $strHelper */
$strHelper = vchelper('Str');
/** @var \VisualComposer\Helpers\Nonce $nonceHelper */
$nonceHelper = vchelper('Nonce');
if ($strHelper->contains($requestAction, ':nonce')) {
    if (!$nonceHelper->verifyUser($requestHelper->input('vcv-nonce'))) {
        die(json_encode(
            [
                'status' => 0,
                'key' => 1,
            ]
        ));
    }
} elseif ($strHelper->contains($requestAction, ':adminNonce')) {
    if (!$nonceHelper->verifyAdmin($requestHelper->input('vcv-nonce'))) {
        die(json_encode(
            [
                'status' => 0,
                'key' => 2,
            ]
        ));
    }
}

$response = vcfilter('vcv:ajax', '');
$response = vcfilter('vcv:ajax:' . $requestAction, $response);

if (is_string($response)) {
    echo $response;
} else {
    echo json_encode($response);
}

