<?php

if (!defined('VCV_E2E')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

// This should be run after all php-e2e tests are done
if (isset($_GET['php-e2e-action']) && $_GET['php-e2e-action'] === 'dump-vcv-db-start-clean') {
    add_action(
        'init',
        function () {
            global $wpdb;
            // dump
            $fields = $wpdb->get_results('select * from ' . $wpdb->options . ' where option_name like "%vcv%"');
            if (is_array($fields) && !empty($fields)) {
                update_option('php-e2e-dump', $fields);
                // remove all
                $wpdb->query('delete from ' . $wpdb->options . ' where option_name like "%vcv%"');
            }
            echo 'Done';
            exit;
        },
        100
    );
}

// This should be run after all php-e2e tests are done
if (isset($_GET['php-e2e-action']) && $_GET['php-e2e-action'] === 'dump-vcv-db-back') {
    add_action(
        'init',
        function () {
            global $wpdb;
            $fields = get_option('php-e2e-dump');
            if (is_array($fields) && !empty($fields)) {
                // remove all
                $wpdb->query('delete from ' . $wpdb->options . ' where option_name like "%vcv%"');
                foreach ($fields as $field) {
                    unset($field->option_id);
                    $wpdb->insert($wpdb->options, (array)$field);
                }
            }
            echo 'Done';
            exit;
        },
        100
    );
}
