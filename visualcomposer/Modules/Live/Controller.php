<?php

namespace VisualComposer\Modules\Live;

use VisualComposer\Helpers\Generic\Templates;
use VisualComposer\Helpers\WordPress\Options;
use VisualComposer\Helpers\Generic\Url;
use VisualComposer\Framework\Illuminate\Contracts\Events\Dispatcher;
use VisualComposer\Modules\Access\CurrentUser\Access as CurrentUserAccess;
use VisualComposer\Framework\Container;

class Controller extends Container
{
    /**
     * @var bool
     */
    protected static $jsScriptRendered = false;
    /**
     * @var \Illuminate\Contracts\Events\Dispatcher
     */
    protected $event;

    /**
     * PageFrontController constructor.
     *
     * @param \Illuminate\Contracts\Events\Dispatcher $event
     */
    public function __construct(Dispatcher $event)
    {
        $this->event = $event;
        add_action(
            'wp_head',
            function () {
                $this->call('appendScript');
            }
        );

        add_action(
            'wp_enqueue_scripts',
            function () {
                wp_enqueue_script('jquery');
            }
        );

        add_filter(
            'edit_post_link',
            function ($link) {
                return $this->call('addEditPostLink', ['link' => $link]);
            }
        );
    }

    /**
     * @param $link
     *
     * @return string
     */
    private function addEditPostLink(
        $link,
        CurrentUserAccess $currentUserAccess,
        Url $urlHelper
    ) {
        if ($currentUserAccess->part('frontend_editor', true)->can()->get(true)) {
            $url = $urlHelper->ajax(
                [
                    'action' => 'frontend',
                    'vc-source-id' => get_the_ID(),
                ]
            );
            $link .= ' <a href="' . $url . '">' . __('Edit with VC5', 'vc5') . '</a>';
            if (!self::$jsScriptRendered) {
                $link .= $this->call('outputScripts');
                self::$jsScriptRendered = true;
            }

        }

        return $link;
    }

    /**
     * Output less.js script to page header
     */
    private function appendScript(Url $urlHelper)
    {
        echo '<script src="' . $urlHelper->to('node_modules/less/dist/less.js') . '" data-async="true"></script>';
    }

    /**
     * Output used assets
     *
     * @return string
     */
    private function outputScripts(Templates $templatesHelper, Options $optionsHelper)
    {
        $scriptsBundle = $optionsHelper->get('scriptsBundle', []);
        $stylesBundle = $optionsHelper->get('stylesBundle', []);
        $args = compact('scriptsBundle', 'stylesBundle');

        return $templatesHelper->render('live/frontend-scripts-styles', $args, false);
    }
}
