<?php

namespace VisualComposer\Framework\Illuminate\Support\Traits;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use ReflectionFunction;
use ReflectionMethod;
use ReflectionParameter;

/**
 * Class Container.
 */
trait Container
{
    /**
     * @param array $array
     *
     * @return bool
     */
    protected function hasStringKeys(array $array)
    {
        return count(array_filter(array_keys($array), 'is_string')) > 0;
    }

    /**
     * Get all dependencies for a given method.
     *
     * @param  \ReflectionFunctionAbstract $callback
     * @param  array $parameters
     *
     * @return array
     */
    protected function getMethodDependencies($callback, $parameters = [])
    {
        $dependencies = [];
        $assoc = $this->hasStringKeys($parameters);

        $callbackParameters = $callback->getParameters();
        foreach ($callbackParameters as $key => $parameter) {
            $this->addDependencyForCallParameter($parameter, $parameters, $dependencies, $assoc);
        }

        return array_merge($dependencies, $parameters);
    }

    /**
     * Get the proper reflection instance for the given callback.
     *
     * @param  callable|string $callback
     *
     * @return \ReflectionFunctionAbstract
     * @throws \ReflectionException
     */
    protected function getCallReflector($callback)
    {
        /** @var \VisualComposer\Helpers\Str $strHelper */
        $strHelper = vchelper('Str');
        if (is_string($callback) && $strHelper->contains($callback, '::')) {
            $callback = explode('::', $callback);
        }

        if (is_array($callback)) {
            return new ReflectionMethod($callback[0], $callback[1]);
        }

        return new ReflectionFunction($callback);
    }

    /**
     * Get the dependency for the given call parameter.
     *
     * @param  \ReflectionParameter $parameter
     * @param  array $parameters
     * @param  array $dependencies
     * @param  bool $assoc
     */
    protected function addDependencyForCallParameter(
        ReflectionParameter $parameter,
        array &$parameters,
        &$dependencies,
        $assoc
    ) {
        if ($assoc || empty($parameters)) {
            // first need to check if key exists
            if (array_key_exists($parameter->name, $parameters)) {
                $dependencies[] = $parameters[ $parameter->name ];
                unset($parameters[ $parameter->name ]);
            } elseif ($parameter->getClass()) {
                $dependencies[] = vcapp()->make($parameter->getClass()->name);
            } elseif ($parameter->isDefaultValueAvailable()) {
                $dependencies[] = $parameter->getDefaultValue();
            } else {
                $data = array_shift($parameters);
                $dependencies[] = $data;
            }
        } else {
            // first need check for type.
            // first($parameters) == $parameter
            /// if yes -> use [+unset]
            // if no -> inject/default
            if ($parameter->getClass()) {
                $value = reset($parameters);
                if (is_object($value)) {
                    $name = $parameter->getClass()->name;
                    $data = get_class($value) == $name || is_subclass_of($value, $name);
                    if ($data) {
                        $data = array_shift($parameters);
                        $dependencies[] = $data;
                    } else {
                        $dependencies[] = vcapp()->make($parameter->getClass()->name);
                    }
                } else {
                    $dependencies[] = vcapp()->make($parameter->getClass()->name);
                }
            } else {
                $data = array_shift($parameters);
                $dependencies[] = $data;
            }
        }
    }
}
