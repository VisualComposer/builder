<?php

namespace VisualComposer\Modules\Settings\Traits;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/**
 * Trait Page.
 */
trait Page
{
    /**
     * Get URL slug
     * @return string
     */
    public function getSlug()
    {
        return $this->slug;
    }

    /**
     * @deprecated
     * @return mixed
     */
    public function getTemplatePath()
    {
        return $this->templatePath;
    }

    /**
     * Code executed in render method just before view open
     * Useful to enqueue assets
     */
    protected function beforeRender()
    {
    }

    /**
     * Render page.
     */
    public function render($page)
    {
        /**
         * @var $this \VisualComposer\Application|\VisualComposer\Framework\Container
         * @see \VisualComposer\Framework\Container::call
         * @see \VisualComposer\Modules\Settings\Traits\Page::beforeRender
         */
        $this->call('beforeRender');
        /** @var $this Page */
        $args = array_merge(
            method_exists($this, 'getRenderArgs') ? (array)$this->call('getRenderArgs') : [],
            [
                'controller' => $this,
                'slug' => $this->slug,
                'path' => $this->templatePath,
                'page' => $page,
            ]
        );
        if (!$this->templatePath) {
            return '';
        }

        return vcview($this->templatePath, $args);
    }
}
