<?php

namespace VisualComposer\Modules\Api;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Helpers\Traits\EventsFilters;

trait ApiRegisterTrait
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
        if ($name === $this->apiHook) {
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
        if (in_array($name, $this->publicMethods)) {
            return $this->call($name, $arguments);
        } else {
            throw new \Exception('API: ' . __CLASS__ . ' Method ' . esc_attr(strip_tags($name)) . ' is not public!');
        }

        return false;
    }
}
