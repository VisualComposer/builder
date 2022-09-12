<?php

namespace VisualComposer\Modules\Vendors;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class NinjaFormsController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    protected static $ninjaCount;

    public function __construct()
    {
        $this->wpAddAction('plugins_loaded', 'initialize', 16);
    }

    protected function initialize(Request $requestHelper)
    {
        if (class_exists('Ninja_Forms') && $requestHelper->isAjax()) {
            $this->addFilter(
                'vcv:ajax:elements:ajaxShortcode:adminNonce',
                'replaceIds',
                2
            );
        }
    }

    protected function replaceIds($response)
    {
        if (!vcIsBadResponse($response)) {
            if (is_null(self::$ninjaCount)) {
                self::$ninjaCount = 1;
            } else {
                self::$ninjaCount++;
            }
            $patterns = [
                '(nf-form-)(\d+)(-cont)',
                '(nf-form-title-)(\d+)()',
                '(nf-form-errors-)(\d+)()',
                '(form.id\s*=\s*\')(\d+)(\')',
            ];
            $time = time() . self::$ninjaCount . wp_rand(100, 999);
            foreach ($patterns as $pattern) {
                $response = preg_replace('/' . $pattern . '/', '${1}' . $time . '${3}', $response);
            }
            $replaceTo = <<<JS
if (typeof nfForms !== 'undefined') {
  nfForms = nfForms.filter( function(item, index) {
    if (item && item.id) {
      return document.querySelector('#nf-form-' + item.id + '-cont')
    }
    return false
  })
}
JS;

            $response = str_replace('var nfForms', $replaceTo . ';var nfForms', $response);
        }

        return $response;
    }
}
