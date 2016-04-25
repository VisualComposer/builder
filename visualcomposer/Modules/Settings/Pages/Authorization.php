<?php

namespace VisualComposer\Modules\Settings\Pages;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Url;
use VisualComposer\Modules\Settings\Traits\Page;

/**
 * Class Authorization
 */
class Authorization extends Container implements Module
{
    use Page;
    /**
     * @var string
     */
    protected $slug = 'vcv-auth';
    /**
     * @var string
     */
    protected $templatePath = 'settings/pages/auth/index';

    /**
     * Authorization constructor
     */
    public function __construct()
    {
        add_filter(
            'vcv:settings:getPages',
            function ($pages) {
                /** @see \VisualComposer\Modules\Settings\Pages\Authorization::addPage */
                return $this->call('addPage', [$pages]);
            },
            40
        );

        add_action(
            'vcv:ajax:loader:api',
            function () {
                /** @see \VisualComposer\Modules\Settings\Pages\Authorization::handleApiRequest */
                $this->call('handleApiRequest');
            }
        );
    }

    protected function beforeRender(Token $tokenHelper)
    {
        /** @see \VisualComposer\Helpers\Token::isRegistered */
        if (!vcapp()->call([$tokenHelper, 'isRegistered'])) {
            /** @var Url $urlHelper */
            $urlHelper = vchelper('Url');
            $url = $urlHelper->ajax(['vcv-action' => 'api']);
            $result = wp_remote_post(
                'http://test.account.visualcomposer.io/register-app',
                ['body' => ['url' => $url]]
            );
            if (is_array($result) && 200 === $result['response']['code']) {
                $body = json_decode($result['body'], true);
                /** @see \VisualComposer\Helpers\Token::registerSite */
                vcapp()->call([$tokenHelper, 'registerSite'], [$body]);
            } else {
                // @todo @error
            }
        }
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
     * @param \VisualComposer\Helpers\Request $request
     * @param \VisualComposer\Helpers\Token $tokenHelper
     *
     * @internal param \VisualComposer\Helpers\Options $options
     */
    private function handleApiRequest(Request $request, Token $tokenHelper)
    {
        if ($request->exists('code')) {
            // post to the API to get token
            /** @see \VisualComposer\Helpers\Token::generateToken */
            $token = vcapp()->call([$tokenHelper, 'generateToken'], [$request->input('code')]);
            if ($token) {
                wp_redirect(self_admin_url('admin.php?page=vcv-auth'));
            } else {
                wp_redirect(self_admin_url('admin.php?page=vcv-auth&failed=true'));
            }
        }
    }

    /**
     * @return bool
     */
    public function isAuthorized()
    {
        /** @var Options $optionsHelper */
        $optionsHelper = vchelper('Options');

        return $optionsHelper->get('page-auth-state', 0) > 0;
    }
}
