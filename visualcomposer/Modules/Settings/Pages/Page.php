<?php

namespace VisualComposer\Modules\Settings\Pages;

use VisualComposer\Helpers\Generic\Templates;

class Page {

	protected $slug;
	protected $title;
	protected $templatePath;
	protected $templateArgs = [];

	/**
	 * @return string
	 */
	public function getSlug() {
		return $this->slug;
	}

	/**
	 * @param mixed $slug
	 *
	 * @return self
	 */
	public function setSlug( $slug ) {
		$this->slug = (string) $slug;

		return $this;
	}

	/**
	 * @return mixed
	 */
	public function getTitle() {
		return $this->title;
	}

	/**
	 * @param string $title
	 *
	 * @return self
	 */
	public function setTitle( $title ) {
		$this->title = (string) $title;

		return $this;
	}

	/**
	 * @return mixed
	 */
	public function getTemplatePath() {
		return $this->templatePath;
	}

	/**
	 * @param mixed $templatePath
	 *
	 * @return self
	 */
	public function setTemplatePath( $templatePath ) {
		$this->templatePath = $templatePath;

		return $this;
	}

	/**
	 * @return mixed
	 */
	public function getTemplateArgs() {
		return $this->templateArgs;
	}

	/**
	 * @param mixed $templateArgs
	 *
	 * @return self
	 */
	public function setTemplateArgs( $templateArgs ) {
		$this->templateArgs = $templateArgs;

		return $this;
	}

	/**
	 * Render page
	 */
	public function render() {
		$args = array_merge( $this->getTemplateArgs(), [
			'page' => $this
		] );

		Templates::render( $this->getTemplatePath(), $args );
	}
}