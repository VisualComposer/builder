<?php
/**
 * Start the application
 */
$app = new VisualComposer\Application(realpath(__DIR__ . '/../'));
$app->withFacades();
$app->boot();

return $app;
