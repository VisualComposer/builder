<?php

define('VCV_PHPUNIT', true);
define('VCV_LAZY_LOAD', true);
define('VCV_DIE_EXCEPTION', true);
define('VCV_DEBUG', true);

require_once dirname(__DIR__, 2) . '/ci/wp-tests-9.0.0/wp-tests/phpunit/includes/functions.php';

tests_add_filter(
    'muplugins_loaded',
    function () {
        global $wpdb;
        $wpdb->query(
            $wpdb->prepare(
                'DELETE FROM ' . $wpdb->options . ' WHERE option_name LIKE "%s"',
                '%vcv%'
            )
        );

        require_once dirname(__DIR__, 2) . '/plugin-wordpress.php';
        do_action('vcv:bootstrap:lazyload');
    }
);

require dirname(__DIR__, 2) . '/ci/wp-tests-9.0.0/wp-tests/phpunit/includes/bootstrap.php';

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
        ) . (rand(1000, 9999)) . uniqid();

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

//add_action(
//    'vcv:phpunit:ready',
//    function () {
//        do_action('vcv:bootstrap:lazyload');
//    }
//);