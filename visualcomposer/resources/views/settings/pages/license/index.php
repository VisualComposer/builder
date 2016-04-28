<?php

if (!defined('ABSPATH')) {
    die('-1');
}

if (vcapp('LicenseController')->isActivated()) {
    $view = 'activated-state';
} else {
    $view = 'deactivated-state';
}

vcview('settings/pages/license/partials/' . $view);
