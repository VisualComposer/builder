<?php

namespace VisualComposer\Modules\Settings\Pages;

use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Generic\Request;
use VisualComposer\Helpers\Generic\Token;
use VisualComposer\Modules\Settings\Traits\Page;

/**
 * Class Authorization
 * @package VisualComposer\Modules\Settings\Pages
 */
class Authorization extends Container
{
    use Page;
    /**
     * @var string
     */
    protected $slug = 'vc-v-auth';
    /**
     * @var string
     */
    protected $templatePath = 'settings/pages/auth/index';

    /**
     * Authorization constructor.
     */
    public function __construct()
    {
        add_filter(
            'vcv:settings:getPages',
            function ($pages) {
                /** @see \VisualComposer\Modules\Settings\Pages\Authorization::addPage */
                return $this->call('addPage', [$pages]);
            }
        );

        add_action(
            'vcv:ajax:loader:api',
            function () {
                /** @see \VisualComposer\Modules\Settings\Pages\Authorization::handleApiRequest */
                $this->call('handleApiRequest');
            }
        );
    }

    /**
     * @param array $pages
     *
     * @return array
     */
    private function addPage($pages)
    {
        $pages[] = [
            'slug' => $this->getSlug(),
            'title' => __('Authorize Site', 'vc5'),
            'controller' => $this,
        ];

        return $pages;
    }

    /**
     * @param \VisualComposer\Helpers\Generic\Request $request
     * @param \VisualComposer\Helpers\Generic\Token $tokenHelper
     * @internal param \VisualComposer\Helpers\WordPress\Options $options
     */
    private function handleApiRequest(Request $request, Token $tokenHelper)
    {
        if ($request->exists('code')) {
            // post to the API to get token
            /** @see \VisualComposer\Helpers\Generic\Token::generateToken */
            $token = vcapp()->call([$tokenHelper, 'generateToken'], [$request->input('code')]);
            if ($token) {
                wp_redirect(self_admin_url('admin.php?page=vc-v-auth'));
            } else {
                wp_redirect(self_admin_url('admin.php?page=vc-v-auth&failed=true'));
            }
        }
    }

    /**
     * @return bool
     */
    public function isAuthorized()
    {
        return vcapp('optionsHelper')->get('page-auth-state', 0) > 0;
    }
}
