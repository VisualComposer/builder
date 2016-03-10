<?php

if (!defined('ABSPATH')) {
    die('-1');
}

if (vcapp('VisualComposer\Modules\License\Controller')->isActivated()) {
    $view = 'activated-state';
} else {
    $view = 'deactivated-state';
}

vcapp('VisualComposer\Helpers\Generic\Templates')->render('settings/pages/license/partials/' . $view);
