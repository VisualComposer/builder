<?php

namespace VisualComposer\Modules\Elements;

use vierbergenlars\SemVer\version;
use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Events;
use VisualComposer\Helpers\License as LicenseHelper;
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
     *
     * @param Events $events
     */
    public function __construct(Events $events)
    {
        $this->events = $events;

        $events->listen('vcv:licenseController:activation', [$this, 'onLicenseActivation']);

        add_action(
            'wp_ajax_vcv:initDefaultElements',
            function () {
                $optionsHelper = vchelper('Options');

                if ($optionsHelper->get('elements-downloading')) {
                    $response = ['status' => false, 'error' => __('Elements are already being installed', 'vc5')];
                    wp_send_json($response);
                }

                if ($optionsHelper->get('elements-downloaded')) {
                    $response = ['status' => false, 'error' => __('Elements are already installed', 'vc5')];
                    wp_send_json($response);
                }

                $optionsHelper->set('elements-downloading', true);

                /** @see \VisualComposer\Modules\Elements\Controller::initDefaultElements */
                $installed = $this->call('initDefaultElements');

                $optionsHelper->set('elements-downloading', false);

                if ($installed === false) {
                    $response = ['status' => false, 'error' => __('Something went wrong', 'vc5')];
                } else {
                    $response = ['status' => true, 'installed' => $installed];
                }

                wp_send_json($response);
            }
        );
    }

    /**
     * @param bool $status
     * @param array $response
     *
     * @return void
     */
    public function onLicenseActivation($status, $response)
    {
        if (!$status) {
            return;
        }

        /** @var \VisualComposer\Helpers\Options $options */
        $optionsHelper = vchelper('Options');
        $optionsHelper->set('elements-downloaded', false);
    }

    /**
     * Update all elements that can be updated.
     *
     * @retun int Number of elements updated.
     */
    private function updateAllElements()
    {
        /** @see \VisualComposer\Modules\Elements\Controller::getUpdatableElements */
        $elements = $this->call('getUpdatableElements');

        $count = 0;
        foreach ($elements as $element) {
            /** @see \VisualComposer\Modules\Elements\Controller::updateElement */
            $success = $this->call('updateElement', [$element]);

            if ($success) {
                $count++;
            }
        }

        return $count;
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

            if (!$availableVersion || version::lte($availableVersion, $element['version'])) {
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
     * @param Options $options
     */
    private function setElements($elements, Options $options)
    {
        $options->set(self::$elementsKeyOption, $elements);
    }

    /**
     * Set element data.
     *
     * @param string $tag
     * @param array $data
     */
    private function setElement($tag, $data)
    {
        /** @see \VisualComposer\Modules\Elements\Controller::getElements */
        $elements = $this->call('getElements');

        $elements[ $tag ] = $data;

        /** @see \VisualComposer\Modules\Elements\Controller::setElements */
        $this->call('setElements', [$elements]);
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
     * @param bool $create
     *
     * @return bool|string
     */
    private function getUploadsDir($create = true)
    {
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        WP_Filesystem();

        $uploadDir = wp_upload_dir();

        $destinationDir = $uploadDir['basedir'] . '/vcwb/';

        if (!is_dir($destinationDir) && $create && !mkdir($destinationDir)) {
            return false;
        }

        return $destinationDir;
    }

    /**
     * Download default elements and save them into DB.
     *
     * @param Options $options
     *
     * @return int|bool Number of installed elements or false.
     */
    private function initDefaultElements(Options $options)
    {
        /** @see \VisualComposer\Modules\Elements\Controller::getUploadsDir */
        $destinationDir = $this->call('getUploadsDir');

        if (!$destinationDir) {
            return false;
        }

        /** @see \VisualComposer\Modules\Elements\Controller::fetchDefaultElements */
        $defaultElements = $this->call('fetchDefaultElements');

        if ($defaultElements === false) {
            return false;
        }

        /** @see \VisualComposer\Modules\Elements\Controller::getElements */
        $elements = (array)$this->call('getElements');

        foreach ($defaultElements as $newElement) {
            /** @see \VisualComposer\Modules\Elements\Controller::downloadElement */
            if (!$this->call('downloadElement', [$newElement['tag'], $destinationDir])) {
                return false;
            }

            $data = [
                'name' => $newElement['name'],
                'tag' => $newElement['tag'],
                'version' => $newElement['version'],
            ];

            $elements[ $newElement['tag'] ] = $data;
        }

        /** @see \VisualComposer\Modules\Elements\Controller::setElements */
        $this->call('setElements', [$elements]);

        $options->set('elements-downloaded', true);

        return count($defaultElements);
    }

    /**
     * @param LicenseHelper $licenseHelper
     *
     * @return array|bool
     */
    private function fetchDefaultElements(LicenseHelper $licenseHelper)
    {
        $licenseType = $this->call([$licenseHelper, 'getType']);

        $url = '/elements/default/' . $licenseType;

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
     *
     * @return array|bool|string False if request failed
     */
    private function makeApiRequest($path)
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

        return json_decode($response['body'], true);
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
        $response = $this->makeApiRequest('/elements/' . $tag . '/download');

        if ($response === false) {
            return false;
        }

        $downloadUrl = $response['data']['download_url'];

        $contents = wp_remote_fopen($downloadUrl);

        if ($contents === false) {
            return false;
        }

        $destinationFile = $destination . $tag . '.zip';

        $success = file_put_contents($destinationFile, $contents);

        if ($success === false) {
            return false;
        }

        $destinationDir = $destination . $tag;

        $success = unzip_file($destinationFile, $destinationDir);

        unlink($destinationFile);

        return $success === true;
    }

    /**
     * @param array $element
     * @param bool $force If true, update even if versions are the same.
     *
     * @return bool
     */
    private function updateElement($element, $force = false)
    {
        /** @see \VisualComposer\Modules\Elements\Controller::fetchElementVersion */
        $availableVersion = $this->call('fetchElementVersion', [$element['tag']]);

        if (!$force && version::lte($availableVersion, $element['version'])) {
            return false;
        }

        /** @see \VisualComposer\Modules\Elements\Controller::getUploadsDir */
        $destinationDir = $this->call('getUploadsDir');

        if (!$destinationDir) {
            return false;
        }

        /** @see \VisualComposer\Modules\Elements\Controller::downloadElement */
        if (!$this->call('downloadElement', [$element['tag'], $destinationDir])) {
            return false;
        }

        $element['version'] = $availableVersion;
        unset($element['availableVersion']);

        /** @see \VisualComposer\Modules\Elements\Controller::setElement */
        $this->call('setElement', [$element['tag'], $element]);

        return true;
    }
}
