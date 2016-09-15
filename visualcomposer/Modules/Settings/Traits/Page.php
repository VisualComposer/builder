<?php

namespace VisualComposer\Modules\Settings\Traits;

/**
 * Trait Page.
 */
trait Page
{
    /**
     * @var array
     */
    protected $templateArgs = [];

    /**
     * @return string
     */
    public function getSlug()
    {
        return $this->slug;
    }

    /**
     * @param mixed $slug
     *
     * @return $this
     */
    public function setSlug($slug)
    {
        $this->slug = (string)$slug;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getTemplatePath()
    {
        return $this->templatePath;
    }

    /**
     * @param mixed $templatePath
     *
     * @return $this
     */
    public function setTemplatePath($templatePath)
    {
        $this->templatePath = $templatePath;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getTemplateArgs()
    {
        return $this->templateArgs;
    }

    /**
     * @param mixed $templateArgs
     *
     * @return $this
     */
    public function setTemplateArgs($templateArgs)
    {
        $this->templateArgs = $templateArgs;

        return $this;
    }

    /**
     *
     */
    protected function beforeRender()
    {
    }

    /**
     * Render page.
     */
    public function render()
    {
        /**
         * @var $this \VisualComposer\Application|\VisualComposer\Framework\Container
         * @see \VisualComposer\Framework\Container::call
         * @see \VisualComposer\Modules\Settings\Traits\Page::beforeRender
         */
        $this->call('beforeRender');
        /** @var $this Page */
        $args = array_merge(
            $this->getTemplateArgs(),
            [
                'controller' => $this,
                'slug' => $this->getSlug(),
                'path' => $this->getTemplatePath(),
            ]
        );

        return vcview($this->getTemplatePath(), $args);
    }
}
