<?php

namespace VisualComposer\Helpers\Generic;

/**
 * Helper methods related to templates
 */
abstract class Templates
{
    /**
     * Render template
     *
     * @param string $path Path to view to render. Must be relative to /visualcomposer/resources/views/
     *   Extension ".php" can be ommited
     * @param array $args Arguments to pass to view
     * @param bool $echo If false, only return results
     *
     * @return string Rendered view
     */
    public static function render($path, $args = [], $echo = true)
    {
        if (strtolower(substr($path, -4, 4)) !== '.php') {
            $path .= '.php';
        }

        ob_start();

        extract($args);

        $path = apply_filters(
            'vc:v:api:templates:render',
            VC_V_PLUGIN_DIR_PATH . 'visualcomposer/resources/views/' . ltrim($path, '/\\'),
            $path,
            $args,
            $echo
        );
        include($path);

        $content = ob_get_clean();

        if ($echo) {
            echo $content;
        }

        return $content;
    }
}
