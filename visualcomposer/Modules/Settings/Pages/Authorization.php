<?php

namespace VisualComposer\Modules\Settings\Pages;

use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Generic\Request;
use VisualComposer\Helpers\WordPress\Options;
use VisualComposer\Modules\Settings\Traits\Page;

/**
 * Class Authorization
 * @package VisualComposer\Modules\Settings\Pages
 */
class Authorization extends Container
{
    use Page;
    protected $slug = 'vc-v-auth';
    protected $templatePath = 'settings/pages/auth/index';

    public function __construct()
    {
        add_filter(
            'vc:v:settings:getPages',
            function ($pages) {
                return $this->call('addPage', [$pages]);
            }
        );

        add_action(
            'vc:v:ajax:loader:api',
            function () {
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

    private function handleApiRequest(Request $request, Options $options)
    {
        if ($request->exists('code')) {
            // post to the API to get token
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, "http://test.account.visualcomposer.io/token");
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);
            $data = http_build_query(
                [
                    'code' => $request->input('code'),
                    'grant_type' => 'authorization_code',
                    'client_secret' => 'pSGoYIIXOz0qGh0cpgKHCHksA1nd8g3GnC07ybKj',
                    'redirect_uri' => 'http://wp-test.dev/wp-content/plugins/vc-five/ajax.php?action=api',
                    'client_id' => 'pasha-test',
                ]
            );
            curl_setopt(
                $ch,
                CURLOPT_POSTFIELDS,
                $data
            );
            $response = curl_exec($ch);
            $responseJson = json_decode($response);
            if (!curl_errno($ch) && $responseJson->access_token) {
                $options->set('page-auth-state', 1)->set('page-auth-code', $request->input('code'))->set(
                    'page-auth-token',
                    $responseJson->access_token
                );
                // redirect to settings:
                curl_close($ch);
                wp_redirect(self_admin_url('admin.php?page=vc-v-auth'));
            } else {
                curl_close($ch);
                wp_redirect(self_admin_url('admin.php?page=vc-v-auth&failed=true'));
            }
        }
    }

    public function isAuthorized()
    {
        return vcapp('optionsHelper')->get('page-auth-state', 0) > 0;
    }
}
