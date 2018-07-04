<?php

namespace VisualComposer\Modules\Elements;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class ApiController
 * @package VisualComposer\Modules\Elements
 */
class ApiController extends Container implements Module
{
    use EventsFilters;

    /**
     * ApiController constructor.
     */
    public function __construct()
    {
        $this->addFilter('vcv:api:service', 'registerApi');
    }

    /**
     * @param $name
     *
     * @return string
     */
    protected function registerApi($name)
    {
        if ($name === 'elements') {
            return __CLASS__;
        }

        return $name;
    }

    /**
     * Allow call protected methods
     *
     * @param $name
     * @param $arguments
     *
     * @return bool|mixed
     * @throws \ReflectionException
     */
    public function __call($name, $arguments)
    {
        if (in_array($name, ['add'])) {
            return $this->call($name, $arguments);
        }

        return false;
    }

    /**
     * @param $manifestPath
     * @param $elementBaseUrl
     *
     * @return bool
     */
    protected function add($manifestPath, $elementBaseUrl)
    {
        return true;
    }
}
