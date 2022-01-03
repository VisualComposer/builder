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

/**
 * Class FrontViewController
 * @package VisualComposer\Modules\FrontView
 */
class FrontViewController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    /**
     * Controller constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\FrontView\FrontViewController::encode */
        $this->wpAddFilter('the_content', 'encode', 1);
        /** @see \VisualComposer\Modules\FrontView\FrontViewController::decode */
        $this->wpAddFilter('the_content', 'decode', 99);
        /** @see \VisualComposer\Modules\FrontView\FrontViewController::removeOldCommentTags */
        $this->wpAddFilter('the_content', 'removeOldCommentTags');
        /** @see \VisualComposer\Modules\FrontView\FrontViewController::removeIpadMeta */
        $this->wpAddAction('admin_enqueue_scripts', 'removeIpadMeta');
        $this->addFilter('vcv:frontView:content:encode', 'encode');
        $this->addFilter('vcv:frontView:content:decode', 'decode');
    }

    /**
     * @param $content
     *
     * @return null|string|string[]
     */
    protected function encode($content)
    {
        $content = preg_replace_callback(
            '/<!--vcv no format-->(.*)<!--vcv no format-->/si',
            function ($matches) {
                $result = '<p><!--vcv no format-->' .
                    base64_encode(
                        do_shortcode(
                            (string)vcfilter(
                                'vcv:frontend:content:encode',
                                (string)$matches[1]
                            )
                        )
                    )
                    . '<!--vcv no format--></p>';

                return $result;
            },
            $content
        );

        return $content;
    }

    /**
     * @param $content
     *
     * @return null|string|string[]
     */
    protected function decode($content)
    {
        $content = preg_replace_callback(
            '/<p><!--vcv no format-->(.*)<!--vcv no format--><\/p>/si',
            function ($matches) {
                $decoded = base64_decode($matches[1], true);
                if ($decoded) {
                    return $decoded;
                }

                return $matches[1];
            },
            $content
        );

        $content = preg_replace('/<!-- \/?vcwb\/dynamicElementComment:([^--]+) -->/', '', $content);

        return $content;
    }

    /**
     * Remove old no formatting tags
     *
     * @param $content
     *
     * @return mixed
     */
    protected function removeOldCommentTags($content)
    {
        $content = str_replace(
            ['<!--vcv no formatting start-->', '<!--vcv no formatting end-->'],
            '',
            $content
        );

        return $content;
    }

    /**
     * @fix Remove scaling on mobile devices #652509233919236
     * Remove iPad meta from FE
     */
    protected function removeIpadMeta()
    {
        $this->wpRemoveAction('admin_head', '_ipad_meta');
    }
}
