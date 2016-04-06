<?php
/**
 * Start the application
 */
$app = new VisualComposer\Application(VCV_PLUGIN_DIR_PATH);
add_action(
    'vcv:boot',
    function () {
        /** @see \VisualComposer\Framework\Autoload::__construct */
        vcapp('Autoload');
    }
);
$app->boot();

return $app;
