<?php namespace VisualComposer\Framework\Illuminate\Container;

use VisualComposer\Framework\Illuminate\Contracts\Container\ContextualBindingBuilder as Contract;

/**
 * Class ContextualBindingBuilder
 * @package VisualComposer\Framework\Illuminate\Container
 */
class ContextualBindingBuilder implements Contract
{
    /**
     * The underlying container instance.
     *
     * @var \VisualComposer\Framework\Illuminate\Container\Container
     */
    protected $container;
    /**
     * The concrete instance.
     *
     * @var string
     */
    protected $concrete;
    /**
     * @var
     */
    protected $needs;

    /**
     * Create a new contextual binding builder.
     *
     * @param  \VisualComposer\Framework\Illuminate\Container\Container $container
     * @param  string $concrete
     */
    public function __construct(Container $container, $concrete)
    {
        $this->concrete = $concrete;
        $this->container = $container;
    }

    /**
     * Define the abstract target that depends on the context.
     *
     * @param  string $abstract
     * @return $this
     */
    public function needs($abstract)
    {
        $this->needs = $abstract;

        return $this;
    }

    /**
     * Define the implementation for the contextual binding.
     *
     * @param  \Closure|string $implementation
     */
    public function give($implementation)
    {
        $this->container->addContextualBinding($this->concrete, $this->needs, $implementation);
    }
}
