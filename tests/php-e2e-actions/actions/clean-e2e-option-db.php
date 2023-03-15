<?php

if (!defined('VCV_E2E')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}


// This should be run after all php-e2e tests are done
if (!empty($_GET['php-e2e-clean-option'])) {
    add_action(
        'init',
        function () {
            delete_option($_GET['php-e2e-clean-option']);
        },
        100
    );
}
