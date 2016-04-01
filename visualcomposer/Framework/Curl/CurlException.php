<?php

namespace VisualComposer\Framework\Curl;

use RuntimeException;

/**
 * Class CurlException
 * @package VisualComposer\Framework\Curl
 */
class CurlException extends RuntimeException
{
    /**
     * The request that triggered the exception.
     *
     * @var Request
     */
    protected $request;

    /**
     * Constructor.
     *
     * @param Request|null $request
     * @param string $message
     * @param integer $code
     */
    public function __construct(Request $request, $message = '', $code = 0)
    {
        parent::__construct($message, $code);
        $this->request = $request;
    }

    /**
     * Get the request that triggered the exception.
     *
     * @return Request
     */
    public function getRequest()
    {
        return $this->request;
    }
}
