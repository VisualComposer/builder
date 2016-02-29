<?php
namespace VisualComposer\Modules\Editors\Frontend;

use Illuminate\Http\Request;
use VisualComposer\Helpers\WordPress\Nonce;
use VisualComposer\Modules\System\Container;

class PageEditable extends Container
{
    public function __construct()
    {
        add_action('template_redirect', function () {
            if ($this->call('isPageEditable')) {
                $this->call('buildPageEditable');
            }
        });
    }

    private function isPageEditable(Request $request)
    {
        if ($request->has('vc-v-editable')
            && $request->has('vc-v-nonce')
            && Nonce::verifyAdmin($request->input('vc-v-nonce'))
        ) {
            return true;
        }

        return false;
    }

    private function buildPageEditable()
    {
        add_action('the_post', function () {
            remove_all_filters('the_content');
            add_filter('the_content', function () {
                return '<span id="vc-v-frontend-editable-placeholder">Content Placeholder</span>';
            });
        }, 9999); // after all the_post actions ended
    }
}
