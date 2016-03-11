<?php

if (!defined('ABSPATH')) {
    die('-1');
}

if (vcapp('license')->isActivated()) {
    $view = 'activated-state';
} else {
    $view = 'deactivated-state';
}

vcapp('templatesHelper')->render('settings/pages/license/partials/' . $view);
