<?php
/**
 * Start the application
 */
$app = new VisualComposer\Application(VCV_PLUGIN_DIR_PATH);
add_action(
    'vcv:boot',
    function () {
        new \VisualComposer\Framework\Autoload();
    }
);
$app->boot();

return $app;
