<?php

namespace VisualComposer\Helpers;

use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Helper methods related to templates
 * Class Templates
 * @package VisualComposer\Helpers
 */
class Templates implements Helper
{
    /**
     * Render template
     *
     * @param string $_path Path to view to render. Must be relative to /visualcomposer/resources/views/
     *   Extension ".php" can be ommited
     * @param array $_args Arguments to pass to view
     * @param bool $_echo If false, only return results
     *
     * @return string Rendered view
     */
    public function render($_path, $_args = [], $_echo = true)
    {
        if (strtolower(substr($_path, -4, 4)) !== '.php') {
            $_path .= '.php';
        }
        /** @var \VisualComposer\Application $_app */
        $_app = vcapp();

        ob_start();

        extract($_args);

        $_path = apply_filters(
            'vcv:helpers:templates:render',
            $_app->path('visualcomposer/resources/views/' . ltrim($_path, '/\\')),
            $_path,
            $_args,
            $_echo
        );
        /** @noinspection PhpIncludeInspection */
        include($_path);

        $content = ob_get_clean();

        if ($_echo) {
            echo $content;
        }

        return $content;
    }
}
