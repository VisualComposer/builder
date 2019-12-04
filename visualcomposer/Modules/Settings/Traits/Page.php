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
     * @return mixed
     * @deprecated
     */
    public function getTemplatePath()
    {
        return isset($this->templatePath) ? $this->templatePath : '';
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
        vcevent('vcv:settings:page:' . $page['slug'] . ':beforeRender', $page);
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
                'slug' => $this->slug,
                'path' => $this->getTemplatePath(),
                'page' => $page,
            ]
        );
        if (!$this->getTemplatePath()) {
            $response = '';
        } else {
            $response = vcview($this->getTemplatePath(), $args);
        }

        if (method_exists($this, 'afterRender')) {
            return $this->call('afterRender', [$response]);
        }

        return $response;
    }
}
