<?php

namespace VisualComposer\Modules\Elements;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Url;

class Controller extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Elements\Controller::addBundleScripts */
        $this->addFilter('vcv:frontend:extraOutput vcv:backend:extraOutput', 'addBundleScripts');
        /** @see \VisualComposer\Modules\Elements\Controller::addElementScripts */
        //$this->addFilter('vcv:frontend:extraOutput', 'addElementScripts');
        /** @see \VisualComposer\Modules\Elements\Controller::addElementScripts */
       // $this->addFilter('vcv:backend:extraOutput', 'addElementScripts');
    }

    private function addBundleScripts($output, Url $urlHelper)
    {
        $newWebpack = true;
        if ($newWebpack) {
            $output[] = sprintf(
                '<script type="text/javascript" src="%s"></script>',
                $urlHelper->to(
                    'public/dist/vendor.bundle.js?' . uniqid()
                )
            );
        }
        $output[] = sprintf(
            '<script type="text/javascript" src="%s"></script>',
            $urlHelper->to(
                'public/dist/wp.bundle.js?' . uniqid()
            )
        );

        return $output;
    }
//
//    private function addElementScripts($output, Url $urlHelper)
//    {
//        $newWebpack = false;
//        if ($newWebpack) {
//            $elements = vcapp()->rglob(vcapp()->path('public/dist/element-*.js'));
//            foreach ($elements as $element) {
//                if (strpos($element, 'public/dist/element-_') !== false) {
//                    continue; // Skip if element disabled
//                }
//                $elementName = str_replace(VCV_PLUGIN_DIR_PATH, '', $element);
//                $url = $urlHelper->to($elementName . '?' . uniqid()); // TODO: Use assets folder.
//                $output[] = sprintf('<script type="text/javascript" src="%s"></script>', $url);
//            }
//        }
//
//        return $output;
//    }
}
