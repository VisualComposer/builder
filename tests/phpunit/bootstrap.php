<?php

define('VCV_PHPUNIT', true);
define('VCV_LAZY_LOAD', true);
define('VCV_DIE_EXCEPTION', true);
define('VCV_DEBUG', true);
define('VCV_DEBUG_AUTOLOAD_RANDOM', true);
$testsDir = getenv('WP_TESTS_DIR');
if (!$testsDir) {
    $testsDir = '/tmp/wordpress-tests-lib';
}
require_once $testsDir . '/phpunit/includes/functions.php';

tests_add_filter(
    'muplugins_loaded',
    function () {
        require_once dirname(__FILE__) . '/../../plugin-wordpress.php';
    }
);

require $testsDir . '/phpunit/includes/bootstrap.php';

/**
 * Class DiedException
 *
 * When unittests are run, instead of die(), this exception is thrown
 */
class DiedException extends Exception
{
}

/**
 * @param $mockableClass
 *
 * @return \VisualComposer\Framework\Application
 */
function vc_create_module_mock($mockableClass)
{
    /** @var $mock \VisualComposer\Framework\Application */
    $temporaryClass = substr(
            str_shuffle(
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
            ),
            0,
            50
        ) . (rand(1000, 9999));

    $code = "
        class $temporaryClass extends $mockableClass {
            public function call(\$method, array \$parameters = []) {
                return parent::call(\$method, \$parameters);
            }
        }
        \$mock = vcapp()->make('$temporaryClass');
    ";
    eval($code);

    return $mock;
}

add_action(
    'vcv:phpunit:ready',
    function () {
        do_action('vcv:bootstrap:lazyload');
    }
);