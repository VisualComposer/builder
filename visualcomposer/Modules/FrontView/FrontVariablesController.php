<?php

namespace VisualComposer\Modules\FrontView;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class FrontVariablesController
 * @package VisualComposer\Modules\FrontView
 */
class FrontVariablesController extends Container implements Module
{
    use WpFiltersActions;

    protected $isAdded = false;

    public function __construct()
    {
        $this->wpAddAction('wp_enqueue_scripts', 'addVariables', 1);
    }

    protected function addVariables()
    {
        if ($this->isAdded) {
            return;
        }
        $this->isAdded = true;
        $variables = vcfilter('vcv:frontView:variables', []);
        $scriptOutput = '';
        if (is_array($variables)) {
            foreach ($variables as $variable) {
                if (is_array($variable) && isset($variable['key'], $variable['value'])) {
                    $type = isset($variable['type']) ? $variable['type'] : 'variable';
                    $variable['addScript'] = false;
                    $scriptOutput .= vcview('partials/variableTypes/' . $type, $variable);
                }
            }
            unset($variable);
        }

        wp_add_inline_script('vcv:assets:front:script', $scriptOutput, 'before');
    }
}
