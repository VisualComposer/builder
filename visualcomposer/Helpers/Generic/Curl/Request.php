<?php

namespace VisualComposer\Helpers\Generic\Curl;

use InvalidArgumentException;
use UnexpectedValueException;

/**
 * Class Request
 * @package VisualComposer\Helpers\Generic\Curl
 */
class Request
{
    /**
     * ENCODING_* constants, used for specifying encoding options
     */
    const ENCODING_QUERY = 0;
    /**
     *
     */
    const ENCODING_JSON = 1;
    /**
     *
     */
    const ENCODING_RAW = 2;
    /**
     * The HTTP method to use. Defaults to GET.
     *
     * @var string
     */
    private $method = 'get';
    /**
     * The URL the request is sent to.
     *
     * @var string
     */
    private $url = '';
    /**
     * The headers sent with the request.
     *
     * @var array
     */
    private $headers = [];
    /**
     * The cookies sent with the request.
     *
     * @var array
     */
    private $cookies = [];
    /**
     * POST data sent with the request.
     *
     * @var array
     */
    private $data = [];
    /**
     * Optional Curl options.
     *
     * @var array
     */
    private $options = [];
    /**
     * The type of processing to perform to encode the POST data
     *
     * @var int
     */
    private $encoding = Request::ENCODING_QUERY;

    /**
     * @param Curl $curl
     */
    public function __construct(Curl $curl)
    {
        $this->curl = $curl;
    }

    /**
     * Set the HTTP method of the request.
     *
     * @param string $method
     *
     * @return $this
     */
    public function setMethod($method)
    {
        $method = strtolower($method);

        if (!array_key_exists($method, $this->curl->getAllowedMethods())) {
            throw new InvalidArgumentException("Method [$method] not a valid/allowed HTTP method.");
        }

        $this->method = $method;

        return $this;
    }

    /**
     * Get the HTTP method of the request.
     *
     * @return string
     */
    public function getMethod()
    {
        return $this->method;
    }

    /**
     * Set the URL of the request.
     *
     * @param string $url
     *
     * @return $this
     */
    public function setUrl($url)
    {
        $this->url = $url;

        return $this;
    }

    /**
     * Get the URL of the request.
     *
     * @return string
     */
    public function getUrl()
    {
        return $this->url;
    }

    /**
     * Set a specific header to be sent with the request.
     *
     * @param string $key Can also be a string in "foo: bar" format
     * @param mixed $value
     * @param boolean $preserveCase
     *
     * @return $this
     */
    public function setHeader($key, $value = null, $preserveCase = false)
    {
        if ($value === null) {
            list($key, $value) = explode(':', $value, 2);
        }

        if (!$preserveCase) {
            $key = strtolower($key);
        }

        $key = trim($key);
        $this->headers[ $key ] = trim($value);

        return $this;
    }

    /**
     * Set the headers to be sent with the request.
     *
     * Pass an associative array - e.g. ['Content-Type' => 'application/json']
     * and the correct header formatting - e.g. 'Content-Type: application/json'
     * will be done for you when the request is sent.
     *
     * @param array $headers
     *
     * @return $this
     */
    public function setHeaders(array $headers)
    {
        $this->headers = [];

        foreach ($headers as $key => $value) {
            $this->setHeader($key, $value);
        }

        return $this;
    }

    /**
     * Get a specific header from the request.
     *
     * @param  string $key
     *
     * @return mixed
     */
    public function getHeader($key)
    {
        $key = strtolower($key);

        return isset($this->headers[ $key ]) ? $this->headers[ $key ] : null;
    }

    /**
     * Get the headers to be sent with the request.
     *
     * @return array
     */
    public function getHeaders()
    {
        return $this->headers;
    }

    /**
     * Set a cookie.
     *
     * @param string $key
     * @param string $value
     *
     * @return $this
     */
    public function setCookie($key, $value)
    {
        $this->cookies[ $key ] = $value;
        $this->updateCookieHeader();

        return $this;
    }

    /**
     * Replace the request's cookies.
     *
     * @param array $cookies
     *
     * @return $this
     */
    public function setCookies(array $cookies)
    {
        $this->cookies = $cookies;
        $this->updateCookieHeader();

        return $this;
    }

    /**
     * Read the request cookies and set the cookie header.
     *
     * @return void
     */
    private function updateCookieHeader()
    {
        $strings = [];

        foreach ($this->cookies as $key => $value) {
            $strings[] = "{$key}={$value}";
        }

        $this->setHeader('cookie', implode('; ', $strings));
    }

    /**
     * Get a specific cookie from the request.
     *
     * @param  string $key
     *
     * @return string|null
     */
    public function getCookie($key)
    {
        return isset($this->cookies[ $key ]) ? $this->cookies[ $key ] : null;
    }

    /**
     * Get all the request's cookies.
     *
     * @return string[]
     */
    public function getCookies()
    {
        return $this->cookies;
    }

    /**
     * Format the headers to an array of 'key: val' which can be passed to
     * curl_setopt.
     *
     * @return array
     */
    public function formatHeaders()
    {
        $headers = [];

        foreach ($this->headers as $key => $val) {
            if (is_string($key)) {
                $headers[] = $key . ': ' . $val;
            } else {
                $headers[] = $val;
            }
        }

        return $headers;
    }

    /**
     * Set the POST data to be sent with the request.
     *
     * @param mixed $data
     *
     * @return $this
     */
    public function setData($data)
    {
        $this->data = $data;

        return $this;
    }

    /**
     * Get the POST data to be sent with the request.
     *
     * @return array
     */
    public function getData()
    {
        return $this->data;
    }

    /**
     * Set the encoding to use on the POST data, and (possibly) associated Content-Type headers
     *
     * @param int $encoding a Request::ENCODING_* constant
     *
     * @return $this
     */
    public function setEncoding($encoding)
    {
        $encoding = intval($encoding);

        if (static::ENCODING_QUERY !== $encoding
            && static::ENCODING_JSON !== $encoding
            && static::ENCODING_RAW !== $encoding
        ) {
            throw new InvalidArgumentException("Encoding [$encoding] not a known Request::ENCODING_* constant");
        }

        if (static::ENCODING_JSON === $encoding && !$this->getHeader('Content-Type')) {
            $this->setHeader('Content-Type', 'application/json');
        }

        $this->encoding = $encoding;

        return $this;
    }

    /**
     * Get the current encoding which will be used on the POST data
     *
     * @return int  a Request::ENCODING_* constant
     */
    public function getEncoding()
    {
        return $this->encoding;
    }

    /**
     * Encode the POST data as a string.
     *
     * @return string
     */
    public function encodeData()
    {
        switch ($this->encoding) {
            case static::ENCODING_JSON:
                return json_encode($this->data);
            case static::ENCODING_QUERY:
                return http_build_query($this->data);
            case static::ENCODING_RAW:
                return $this->data;
            default:
                throw new UnexpectedValueException("Encoding [$this->encoding] not a known Request::ENCODING_* const");
        }
    }

    /**
     * Set a specific curl option for the request.
     *
     * @param string $key
     * @param mixed $value
     *
     * @return $this
     */
    public function setOption($key, $value)
    {
        $this->options[ $key ] = $value;

        return $this;
    }

    /**
     * Set the Curl options for the request.
     *
     * @param array $options
     *
     * @return $this
     */
    public function setOptions(array $options)
    {
        $this->options = $options;

        return $this;
    }

    /**
     * Get a specific curl option from the request.
     *
     * @param  string $key
     *
     * @return mixed
     */
    public function getOption($key)
    {
        return isset($this->options[ $key ]) ? $this->options[ $key ] : null;
    }

    /**
     * Get the Curl options for the request.
     *
     * @return array
     */
    public function getOptions()
    {
        return $this->options;
    }

    /**
     * Whether the request is JSON or not.
     *
     * @return boolean
     */
    public function isJson()
    {
        return static::ENCODING_JSON === $this->encoding;
    }

    /**
     * Send the request.
     *
     * @return Response
     */
    public function send()
    {
        return $this->curl->sendRequest($this);
    }
}
