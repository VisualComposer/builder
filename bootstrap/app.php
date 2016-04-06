<?php
/**
 * Start the application
 */
$app = new VisualComposer\Application(VCV_PLUGIN_DIR_PATH);
add_action(
    'vcv:boot',
    function () {
        vcapp('Autoload');
    }
);
$app->boot();

return $app;
