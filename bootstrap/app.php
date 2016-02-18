<?php

$app = new Laravel\Lumen\Application( realpath( __DIR__ . '/../' ) );
$app->withFacades();

return $app;