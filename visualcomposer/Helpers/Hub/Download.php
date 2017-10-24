<?php

namespace VisualComposer\Helpers\Hub;

use VisualComposer\Framework\Illuminate\Support\Helper;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

class Download implements Helper
{
    public function getActionName($action)
    {
        $name = $action;
        /*
         Editor bundle
         Downloading assets 5%: Categories bundle
         Downloading assets 7.5%: Library extension
         Downloading assets 10%: Templates library
         Downloading assets 12.5%: Row element
         */
        switch ($action) {
            case 'editor':
                $name = __('Editor bundle', 'vcwb');
                break;
            case 'categories':
                $name = __('Categories bundle', 'vcwb');
                break;
            case 'assets':
                $name = __('Library extensions', 'vcwb');
                break;
            case 'templates':
                $name = __('Templates library', 'vcwb');
                break;
        }
        $name = preg_replace('/(element\/)(.*)/', '$2 Element', $name);

        return ucfirst($name);
    }
}
