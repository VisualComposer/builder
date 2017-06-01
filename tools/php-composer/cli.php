<?php

namespace ComposerHooks;

require_once(__DIR__ . '/../../vendor/autoload.php');

$registry = new Registry();
$registry::callHooks();

echo 'Hooks done!';
