<?php

namespace VisualComposer\Modules\Settings;

/**
 * Class Page
 * @package VisualComposer\Modules\Settings\Pages
 */
trait Page
{
    protected $templateArgs = [];
    protected $title = '';

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
     * @return self
     */
    public function setSlug($slug)
    {
        $this->slug = (string)$slug;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @param string $title
     *
     * @return self
     */
    public function setTitle($title)
    {
        $this->title = (string)$title;

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
     * @return self
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
     * @return self
     */
    public function setTemplateArgs($templateArgs)
    {
        $this->templateArgs = $templateArgs;

        return $this;
    }

    protected function beforeRender()
    {
    }

    /**
     * Render page
     */
    public function render()
    {
        /** @var $this IgnoreMethod */
        /** @ignore ->call() is available [phpStorm] bug */
        $this->call('beforeRender');
        /** @var $this Page */
        $args = array_merge(
            $this->getTemplateArgs(),
            [
                'controller' => $this,
                'slug' => $this->getSlug(),
                'title' => $this->getTitle(),
                'path' => $this->getTemplatePath(),
            ]
        );

        return vcview($this->getTemplatePath(), $args, false);
    }
}
