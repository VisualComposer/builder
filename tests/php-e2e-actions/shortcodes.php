<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

add_shortcode(
    'e2e_load_post',
    function ($atts, $content, $tag) {
        $atts = shortcode_atts(
            [
                'id' => '',
            ],
            $atts
        );
        $output = 'empty';
        if (!empty($atts['id'])) {
            $sourceId = $atts['id'];
            ob_start();
            // @codingStandardsIgnoreStart
            global $wp_query, $wp_the_query;
            $backup = $wp_query;
            $backupGlobal = $wp_the_query;

            $tempPostQuery = new \WP_Query(
                [
                    'p' => $sourceId,
                    'post_status' => get_post_status($sourceId),
                    'post_type' => get_post_type($sourceId),
                ]
            );
            $wp_query = $tempPostQuery;
            $wp_the_query = $tempPostQuery;
            if ($wp_query->have_posts()) {
                $wp_query->the_post();
                $wp_query->in_the_loop = false; // fix for "directories" plugin. in_the_loop() should be false, as it is additional rendering.
                the_content();
            }

            $wp_query = $backup;
            $wp_the_query = $backupGlobal; // fix wp_reset_query
            // @codingStandardsIgnoreEnd
            wp_reset_postdata();

            $output = ob_get_clean();
        }

        return $output;
    }
);

add_shortcode(
    'e2e_get_current_id',
    function ($atts, $content, $tag) {
        return get_the_ID();
    }
);
