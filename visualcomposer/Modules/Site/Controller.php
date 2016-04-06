<?php

namespace VisualComposer\Modules\Site;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Templates;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Url;
use VisualComposer\Framework\Illuminate\Contracts\Events\Dispatcher;
use VisualComposer\Helpers\Access\CurrentUser\Access as CurrentUserAccess;
use VisualComposer\Framework\Container;

/**
 * Class Controller
 * @package VisualComposer\Modules\Site
 */
class Controller extends Container implements Module
{
    /**
     * @var bool
     */
    protected static $jsScriptRendered = false;
    /**
     * @var \VisualComposer\Framework\Illuminate\Contracts\Events\Dispatcher
     */
    protected $event;

    /**
     * PageFrontController constructor.
     *
     * @param \VisualComposer\Framework\Illuminate\Contracts\Events\Dispatcher $event
     */
    public function __construct(Dispatcher $event)
    {
        $this->event = $event;
        add_action(
            'wp_head',
            function () {
                /** @see \VisualComposer\Modules\Site\Controller::appendScript */
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
                /** @see \VisualComposer\Modules\Site\Controller::addEditPostLink */
                return $this->call('addEditPostLink', ['link' => $link]);
            }
        );
    }

    /**
     * @param $link
     *
     * @param \VisualComposer\Helpers\Access\CurrentUser\Access $currentUserAccess
     * @param \VisualComposer\Helpers\Url $urlHelper
     *
     * @return string
     * @throws \Exception
     */
    private function addEditPostLink(
        $link,
        CurrentUserAccess $currentUserAccess,
        Url $urlHelper
    ) {
        if ($currentUserAccess->part('frontend_editor', true)->can()->get(true)) {
            $url = $urlHelper->ajax(
                [
                    'vcv-action' => 'frontend',
                    'vcv-source-id' => get_the_ID(),
                ]
            );
            $link .= ' <a href="' . $url . '">' . __('Edit with VC5', 'vc5') . '</a>';
            if (!self::$jsScriptRendered) {
                /** @see \VisualComposer\Modules\Site\Controller::outputScripts */
                $link .= $this->call('outputScripts');
                self::$jsScriptRendered = true;
            }

        }

        return $link;
    }

    /**
     * Output less.js script to page header
     *
     * @param \VisualComposer\Helpers\Url $urlHelper
     */
    private function appendScript(Url $urlHelper)
    {
        echo '<script src="' . $urlHelper->to('node_modules/less/dist/less.js') . '" data-async="true"></script>';
    }

    /**
     * Output used assets
     *
     * @param \VisualComposer\Helpers\Templates $templatesHelper
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return string
     */
    private function outputScripts(Templates $templatesHelper, Options $optionsHelper)
    {
        $scriptsBundle = $optionsHelper->get('scriptsBundle');
        $stylesBundle = $optionsHelper->get('stylesBundle');
        $args = compact('scriptsBundle', 'stylesBundle');

        return $templatesHelper->render('site/frontend-scripts-styles', $args, false);
    }
}
