<?php

namespace VisualComposer\Modules\Elements;

use vierbergenlars\SemVer\version;
use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class Controller.
 */
class Controller extends Container implements Module
{
    use EventsFilters;

    /**
     * @var string
     */
    static protected $elementsKeyOption = 'elements';

    /**
     * Controller constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Elements\Controller::getElements */
        if (!$this->call('getElements')) {
            require_once(ABSPATH . 'wp-admin/includes/file.php');
            WP_Filesystem();

            $this->initDefaultElements();
        }

        /** @see \VisualComposer\Modules\Elements\Controller::getUpdatableElements */
        // $updatableElements = $this->call('getUpdatableElements');
    }

    /**
     * @return array List of elements with added 'availableVersion' key/value.
     */
    private function getUpdatableElements()
    {
        $updates = [];

        /** @see \VisualComposer\Modules\Elements\Controller::getElements */
        $elements = $this->call('getElements');

        foreach ($elements as $element) {
            /** @see \VisualComposer\Modules\Elements\Controller::fetchElementVersion */
            $availableVersion = $this->call('fetchElementVersion', [$element['tag']]);

            if (version::lte($availableVersion, $element['version'])) {
                continue;
            }

            $updates[] = array_merge(
                $element,
                [
                    'availableVersion' => $availableVersion,
                ]
            );
        }

        return $updates;
    }

    /**
     * Set elements.
     *
     * @param array $elements
     * @param \VisualComposer\Helpers\Options $options
     */
    private function setElements($elements, Options $options)
    {
        $options->set(self::$elementsKeyOption, $elements);
    }

    /**
     * Get elements.
     *
     * @param \VisualComposer\Helpers\Options $options
     *
     * @return array
     */
    private function getElements(Options $options)
    {
        return $options->get(self::$elementsKeyOption);
    }

    /**
     * @param string $path
     *
     * @return string
     */
    private function getApiUrl($path)
    {
        return VCV_ACCOUNT_URL . '/api' . $path;
    }

    /**
     * Download default elements and save them into DB.
     *
     * @return bool
     */
    private function initDefaultElements()
    {
        $uploadDir = wp_upload_dir();

        $destinationDir = $uploadDir['basedir'] . '/vcwb/';

        if (!is_dir($destinationDir) && !mkdir($destinationDir)) {
            return false;
        }

        $defaultElements = $this->fetchDefaultElements();

        if ($defaultElements === false) {
            return false;
        }

        $elements = [];

        foreach ($defaultElements as $element) {
            if (!$this->downloadElement($element['tag'], $destinationDir)) {
                return false;
            }

            $elements[] = [
                'name' => $element['name'],
                'tag' => $element['tag'],
                'version' => $element['version'],
            ];
        }

        /** @see \VisualComposer\Modules\Elements\Controller::setElements */
        $this->call('setElements', [$elements]);

        return true;
    }

    /**
     * @return array|bool
     */
    private function fetchDefaultElements()
    {
        $url = '/elements/default';

        $elements = [];

        while (true) {
            $response = $this->makeApiRequest($url);

            if ($response === false) {
                return false;
            }

            $elements = array_merge($elements, $response['data']);

            if (empty($response['meta']['pagination']['links']['next'])) {
                break;
            }

            $url = $response['meta']['pagination']['links']['next'];
        }

        return $elements;
    }

    /**
     * @param string $tag
     *
     * @return string|bool
     */
    private function fetchElementVersion($tag)
    {
        $url = '/elements/' . $tag . '/version';

        $response = $this->makeApiRequest($url);

        if ($response === false) {
            return false;
        }

        return $response['data']['version'];
    }

    /**
     * Get all neccessary headers for API request.
     *
     * @return string|bool
     */
    private function getHeaders()
    {
        /** @see \VisualComposer\Helpers\Token::getToken */
        $token = vcapp()->call([vchelper('Token'), 'getToken']);

        if (!$token) {
            return false;
        }

        return [
            'Authorization' => 'Bearer ' . $token,
            'Accept' => 'application/vnd.vc.v1+json',
        ];
    }

    /**
     * @param string $path
     * @param bool $json Whether response is in JSON format.
     *
     * @return array|bool|string False if request failed
     */
    private function makeApiRequest($path, $json = true)
    {
        $headers = $this->getHeaders();

        if (!$headers) {
            return false;
        }

        if (substr($path, 0, 4) === 'http') {
            $url = $path;
        } else {
            $url = $this->getApiUrl($path);
        }

        $args = [
            'headers' => $headers,
        ];

        $response = wp_remote_get($url, $args);

        if (is_wp_error($response) || $response['response']['code'] !== 200) {
            return false;
        }

        if ($json) {
            return json_decode($response['body'], true);
        }

        return $response['body'];
    }

    /**
     * Download and save element (directory named like its tag).
     *
     * @param string $tag
     * @param string $destination Directory where where to save extracted element.
     *
     * @return bool
     */
    private function downloadElement($tag, $destination)
    {
        $response = $this->makeApiRequest('/elements/' . $tag . '/download', false);

        if ($response === false) {
            return false;
        }

        $destinationFile = $destination . $tag . '.zip';

        $success = file_put_contents($destinationFile, $response);

        if ($success === false) {
            return false;
        }

        $destinationDir = $destination . $tag;

        $success = unzip_file($destinationFile, $destinationDir);

        unlink($destinationFile);

        return $success === true;
    }
}
