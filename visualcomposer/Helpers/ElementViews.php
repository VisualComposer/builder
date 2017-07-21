<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Helper methods related to templates.
 * Class Views.
 */
class ElementViews implements Helper
{
    /**
     * Render template.
     *
     * @param string $_path Path to view to render.
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

        ob_start();
        
        /**
         * @var $element
         */
        extract($_args);

        /** @var Filters $filterHelper */
        $filterHelper = vchelper('Filters');
        $_path = $filterHelper->fire(
            'vcv:helpers:elementviews:render:path',
            rtrim($this->elementRealPath($element), '/\\') . '/views/' . ltrim($_path, '/\\'),
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
     * @return string|false
     */
    protected function elementRealPath($element)
    {
        $hubHelper = vchelper('HubElements');
        $hubElements = $hubHelper->getElements();

        if ($hubElements[ $element ]) {
            return $hubElements[ $element ]['elementRealPath'];
        }

        return false;
    }
}
