<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
if (vchelper('License')->isActivated()) {
    $view = 'activated-state';
} else {
    $view = 'deactivated-state';
}

echo vcview('settings/pages/license/partials/' . $view, ['showFlashMessage' => true]);
