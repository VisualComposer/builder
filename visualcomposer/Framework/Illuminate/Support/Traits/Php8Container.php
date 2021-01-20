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
trait Php8Container
{
    use Container;

    protected static $isPhpEightEnabled;

    /**
     * Get all dependencies for a given method.
     *
     * @param \ReflectionFunctionAbstract $callback
     * @param array $parameters
     *
     * @return array
     */
    protected function php8getMethodDependencies($callback, $parameters = [])
    {
        $dependencies = [];
        $assoc = $this->hasStringKeys($parameters);

        $callbackParameters = $callback->getParameters();
        foreach ($callbackParameters as $key => $parameter) {
            $this->php8addDependencyForCallParameter($parameter, $parameters, $dependencies, $assoc);
        }

        return array_merge($dependencies, array_values($parameters));
    }

    /**
     * Get the dependency for the given call parameter.
     *
     * @param \ReflectionParameter $parameter
     * @param array $parameters
     * @param array $dependencies
     * @param bool $assoc
     */
    protected function php8addDependencyForCallParameter(
        ReflectionParameter $parameter,
        array &$parameters,
        &$dependencies,
        $assoc
    ) {
        if ($assoc || empty($parameters)) {
            if (array_key_exists($paramName = $parameter->getName(), $parameters)) {
                $dependencies[] = $parameters[ $paramName ];

                unset($parameters[ $paramName ]);
            } elseif (!is_null($className = self::getParameterClassName($parameter))) {
                if (array_key_exists($className, $parameters)) {
                    $dependencies[] = $parameters[ $className ];

                    unset($parameters[ $className ]);
                } else {
                    $dependencies[] = vcapp()->make($className);
                }
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
            if (!is_null($className = self::getParameterClassName($parameter))) {
                $value = reset($parameters);
                if (is_object($value)) {
                    $data = get_class($value) === $className || is_subclass_of($value, $className);
                    if ($data) {
                        $data = array_shift($parameters);
                        $dependencies[] = $data;
                    } else {
                        $dependencies[] = vcapp()->make($className);
                    }
                } else {
                    $dependencies[] = vcapp()->make($className);
                }
            } else {
                $data = array_shift($parameters);
                $dependencies[] = $data;
            }
        }
    }

    /**
     * Get the class name of the given parameter's type, if possible.
     *
     * From Reflector::getParameterClassName() in Illuminate\Support.
     *
     * @param \ReflectionParameter $parameter
     *
     * @return string|null
     */
    public static function getParameterClassName($parameter)
    {
        $type = $parameter->getType();

        if (!$type instanceof \ReflectionNamedType || $type->isBuiltin()) {
            return;
        }

        $name = $type->getName();
        if (!is_null($class = $parameter->getDeclaringClass())) {
            if ($name === 'self') {
                return $class->getName();
            }

            if ($name === 'parent' && $parent = $class->getParentClass()) {
                return $parent->getName();
            }
        }

        return $name;
    }

    public static function checkIsPhp8Enabled()
    {
        if (is_null(self::$isPhpEightEnabled)) {
            self::$isPhpEightEnabled = version_compare(PHP_VERSION, '8.0.0') >= 0;
        }

        return self::$isPhpEightEnabled;
    }
}
