<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/**
 * Start the application.
 */
$app = new VisualComposer\Application(VCV_PLUGIN_DIR_PATH);
add_action(
    'vcv:boot',
    function () {
        /** @see \VisualComposer\Framework\Autoload::__construct */
        vcapp('Autoload');
    },
    9 // priority is smaller than default, so 3rd can hook into with all core components registered.
);
$app->boot();
