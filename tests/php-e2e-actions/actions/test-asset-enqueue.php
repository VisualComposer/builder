<?php

if (!defined('VCV_E2E')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

if (isset($_GET['php-e2e-action']) && $_GET['php-e2e-action'] === 'test-asset-enqueue') {
    // We are on PRE wordpress init stage.
    // This file will add required staff for testing assets enqueue sequence
    // Tests related to VC-1201 (localization sequence
    define('WP_USE_THEMES', true);
    add_action('init', [TestAssetEnqueue::class, 'createInstance']);

    class TestAssetEnqueue
    {
        /**
         * @var int|\WP_Error
         */
        protected $postId;

        /**
         * @var int|\WP_Error
         */
        protected $templateId;

        public function __construct()
        {
            $this->createPost();
            $this->loadAssets();

            add_action('wp_loaded', [$this, 'setupPage']);
        }

        public static function createInstance()
        {
            return new self();
        }

        public function createPost()
        {
            // Set up the WordPress query.
            $this->templateId = e2e_create_post(
                [
                    'post_title' => 'test-asset-enqueue',
                    'post_content' => 'Hello From Inner Post',
                    'post_status' => 'publish',
                    'post_type' => 'page',
                ]
            );

            vchelper('AssetsEnqueue')->addToEnqueueList($this->templateId);

            // Set up the WordPress query.
            $this->postId = e2e_create_post(
                [
                    'post_title' => 'test-asset-enqueue-inner-post',
                    'post_content' => sprintf(
                        'Hello From Tests :)  Current ID:<span id="e2e-current-id">[e2e_get_current_id]</span>, Template ID:<span id="e2e-template-id">%d</span> [e2e_load_post id="%d"]',
                        $this->templateId,
                        $this->templateId
                    ),
                    'post_status' => 'publish',
                    'post_type' => 'page',
                ]
            );
        }

        public function loadAssets()
        {
            add_action(
                'wp_enqueue_scripts',
                function () {
                    wp_register_script(
                        'TestAssetEnqueue',
                        VCV_PLUGIN_URL . '/tests/assets/php-e2e-locale.js',
                        ['jquery'],
                        VCV_VERSION,
                        true
                    ); // should be placed in footer
                }
            );
            add_action(
                'wp_enqueue_scripts',
                function () {
                    wp_enqueue_script('TestAssetEnqueue');
                }
            );
            add_action(
                'wp_enqueue_scripts',
                function () {
                    wp_localize_script('TestAssetEnqueue', 'vcvLocaleBug', ['test' => get_the_ID()]);
                }
            );
        }

        public function setupPage()
        {
            // Create rewrite rules, to avoid 404 issues and extra redirects
            e2e_add_rewrite_rules();

            // Setup global query
            wp(['p' => $this->postId, 'post_type' => 'page']);
            $GLOBALS['wp']->did_permalink = false;
            // Load the theme template.
            require_once ABSPATH . WPINC . '/template-loader.php';
        }
    }
}
