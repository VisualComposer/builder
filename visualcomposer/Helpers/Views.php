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
    protected $renderedFields = [];

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
        $class = isset($section['vcv-args']['class']) ? ' ' . esc_attr($section['vcv-args']['class']) : '';

        echo sprintf(
            '<div class="%s-section %s_%s%s">',
            esc_attr($slug),
            esc_attr($section['group']),
            esc_attr($section['slug']),
            $class
        );
        if ($section['title']) {
            echo "<h2>{$section['title']}</h2>\n";
        }

        if ($section['callback']) {
            call_user_func($section['callback'], $section);
        }

        $fieldsRegistry = vchelper('SettingsFieldsRegistry');
        $fields = $fieldsRegistry->findBySlug($section['slug']);
        if (!empty($fields)) {
            echo '<table class="form-table">';
            $this->doNestedFields($fields);
            echo '</table>';
        }
        if (isset($section['children']) && !empty($section['children'])) {
            echo '<div class="vcv-child-section">';
            foreach ($section['children'] as $child) {
                $this->call('doNestedSection', [$child, $slug]);
            }
            echo '</div>';
        }
        echo '</div>';
    }

    public function doNestedFields($fields)
    {
        foreach ($fields as $field) {
            $this->renderedFields[] = 'vcv-' . $field['name'];
            $class = '';

            if (!empty($field['args']['class'])) {
                $class = ' class="' . esc_attr($field['args']['class']) . '"';
            }

            echo "<tr{$class}>";

            if (empty($field['args']['vcv-no-label'])) {
                if (!empty($field['args']['label_for'])) {
                    echo '<th scope="row"><label for="' . esc_attr($field['args']['label_for']) . '">' . $field['title']
                        . '</label></th>';
                } else {
                    echo '<th scope="row">' . $field['title'] . '</th>';
                }
            }

            echo '<td>';
            vcapp()->call($field['fieldCallback'], $field['args']);
            echo '</td>';
            echo '</tr>';
        }
    }

    public function renderedFieldsList()
    {
        // Redirect back referer
        echo '<input type="hidden" name="_wp_http_referer" value="' . esc_attr(wp_unslash($_SERVER['REQUEST_URI']))
            . '" />';
        echo sprintf(
            '<input type="hidden" name="vcv-settings-rendered-fields" value="%s" />',
            htmlentities(wp_json_encode(array_values(array_unique($this->renderedFields))))
        );
        $this->renderedFields = [];
    }
}
