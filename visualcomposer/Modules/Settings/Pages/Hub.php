<?php

namespace VisualComposer\Modules\Settings\Pages;

use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Generic\Request;
use VisualComposer\Helpers\WordPress\Options;
use VisualComposer\Modules\Settings\Traits\Page;

/**
 * Class Hub
 * @package VisualComposer\Modules\Settings\Pages
 */
class Hub extends Container
{
    use Page;
    /**
     * @var string
     */
    protected $slug = 'vc-v-hub';
    /**
     * @var string
     */
    protected $templatePath = 'settings/pages/hub/index';

    /**
     * Authorization constructor.
     */
    public function __construct()
    {
        add_filter(
            'vc:v:settings:getPages',
            function ($pages) {
                /** @see \VisualComposer\Modules\Settings\Pages\Hub::addPage */
                return $this->call('addPage', [$pages]);
            }
        );
    }

    /**
     * @return array
     */
    public function getDataFromHub()
    {
        /** @var Options $options */
        $options = vcapp('optionsHelper');
        $token = $options->get('page-auth-token');
        if ($token) {
            // post to the API to get token
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, "http://test.account.visualcomposer.io/api/elements");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt(
                $ch,
                CURLOPT_HTTPHEADER,
                [
                    'Authorization: Bearer ' . $token,
                    'Accept: application/vnd.vc.v1+json',
                ]
            );
            $response = curl_exec($ch);
            $responseJson = json_decode($response);
            curl_close($ch);

            return $responseJson;
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
