<?php

/* Path to the WordPress codebase you'd like to test. Add a backslash in the end. */
define( 'ABSPATH', getenv('WP_TESTS_ABSPATH') );

// Test with multisite enabled.
// Alternatively, use the tests/phpunit/multisite.xml configuration file.
// define( 'WP_TESTS_MULTISITE', true );

// Force known bugs to be run.
// Tests with an associated Trac ticket that is still open are normally skipped.
// define( 'WP_TESTS_FORCE_KNOWN_BUGS', true );

// Test with WordPress debug mode (default).
define( 'WP_DEBUG', true );
define( 'WP_HOME', 'http://'.getenv('WP_TESTS_DOMAIN') );
define( 'WP_SITEURL', 'http://'.getenv('WP_TESTS_DOMAIN') );
// ** MySQL settings ** //

// This configuration file will be used by the copy of WordPress being tested.
// wordpress/wp-config.php will be ignored.

// WARNING WARNING WARNING!
// These tests will DROP ALL TABLES in the database with the prefix named below.
// DO NOT use a production database or one that is shared with something else.

define( 'DB_NAME', getenv('WP_TESTS_DB_NAME') );
define( 'DB_USER', getenv('WP_TESTS_DB_USER') );
define( 'DB_PASSWORD', getenv('WP_TESTS_DB_PASS') );
define( 'DB_HOST', getenv('WP_TESTS_DB_HOST') );
define( 'DB_CHARSET', 'utf8' );
define( 'DB_COLLATE', '' );

$table_prefix  = 'wp_';   // Only numbers, letters, and underscores please!

define( 'WP_TESTS_DOMAIN', getenv('WP_TESTS_DOMAIN') );
define( 'WP_TESTS_EMAIL', 'admin@example.org' );
define( 'WP_TESTS_TITLE', 'Test Blog' );

define( 'WP_PHP_BINARY', 'php' );

define( 'WPLANG', '' );
