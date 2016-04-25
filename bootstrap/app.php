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
    },
    9 // priority is smaller than default, so 3rd can hook into with all core components registred
);
$app->boot();

return $app;
