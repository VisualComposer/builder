<?php

namespace VisualComposer\Modules\FrontView;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Options;

/**
 * Class LazyLoadController
 * @package VisualComposer\Modules\LazyLoad
 */
class LazyLoadController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    /**
     * Controller constructor.
     */
    public function __construct(Options $optionsHelper)
    {
        $this->addFilter('vcv:editor:variables', 'addVariables');

        if (!$optionsHelper->get('settings-lazy-load-enabled', true)) {
            $this->wpAddFilter('the_content', 'removeFromDesignOptions', 100);

            $this->wpAddFilter('the_content', 'removeFromSingleImageElement', 100);

            $this->wpAddFilter('the_content', 'removeFromVideoElement', 100);

            $this->wpAddAction('wp_enqueue_scripts', 'dequeueLazyLoad', 100);
        }
    }

    /**
     * Dequeue lazy load lib script.
     */
    protected function dequeueLazyLoad()
    {
        wp_dequeue_script('vcv:assets:source:scripts:assetslibrarylazyloaddistlazyloadbundlejs');
    }

    /**
     * Add frontend variables.
     *
     * @param array $variables
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return array
     */
    protected function addVariables($variables, Options $optionsHelper)
    {
        $variables[] = [
            'key' => 'VCV_GLOBAL_LAZY_LOAD_ENABLED',
            'value' => $optionsHelper->get('settings-lazy-load-enabled', true),
            'type' => 'constant',
        ];

        return $variables;
    }

    /**
     * Remove lazy load functionality from vc single image element.
     *
     * @param null|string|string[] $content
     *
     * @return null|string|string[]
     */
    protected function removeFromSingleImageElement($content)
    {
        $pattern = '/<img[^>]*class="vce-single-image vcv-lozad"(.*?)>/';

        return preg_replace_callback(
            $pattern,
            function ($matches) {
                $parse = $matches[0];

                // find current image src prepared for lazy loading
                $srcImage = '';
                $regex = '/data-src="(.*?)"/';
                if (preg_match($regex, $parse, $match)) {
                    $srcImage = $match[1];
                }

                if ($srcImage) {
                    // remove data-src attribute
                    $pattern = '/data-src="[^\"]*"/';
                    $parse = preg_replace($pattern, '', $parse);

                    // replace src attribute
                    $srcImage = ' src="' . $srcImage . '" ';
                    $parse = str_replace('src=""', $srcImage, $parse);
                }

                return $parse;
            },
            $content
        );
    }

    /**
     * Remove lazy load functionality from post content for design options.
     *
     * @param null|string|string[] $content
     *
     * @return null|string|string[]
     */
    protected function removeFromDesignOptions($content)
    {
        $pattern = '/<div[^>]*data-vce-lozad="true"(.*?)>/';

        return preg_replace_callback(
            $pattern,
            function ($matches) {
                $parse = $matches[0];

                // remove lazy load attributes
                $parse = preg_replace('/data-vce-lozad="[^\"]*"/', '', $parse);

                $screenList = ['all', 'xl', 'lg', 'md', 'sm', 'xs'];

                // find current image src prepared for lazy loading
                $srcImage = '';
                foreach ($screenList as $screenSize) {
                    $regex = '/data-vce-background-image-' . $screenSize . '="(.*?)"/';
                    if (preg_match($regex, $parse, $match)) {
                        $srcImage = $match[1];
                    }
                    if ($srcImage) {
                        break;
                    }
                }

                // add style background-image
                if ($srcImage) {
                    $srcImage = ' style=\'background-image: url("' . $srcImage . '");\' ';
                    $parse = substr_replace($parse, $srcImage, 4, 0);
                }

                return $parse;
            },
            $content
        );
    }

    /**
     * Remove lazy load functionality from vc video element.
     *
     * @param null|string|string[] $content
     *
     * @return null|string|string[]
     */
    protected function removeFromVideoElement($content)
    {
        $pattern = '/\/noscript><video[^>]*class="(.*?)vcv-lozad(.*?)"(.*?)><source (.*?)<\/video>/';

        return preg_replace_callback(
            $pattern,
            function ($matches) {
                $parse = $matches[0];

                // find current src prepared for lazy loading
                $src = '';
                $regex = '/data-src="(.*?)"/';
                if (preg_match($regex, $parse, $match)) {
                    $src = $match[1];
                }

                if ($src) {
                    // remove data-src attribute
                    $pattern = '/data-src="[^\"]*"/';
                    $parse = preg_replace($pattern, '', $parse);

                    // replace src attribute
                    $src = ' src="' . $src . '" ';
                    $parse = str_replace('src=""', $src, $parse);
                }

                return $parse;
            },
            $content
        );
    }
}
