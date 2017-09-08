<?php

namespace VisualComposer\Modules\FrontEnd;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class FrontEndController extends Container implements Module
{
    use WpFiltersActions;

    /**
     * Controller constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\FrontEnd\FrontEndController::encode */
        $this->wpAddFilter('the_content', 'encode', 1);
        /** @see \VisualComposer\Modules\FrontEnd\FrontEndController::decode */
        $this->wpAddFilter('the_content', 'decode', 10);
        /** @see \VisualComposer\Modules\FrontEnd\FrontEndController::removeOldCommentTags */
        $this->wpAddFilter('the_content', 'removeOldCommentTags');
    }

    protected function encode($content)
    {
        $content = preg_replace_callback(
            '/((<!--vcv no format-->)(.*?)(<!--vcv no format-->))/si',
            function ($matches) {
                return '<p>' . $matches[2] . base64_encode(do_shortcode($matches[3])) . $matches[4] . '</p>';
            },
            $content
        );

        return $content;
    }

    protected function decode($content)
    {
        $content = preg_replace_callback(
            '/(\<p\>(<!--vcv no format-->)(.*?)(<!--vcv no format-->)<\/p>)/si',
            function ($matches) {
                return base64_decode($matches[3]);
            },
            $content
        );

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
}
