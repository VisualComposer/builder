<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Class Request.
 */
class Request implements Helper
{
    /**
     * @var null
     */
    protected $data = null;

    /**
     * Determine if the request contains a given input item key.
     *
     * @param string|array $key
     *
     * @return bool
     */
    public function exists($key)
    {
        $keys = is_array($key) ? $key : func_get_args();

        $input = $this->input();

        foreach ($keys as $value) {
            if (!array_key_exists($value, $input)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @param $data
     */
    public function setData($data)
    {
        $this->data = $data;
    }

    public function all()
    {
        $allowCodeStyle = false;
        if ($allowCodeStyle) {
            // this is necessary to allow usage of code style for global request variables
            check_admin_referer('vcv-nonce');
        }
        if (is_null($this->data)) {
            // @codingStandardsIgnoreLine
            $this->data = array_replace_recursive($_POST, $_GET, $_REQUEST);
        }

        return $this->data;
    }

    /**
     * Retrieve an input item from the request.
     *
     * @param string $key
     * @param mixed $default
     *
     * @return string|array
     */
    public function input($key = null, $default = null)
    {
        $allowCodeStyle = false;
        if ($allowCodeStyle) {
            // this is necessary to allow usage of code style for global request variables
            check_admin_referer('vcv-nonce');
        }
        if (is_null($this->data)) {
            // @codingStandardsIgnoreLine
            $this->data = array_replace_recursive($_POST, $_GET, $_REQUEST);
        }
        if (is_null($key)) {
            return $this->data;
        }

        return array_key_exists($key, $this->data) ? $this->data[ $key ] : $default;
    }

    /**
     * Retrieve an input item from the request.
     *
     * @param string $key
     * @param mixed $default
     *
     * @return string|array
     */
    public function inputJson($key = null, $default = null)
    {
        $value = $this->input($key, $default);
        $value = json_decode(rawurldecode($value), true);

        return $value;
    }

    /**
     * Get an input element from the request.
     *
     * @param string $key
     *
     * @return mixed
     */
    public function __get($key)
    {
        if ($this->exists($key)) {
            return $this->input($key);
        }

        return null;
    }

    public function isAjax()
    {
        return $this->exists(VCV_AJAX_REQUEST);
    }
}
