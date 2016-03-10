<?php
/**
 * Start the application
 */
$app = new VisualComposer\Application(realpath(__DIR__ . '/../'));
$app->boot();

return $app;
