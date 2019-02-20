<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Helper methods related to templates.
 * Class Views.
 */
class Views extends container implements Helper
{
    /**
     * Render template.
     *
     * @param string $_path Path to view to render. Must be relative to /visualcomposer/resources/views/
     *   Extension ".php" can be omitted.
     * @param array $_args Arguments to pass to view.
     *
     * @return string Rendered view.
     * @note Do not modify variables name! Because it will be passed into `include`
     */
    public function render($_path, $_args = [])
    {
        /** @var Str $strHelper */
        $strHelper = vchelper('Str');
        if ($strHelper->lower(substr($_path, -4, 4)) !== '.php') {
            $_path .= '.php';
        }
        /** @var \VisualComposer\Application $_app */
        $_app = vcapp();
        ob_start();
        extract($_args);

        /** @var Filters $filterHelper */
        $filterHelper = vchelper('Filters');
        $_path = $filterHelper->fire(
            'vcv:helpers:views:render:path',
            $_app->path('visualcomposer/resources/views/' . ltrim($_path, '/\\')),
            [
                'path' => $_path,
                'args' => $_args,
            ]
        );
        /** @noinspection PhpIncludeInspection */
        include($_path);
        $content = ob_get_clean();

        return $content;
    }

    /**
     * Helper function to display nested sections if any
     *
     * @param $section
     * @param $slug
     *
     * @throws \ReflectionException
     */
    public function doNestedSection($section, $slug)
    {
        // @codingStandardsIgnoreStart
        global $wp_settings_fields;
        $wpSettingsFields = $wp_settings_fields;
        // @codingStandardsIgnoreEnd
        $class = isset($section['vcv-args']) && isset($section['vcv-args']['class']) ? ' ' . esc_attr($section['vcv-args']['class']) : '';

        echo '<div class="' . esc_attr($slug) . '-section ' . esc_attr($section['id']) . $class . '">';
        if ($section['title']) {
            echo "<h2>{$section['title']}</h2>\n";
        }

        if ($section['callback']) {
            call_user_func($section['callback'], $section);
        }

        if (!isset($wpSettingsFields) || !isset($wpSettingsFields[ $slug ])
            || !isset($wpSettingsFields[ $slug ][ $section['id'] ])) {
            return;
        }
        echo '<table class="form-table">';
        do_settings_fields($slug, $section['id']);
        echo '</table>';
        if (isset($section['children']) && !empty($section['children'])) {
            ?>
            <div class="vcv-child-section">
                <?php
                foreach ($section['children'] as $child) {
                    $this->call('doNestedSection', [$child, $slug]);
                }
                ?>
            </div>
            <?php
        }
        echo '</div>';
    }
}
