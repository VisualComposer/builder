<?php

namespace VisualComposer\Framework;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use BadMethodCallException;
use ReflectionFunction;
use ReflectionMethod;
use VisualComposer\Framework\Illuminate\Support\Traits\Php8Container as Php8ContainerTrait;

/**
 * Class Container.
 */
abstract class Container
{
    use Php8ContainerTrait;

    /**
     * Call the given callback and inject its dependencies.
     *
     * @param  $method
     * @param array $parameters
     *
     * @return mixed
     * @throws \ReflectionException
     * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
     */
    protected function call($method, array $parameters = [])
    {
        $func = $method;
        $inner = false;
        if (!is_callable($method) || (is_string($method) && method_exists($this, $method))) {
            if (is_array($method)) {
                throw new BadMethodCallException('method is not callable');
            }
            if (is_string($method) && vchelper('Str')->contains($method, '::')) {
                // Used in ContainerReflectorModule test for class::method call
                $func = explode('::', $method);
            } else {
                $func = [$this, $method];
                $inner = true;
            }
        }
        /** @var ReflectionMethod|ReflectionFunction $reflector */
        $reflector = $this->getCallReflector($func);
        if (self::checkIsPhp8Enabled()) {
            $dependencies = $this->php8getMethodDependencies($reflector, $parameters);
        } else {
            $dependencies = $this->getMethodDependencies($reflector, $parameters);
        }

        if ($inner) {
            $reflectionMethod = new ReflectionMethod($this, $method);
            if (!$reflectionMethod->isPublic()) {
                $reflectionMethod->setAccessible(true);
            }

            return $reflectionMethod->invokeArgs($this, array_values($dependencies));
        }

        if ($func instanceof \Closure) {
            return $func(...array_values($dependencies));
        }

        if ($reflector instanceof ReflectionFunction) {
            return $reflector->invokeArgs(array_values($dependencies));
        }

        return $reflector->invokeArgs(vcapp($reflector->class), array_values($dependencies));
    }
}
