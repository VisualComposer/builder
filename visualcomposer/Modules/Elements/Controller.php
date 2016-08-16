<?php

namespace VisualComposer\Modules\Elements;

//use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class Controller.
 */
class Controller extends Container /*implements Module*/
{
    use EventsFilters;

    /**
     * Controller constructor.
     */
    public function __construct()
    {
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        WP_Filesystem();
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
     * @return bool
     */
    private function downloadDefaultElements()
    {
        $upload_dir = wp_upload_dir();

        $destination_dir = $upload_dir['basedir'] . '/vcwb/';

        if (!is_dir($destination_dir) && !mkdir($destination_dir)) {
            return false;
        }

        $elements = $this->getDefaultElements();

        foreach ($elements as $element) {
            if (!$this->downloadElement($element['tag'], $destination_dir)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @return array|bool
     */
    private function getDefaultElements()
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
     * Get all neccessary headers for API request.
     *
     * @return string|bool
     */
    private function getHeaders()
    {
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

        $destination_file = $destination . $tag . '.zip';

        $success = file_put_contents($destination_file, $response);

        if ($success === false) {
            return false;
        }

        $destination_dir = $destination . $tag;

        $success = unzip_file($destination_file, $destination_dir);

        unlink($destination_file);

        return $success === true;
    }
}
