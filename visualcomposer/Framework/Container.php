<?php

namespace VisualComposer\Framework;

use BadMethodCallException;
use ReflectionMethod;
use VisualComposer\Framework\Illuminate\Support\Traits\Container as ContainerTrait;

/**
 * Class Container.
 */
abstract class Container
{
    use ContainerTrait;

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
                throw new BadMethodCallException('method is not callable');
            }
            $func = [$this, $method];
            $inner = true;
        }

        $dependencies = $this->getMethodDependencies(
            $this->getCallReflector($func),
            $parameters
        );

        if ($inner) {
            $reflectionMethod = new ReflectionMethod($this, $method);
            if (!$reflectionMethod->isPublic()) {
                // TODO: Check for correct.
                $reflectionMethod->setAccessible(true);
            }

            return $reflectionMethod->invokeArgs($this, $dependencies);
        } else {
            return call_user_func_array($func, $dependencies);
        }
    }
}
