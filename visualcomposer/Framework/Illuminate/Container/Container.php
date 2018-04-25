<?php

namespace VisualComposer\Framework\Illuminate\Container;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use Closure;
use ReflectionClass;
use VisualComposer\Framework\Illuminate\Support\Traits\Container as ContainerTrait;
use VisualComposer\Framework\Illuminate\Contracts\Container\Container as ContainerContract;

/**
 * Class Container.
 */
class Container implements ContainerContract
{
    use ContainerTrait;
    /**
     * The current globally available container (if any).
     *
     * @var static
     */
    protected static $instance;
    /**
     * An array of the types that have been resolved.
     *
     * @var array
     */
    protected $resolved = [];
    /**
     * The container's bindings.
     *
     * @var array
     */
    protected $bindings = [];
    /**
     * The container's shared instances.
     *
     * @var array
     */
    protected $instances = [];
    /**
     * The registered type aliases.
     *
     * @var array
     */
    protected $aliases = [];
    /**
     * The stack of concretions being current built.
     *
     * @var array
     */
    protected $buildStack = [];

    /**
     * Determine if the given abstract type has been bound.
     *
     * @param  string $abstract
     *
     * @return bool
     */
    public function bound($abstract)
    {
        return isset($this->bindings[ $abstract ]) || isset($this->instances[ $abstract ]) || $this->isAlias($abstract);
    }

    /**
     * Determine if the given abstract type has been resolved.
     *
     * @param  string $abstract
     *
     * @return bool
     */
    public function resolved($abstract)
    {
        return isset($this->resolved[ $abstract ]) || isset($this->instances[ $abstract ]);
    }

    /**
     * Determine if a given string is an alias.
     *
     * @param  string $name
     *
     * @return bool
     */
    public function isAlias($name)
    {
        return isset($this->aliases[ $name ]);
    }

    /**
     * Register a binding with the container.
     *
     * @param  string|array $abstract
     * @param  \Closure|string|null $concrete
     * @param  bool $shared
     *
     * @param array $parameters
     *
     * @return void
     */
    public function bind($abstract, $concrete = null, $shared = false, $parameters = [])
    {
        // If the given types are actually an array, we will assume an alias is being
        // defined and will grab this "real" abstract class name and register this
        // alias with the container so that it can be used as a shortcut for it.
        if (is_array($abstract)) {
            list($abstract, $alias) = $this->extractAlias($abstract);

            $this->alias($abstract, $alias);
        }

        // If no concrete type was given, we will simply set the concrete type to the
        // abstract type. This will allow concrete type to be registered as shared
        // without being forced to state their classes in both of the parameter.
        $this->dropStaleInstances($abstract);

        if (is_null($concrete)) {
            $concrete = $abstract;
        }

        // If the factory is not a Closure, it means it is just a class name which is
        // is bound into this container to the abstract type and we will just wrap
        // it up inside a Closure to make things more convenient when extending.
        if (!$concrete instanceof Closure) {
            $concrete = $this->getClosure($abstract, $concrete);
        }

        $this->bindings[ $abstract ] = compact('concrete', 'shared');

        // If the abstract type was already resolved in this container we'll fire the
        // rebound listener so that any objects which have already gotten resolved
        // can have their copy of the object updated via the listener callbacks.
        if ($this->resolved($abstract)) {
            $this->make($abstract, $parameters);
        }
    }

    /**
     * Get the Closure to be used when building a type.
     *
     * @param  string $abstract
     * @param  string $concrete
     *
     * @return \Closure
     */
    protected function getClosure($abstract, $concrete)
    {
        return function ($c, $parameters = []) use ($abstract, $concrete) {
            $method = ($abstract == $concrete) ? 'build' : 'make';

            return $c->$method($concrete, $parameters);
        };
    }

    /**
     * Register a shared binding in the container.
     *
     * @param  string $abstract
     * @param  \Closure|string|null $concrete
     *
     * @return $this
     */
    public function singleton($abstract, $concrete = null, $parameters = [])
    {
        $this->bind($abstract, $concrete, true, $parameters);

        return $this;
    }

    /**
     * Register an existing instance as shared in the container.
     *
     * @param  string $abstract
     * @param  mixed $instance
     *
     * @param array $parameters
     *
     * @return void
     */
    public function instance($abstract, $instance, $parameters = [])
    {
        // First, we will extract the alias from the abstract if it is an array so we
        // are using the correct name when binding the type. If we get an alias it
        // will be registered with the container so we can resolve it out later.
        if (is_array($abstract)) {
            list($abstract, $alias) = $this->extractAlias($abstract);

            $this->alias($abstract, $alias);
        }

        unset($this->aliases[ $abstract ]);

        // We'll check to determine if this type has been bound before, and if it has
        // we will fire the rebound callbacks registered with the container and it
        // can be updated with consuming classes that have gotten resolved here.
        $bound = $this->bound($abstract);

        $this->instances[ $abstract ] = $instance;

        if ($bound) {
            $this->make($abstract, $parameters);
        }
    }

    /**
     * Alias a type to a different name.
     *
     * @param  string $abstract
     * @param  string $alias
     *
     * @return $this
     */
    public function alias($abstract, $alias)
    {
        $this->aliases[ $alias ] = $abstract;

        return $this;
    }

    /**
     * Extract the type and alias from a given definition.
     *
     * @param  array $definition
     *
     * @return array
     */
    protected function extractAlias(array $definition)
    {
        return [key($definition), current($definition)];
    }

    /**
     * Call the given Closure / class@method and inject its dependencies.
     *
     * @param  callable|string $callback
     * @param  array $parameters
     *
     * @return mixed
     * @throws \ReflectionException
     */
    public function call($callback, array $parameters = [])
    {
        $dependencies = $this->getMethodDependencies($this->getCallReflector($callback), $parameters);

        return call_user_func_array($callback, $dependencies);
    }

    /**
     * Resolve the given type from the container.
     *
     * @param  string $abstract
     * @param  array $parameters
     *
     * @return mixed
     * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
     */
    public function make($abstract, $parameters = [])
    {
        $abstract = $this->getAlias($abstract);

        // If an instance of the type is currently being managed as a singleton we'll
        // just return an existing instance instead of instantiating new instances
        // so the developer can keep using the same objects instance every time.
        if (isset($this->instances[ $abstract ])) {
            return $this->instances[ $abstract ];
        }

        $concrete = $this->getConcrete($abstract);

        // We're ready to instantiate an instance of the concrete type registered for
        // the binding. This will instantiate the types, as well as resolve any of
        // its "nested" dependencies recursively until all have gotten resolved.
        if ($this->isBuildable($concrete, $abstract)) {
            $object = $this->build($concrete, $parameters);
        } else {
            $object = $this->make($concrete, $parameters);
        }

        // If the requested type is registered as a singleton we'll want to cache off
        // the instances in "memory" so we can return it later without creating an
        // entirely new instance of an object on each subsequent request for it.
        if ($this->isShared($abstract)) {
            $this->instances[ $abstract ] = $object;
        }

        $this->resolved[ $abstract ] = true;

        return $object;
    }

    /**
     * Get the concrete type for a given abstract.
     *
     * @param  string $abstract
     *
     * @return mixed   $concrete
     */
    protected function getConcrete($abstract)
    {
        // If we don't have a registered resolver or concrete for the type, we'll just
        // assume each type is a concrete name and will attempt to resolve it as is
        // since the container should be able to resolve concretes automatically.
        if (!isset($this->bindings[ $abstract ])) {
            if ($this->missingLeadingSlash($abstract)
                && isset($this->bindings[ '\\' . $abstract ])
            ) {
                $abstract = '\\' . $abstract;
            }

            return $abstract;
        }

        return $this->bindings[ $abstract ]['concrete'];
    }

    /**
     * Determine if the given abstract has a leading slash.
     *
     * @param  string $abstract
     *
     * @return bool
     */
    protected function missingLeadingSlash($abstract)
    {
        return is_string($abstract) && strpos($abstract, '\\') !== 0;
    }

    /**
     * Instantiate a concrete instance of the given type.
     *
     * @param  string $concrete
     * @param  array $parameters
     *
     * @return mixed
     *
     * @throws BindingResolutionException
     * @throws \ReflectionException
     */
    public function build($concrete, $parameters = [])
    {
        // If the concrete type is actually a Closure, we will just execute it and
        // hand back the results of the functions, which allows functions to be
        // used as resolvers for more fine-tuned resolution of these objects.
        if ($concrete instanceof Closure) {
            return $concrete($this, $parameters);
        }

        $reflector = new ReflectionClass($concrete);

        // If the type is not instantiable, the developer is attempting to resolve
        // an abstract type such as an Interface of Abstract Class and there is
        // no binding registered for the abstractions so we need to bail out.
        if (!$reflector->isInstantiable()) {
            $message = "Target [$concrete] is not instantiable.";

            throw new BindingResolutionException($message);
        }

        $this->buildStack[] = $concrete;

        $constructor = $reflector->getConstructor();

        // If there are no constructors, that means there are no dependencies then
        // we can just resolve the instances of the objects right away, without
        // resolving any other types or dependencies out of these containers.
        if (is_null($constructor)) {
            array_pop($this->buildStack);

            return new $concrete;
        }

        $parameters = $this->getMethodDependencies($constructor, $parameters);

        array_pop($this->buildStack);

        return $reflector->newInstanceArgs($parameters);
    }

    /**
     * Determine if a given type is shared.
     *
     * @param  string $abstract
     *
     * @return bool
     */
    public function isShared($abstract)
    {
        if (isset($this->bindings[ $abstract ]['shared'])) {
            $shared = $this->bindings[ $abstract ]['shared'];
        } else {
            $shared = false;
        }

        return isset($this->instances[ $abstract ]) || $shared === true;
    }

    /**
     * Determine if the given concrete is buildable.
     *
     * @param  mixed $concrete
     * @param  string $abstract
     *
     * @return bool
     */
    protected function isBuildable($concrete, $abstract)
    {
        return $concrete === $abstract || $concrete instanceof Closure;
    }

    /**
     * Get the alias for an abstract if available.
     *
     * @param  string $abstract
     *
     * @return string
     */
    protected function getAlias($abstract)
    {
        return isset($this->aliases[ $abstract ]) ? $this->aliases[ $abstract ] : $abstract;
    }

    /**
     * Drop all of the stale instances and aliases.
     *
     * @param  string $abstract
     *
     * @return void
     */
    protected function dropStaleInstances($abstract)
    {
        unset($this->instances[ $abstract ], $this->aliases[ $abstract ]);
    }

    /**
     * Remove a resolved instance from the instance cache.
     *
     * @param  string $abstract
     *
     * @return void
     */
    public function forgetInstance($abstract)
    {
        unset($this->instances[ $abstract ]);
    }

    /**
     * Set the globally available instance of the container.
     *
     * @return static
     */
    public static function getInstance()
    {
        return static::$instance;
    }

    /**
     * Set the shared instance of the container.
     *
     * @param  \VisualComposer\Framework\Illuminate\Contracts\Container\Container $container
     *
     * @return void
     */
    public static function setInstance(ContainerContract $container)
    {
        static::$instance = $container;
    }
}
