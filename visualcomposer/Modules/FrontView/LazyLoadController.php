<?php

namespace VisualComposer\Modules\FrontView;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use DOMDocument;
use DOMXPath;
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

        $this->wpAddFilter('the_content', 'removeFromDesignOptions', 100);

        $this->wpAddFilter('the_content', 'removeFromElements', 100);
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
            'key' => 'vcvGlobalLazyLoadOption',
            'value' => $optionsHelper->get('settings-lazy-load-enabled'),
            'type' => 'variable',
        ];

        return $variables;
    }

    /**
     * Remove lazy load functionality from vc elements.
     *
     * @param null|string|string[] $content
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return null|string|string[]
     */
    protected function removeFromElements($content, Options $optionsHelper)
    {
        if ($this->isGlobalLazyLoad($optionsHelper)) {
            return $content;
        }

        $dom = new DOMDocument();
        // phpcs:ignore
        @ $dom->loadHTML($content);
        $xpath = new DOMXPath($dom);

        $classname = "vcv-lozad";
        $nodes = $xpath->query("//*[contains(@class, '$classname')]");

        foreach ($nodes as $node) {
            // image
            $srcLazyImage = $node->getAttribute('data-src');
            if ($srcLazyImage) {
                $node->removeAttribute('data-src');
                $node->setAttribute('src', $srcLazyImage);
            }

            // video
            $node = $node->childNodes->item(0);
            if ($node) {
                $srcLazyVideo = $node->getAttribute('data-src');
                if ($srcLazyVideo) {
                    $node->removeAttribute('data-src');
                    $node->setAttribute('src', $srcLazyVideo);
                }
            }
        }

        $modifyingContent = $dom->saveHTML();

        if ($modifyingContent) {
            $content = $modifyingContent;
        }

        return $content;
    }

    /**
     * Remove lazy load functionality from post content for design options.
     *
     * @param null|string|string[] $content
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return null|string|string[]
     */
    protected function removeFromDesignOptions($content, Options $optionsHelper)
    {
        if ($this->isGlobalLazyLoad($optionsHelper)) {
            return $content;
        }

        $dom = new DOMDocument();
        // phpcs:ignore
        @ $dom->loadHTML($content);
        $xpath = new DOMXPath($dom);

        $nodes = $xpath->query('//*[@data-vce-lozad]');

        foreach ($nodes as $node) {
            $node->removeAttribute('data-vce-lozad');
            $node->removeAttribute('style');

            $backgroundSrcAll = $node->getAttribute('data-vce-background-image-all');
            if ($backgroundSrcAll) {
                $node->removeAttribute('data-vce-background-image-all');
                $node->setAttribute('style', 'background-image: url("' . $backgroundSrcAll . '");');
            } else {
                $screenList = ['xl', 'lg', 'md', 'sm', 'xs'];

                foreach ($screenList as $screenSize) {
                    $backgroundSrc = $node->getAttribute('data-vce-background-image-' . $screenSize);
                    if ($backgroundSrc) {
                        break;
                    }
                }

                foreach ($screenList as $screenSize) {
                    $node->removeAttribute('data-vce-background-image-' . $screenSize);
                }

                $node->setAttribute('style', 'background-image: url("' . $backgroundSrc . '");');
            }
        }

        $modifyingContent = $dom->saveHTML();

        if ($modifyingContent) {
            $content = $modifyingContent;
        }

        return $content;
    }

    /**
     * Check if global lazy load option active.
     *
     * @param Options $optionsHelper
     *
     * @return bool
     */
    protected function isGlobalLazyLoad(Options $optionsHelper)
    {
        $isGlobalLazyOption = $optionsHelper->get('settings-lazy-load-enabled');

        if ($isGlobalLazyOption) {
            return true;
        }

        return false;
    }
}
