<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/** @var $controller \VisualComposer\Modules\Settings\Pages\Authorization */
if ($controller->isAuthorized()) {
    $view = 'authorized-state';
} else {
    $view = 'unauthorized-state';
}
echo vcview('settings/pages/auth/partials/' . $view, ['controller' => $controller]);
