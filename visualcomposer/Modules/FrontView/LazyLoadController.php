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
    public function __construct()
    {
        $this->addFilter('vcv:editor:variables', 'addVariables');

        $this->wpAddAction('init', function () {
            if ($this->isWpNativeLazyLoadFilterDisabled()) {
                $this->wpAddFilter('the_content', 'globalOptionParser', 100);
                $this->addFilter('vcv:frontend:content', 'globalOptionParser', 100);
                $this->wpAddAction('wp_enqueue_scripts', 'dequeueLazyLoad', 100);
            }
        });
    }

    /**
     * Content parser for global lazy load optionality.
     *
     * @param string $content
     */
    protected function globalOptionParser($content)
    {
        $content = $this->removeFromDesignOptions($content);
        $content = $this->removeFromAdvancedDesignOptions($content);
        $content = $this->removeFromSingleImageElement($content);
        $content = $this->removeFromLayoutFeatureImageElement($content);

        return $this->removeFromVideoElement($content);
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
     *
     * @return array
     */
    protected function addVariables($variables)
    {
        $variables[] = [
            'key' => 'VCV_IS_WP_NATIVE_LAZY_LOAD_EXIST',
            'value' => $this->isWpNativeLazyLoadExist(),
            'type' => 'constant',
        ];

        return $variables;
    }

    /**
     * Remove lazy load functionality from vc advanced design options element.
     *
     * @param null|string|string[] $content
     *
     * @return null|string|string[]
     */
    protected function removeFromAdvancedDesignOptions($content)
    {
        $pattern = '/<div[^>]*class="(.*?) vcv-lozad"(.*?)>/';

        return preg_replace_callback(
            $pattern,
            function ($matches) {
                $parse = $matches[0];

                // find current src prepared for lazy loading
                $src = '';
                $regex = '/data-background-image="(.*?)"/';
                if (preg_match($regex, $parse, $match)) {
                    $src = $match[1];
                }

                if ($src) {
                    // remove data-src attribute
                    $pattern = '/data-background-image="[^\"]*"/';
                    $parse = preg_replace($pattern, '', $parse);

                    $src = ' style=\'background-image: url("' . $src . '");\' ';
                    $parse = substr_replace($parse, $src, 4, 0);
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
     * Remove lazy load functionality from vc single image element.
     *
     * @param null|string|string[] $content
     *
     * @return null|string|string[]
     */
    protected function removeFromSingleImageElement($content)
    {
        $pattern = '/<img[^>]*class="vce-single-image vcv-lozad"(.*?)>/';

        return $this->removeFromElement($pattern, $content);
    }

    /**
     * Remove lazy load functionality from vc layout feature image element.
     *
     * @param null|string|string[] $content
     *
     * @return null|string|string[]
     */
    protected function removeFromLayoutFeatureImageElement($content)
    {
        $pattern = '/<img[^>]*class="vce-layout-post-featured-image vcv-lozad"(.*?)>/';

        return $this->removeFromElement($pattern, $content);
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

        return $this->removeFromElement($pattern, $content);
    }

    /**
     * Callback function for preg_replace element lazy load remove.
     *
     * @param string $pattern Regex pattern.
     * @param string $content
     */
    protected function removeFromElement($pattern, $content)
    {
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
                    $parse = str_replace('vcv-lozad', '', $parse);
                }

                return $parse;
            },
            $content
        );
    }

    /**
     * Check if native wp_lazy_loading_enabled filter deactivated.
     *
     * @return bool
     */
    protected function isWpNativeLazyLoadFilterDisabled()
    {
        if (!$this->isWpNativeLazyLoadExist()) {
            return false;
        }

        return !wp_lazy_loading_enabled('img', 'the_content');
    }

    /**
     * Check if native wp lazy load option was enabled.
     *
     * @return bool
     */
    public function isWpNativeLazyLoadExist()
    {
        $exist = false;
        if (function_exists('wp_lazy_loading_enabled')) {
            $exist = true;
        }

        return $exist;
    }
}
