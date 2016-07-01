<?php

namespace VisualComposer\Modules\Settings\Pages;

use Exception;
use VisualComposer\Framework\Application;
use VisualComposer\Framework\Container;
//use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Url;
use VisualComposer\Modules\Settings\Traits\Page;

/**
 * Class Authorization.
 */
class Authorization extends Container/* implements Module */
{
    use Page;
    use EventsFilters;

    /**
     * @var \VisualComposer\Framework\Application
     */
    protected $app;

    /**
     * @var string
     */
    protected $slug = 'vcv-auth';

    /**
     * @var string
     */
    protected $templatePath = 'settings/pages/auth/index';

    /**
     * Authorization constructor.
     *
     * @param \VisualComposer\Framework\Application $app
     */
    public function __construct(Application $app)
    {
        $this->app = $app;

        /** @see \VisualComposer\Modules\Settings\Pages\Authorization::addPage */
        $this->addFilter(
            'vcv:settings:getPages',
            'addPage',
            40
        );

        /** @see \VisualComposer\Modules\Settings\Pages\Authorization::handleApiRequest */
        /*$this->addFilter(
            'vcv:ajax:api',
            'handleApiRequest'
        );*/
    }

    protected function beforeRender(Token $tokenHelper)
    {
        /** @see \VisualComposer\Helpers\Token::isRegistered */
        if (!$this->app->call([$tokenHelper, 'isRegistered'])) {
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
                $this->app->call([$tokenHelper, 'registerSite'], [$body]);
            } else {
                // TODO: Handle error.
                throw new Exception('HTTP request for registering app failed.');
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
     * @return bool
     */
    private function handleApiRequest(Request $request, Token $tokenHelper)
    {
        if ($request->exists('code')) {
            // post to the API to get token
            /** @see \VisualComposer\Helpers\Token::generateToken */
            $token = $this->app->call([$tokenHelper, 'generateToken'], [$request->input('code')]);
            if ($token) {
                wp_redirect(self_admin_url('admin.php?page=' . $this->slug));
            } else {
                wp_redirect(self_admin_url('admin.php?page=' . $this->slug . '&failed=true'));
            }
        }

        return true;
    }

    /**
     * @return bool
     */
    public function isAuthorized()
    {
        /** @var Options $optionsHelper */
        $optionsHelper = vchelper('Options');

        return (int)$optionsHelper->get('page-auth-state', 0) > 0;
    }
}
