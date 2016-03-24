<?php

if (!defined('ABSPATH')) {
    die('-1');
}

/** @var $controller \VisualComposer\Modules\Settings\Pages\Authorization */
if ($controller->isAuthorized()) {
    $view = 'authorized-state';
} else {
    $view = 'unauthorized-state';
}
vcview('settings/pages/auth/partials/' . $view, ['controller' => $controller]);
