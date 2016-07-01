<?php

namespace VisualComposer\Modules\Editors\PageEditable;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Nonce;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class Controller.
 */
class Controller extends Container implements Module
{
    use WpFiltersActions;

    /**
     * Controller constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\PageEditable\Controller::templateRedirect */
        $this->wpAddAction(
            'template_redirect',
            'templateRedirect'
        );
    }

    private function templateRedirect()
    {
        /** @see \VisualComposer\Modules\Editors\PageEditable\Controller::isPageEditable */
        if ($this->call('isPageEditable')) {
            /** @see \VisualComposer\Modules\Editors\PageEditable\Controller::buildPageEditable */
            $this->wpAddFilter('show_admin_bar', '__return_false');
            $this->call('buildPageEditable');
        }
    }

    /**
     * @param \VisualComposer\Helpers\Request $request
     * @param \VisualComposer\Helpers\Nonce $nonce
     *
     * @return bool
     */
    private function isPageEditable(Request $request, Nonce $nonce)
    {
        return ($request->exists('vcv-editable')
            && $request->exists('vcv-nonce')
            && $nonce->verifyAdmin($request->input('vcv-nonce')));
    }

    private function buildPageEditable()
    {
        $this->wpAddAction(
            'the_post',
            'addTheContentFilteringForPost',
            9999 // Do with high weight - when all other actions is done
        );
    }

    private function addTheContentFilteringForPost()
    {
        remove_all_filters('the_content');
        $this->wpAddFilter(
            'the_content',
            function () {
                return vcview('editor/pageEditable/pageEditable.php');
            }
        );
    }
}
