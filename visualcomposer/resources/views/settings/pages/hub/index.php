<?php

if (!defined('ABSPATH')) {
    die('-1');
}

/** @var $controller \VisualComposer\Modules\Settings\Pages\Hub */
if (vcapp('SettingsPagesAuthorization')->isAuthorized()) {
    $view = 'authorized-state';
} else {
    $view = 'unauthorized-state';
}
vcview('settings/pages/hub/partials/' . $view, ['controller' => $controller]);
