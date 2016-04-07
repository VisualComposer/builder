<?php

namespace VisualComposer\Modules\Settings\Pages;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Curl\Curl;
use VisualComposer\Helpers\Token;
use VisualComposer\Modules\Settings\Traits\Page;

/**
 * Class Hub
 */
class Hub extends Container implements Module
{
    use Page;
    /**
     * @var string
     */
    protected $slug = 'vcv-hub';
    /**
     * @var string
     */
    protected $templatePath = 'settings/pages/hub/index';

    /**
     * Authorization constructor
     */
    public function __construct()
    {
        add_filter(
            'vcv:settings:getPages',
            function ($pages) {
                /** @see \VisualComposer\Modules\Settings\Pages\Hub::addPage */
                return $this->call('addPage', [$pages]);
            }
        );
    }

    /**
     * @param \VisualComposer\Helpers\Token $tokenHelper
     * @param \VisualComposer\Helpers\Curl\Curl $curl
     *
     * @return array
     */
    public function getDataFromHub(Token $tokenHelper, Curl $curl)
    {
        $token = $tokenHelper->getToken();
        if ($token) {
            // post to the API to get token
            $response = json_decode(
                $curl->newRequest('get', 'http://test.account.visualcomposer.io/api/elements')->setHeaders(
                    [
                        'Authorization' => 'Bearer ' . $token,
                        'Accept' => 'application/vnd.vc.v1+json',
                    ]
                )->send()->body
            );

            return $response;
        } else {
            return ['status' => 'failed', 'message' => 'invalid token&code'];
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
            'title' => __('HUB', 'vc5'),
            'controller' => $this,
        ];

        return $pages;
    }
}
