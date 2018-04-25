<?php

namespace ComposerHooks;

define('ABSPATH', true);

require_once(__DIR__ . '/../../vendor/autoload.php');
require_once(__DIR__ . '/Hooks/Autoload.php');
Hooks\Autoload::call();

echo 'Hooks done!';
