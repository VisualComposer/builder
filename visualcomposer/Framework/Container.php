<?php
namespace VisualComposer\Framework;

use Closure;
use ReflectionFunction;
use ReflectionMethod;
use ReflectionParameter;

abstract class Container
{
    /**
     * Call the given callback and inject its dependencies.
     *
     * @param  $method
     * @param  array $parameters
     *
     * @return mixed
     */
    protected function call($method, array $parameters = [])
    {
        $func = $method;
        $inner = false;
        if (!is_callable($method)) {
            if (is_array($method)) {
                throw new \BadMethodCallException('method is not callable');
            }
            $func = [$this, $method];
            $inner = true;
        }

        $dependencies = $this->getMethodDependencies(
            $func,
            $parameters
        );

        if ($inner) {
            // @todo check for correct
            $reflectionMethod = new ReflectionMethod($this, $method);
            $reflectionMethod->setAccessible(true);

            return $reflectionMethod->invokeArgs($this, $dependencies);
        } else {
            return call_user_func_array($func, $dependencies);
        }
    }

    /**
     * Get all dependencies for a given method.
     *
     * @param  callable|string $callback
     * @param  array $parameters
     *
     * @return array
     */
    protected function getMethodDependencies($callback, $parameters = [])
    {
        $dependencies = [];

        foreach ($this->getCallReflector($callback)->getParameters() as $key => $parameter) {
            $this->addDependencyForCallParameter($parameter, $parameters, $dependencies);
        }

        return array_merge($dependencies, $parameters);
    }

    /**
     * Get the proper reflection instance for the given callback.
     *
     * @param  callable|string $callback
     *
     * @return \ReflectionFunctionAbstract
     */
    protected function getCallReflector($callback)
    {
        if (is_string($callback) && strpos($callback, '::') !== false) {
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
     *
     * @return mixed
     */
    protected function addDependencyForCallParameter(ReflectionParameter $parameter, array &$parameters, &$dependencies)
    {
        if (array_key_exists($parameter->name, $parameters)) {
            $dependencies[] = $parameters[ $parameter->name ];

            unset($parameters[ $parameter->name ]);
        } elseif ($parameter->getClass()) {
            $dependencies[] = vcapp()->make($parameter->getClass()->name);
        } elseif ($parameter->isDefaultValueAvailable()) {
            $dependencies[] = $parameter->getDefaultValue();
        }
    }
}
