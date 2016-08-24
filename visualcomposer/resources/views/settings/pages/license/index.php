<?php

if (!defined('ABSPATH')) {
    die('-1');
}

if (vchelper('License')->isActivated()) {
    $view = 'activated-state';
} else {
    $view = 'deactivated-state';
}

echo vcview('settings/pages/license/partials/' . $view, ['showFlashMessage' => true]);
