<?php
namespace VisualComposer\Framework;

use Closure;
use ReflectionFunction;
use ReflectionMethod;
use ReflectionParameter;
use VisualComposer\Framework\Illuminate\Container\ContainerTrait;

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
}
