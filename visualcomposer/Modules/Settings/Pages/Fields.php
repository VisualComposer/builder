<?php
namespace VisualComposer\Modules\Settings\Pages;

trait Fields
{
    /**
     * @param $page
     * @param $title
     * @param $callback
     */
    protected function addSection($page, $title = null, $callback = null)
    {
        if (!$callback) {
            $callback = function () {
                $args = func_get_args();

                return $this->call('sectionCallback', $args);
            };
        }

        add_settings_section(
            $this->getOptionGroup() . '_' . $page,
            $title,
            $callback,
            $this->getSlug() . '_' . $page
        );
    }

    /**
     * Create field in section.
     *
     * @param $page
     * @param $title
     * @param $fieldData
     *
     * @return self
     */
    protected function addField($page, $title, $fieldData)
    {
        if (!$sanitizeCallback) {
            $sanitizeCallback = function () {
                $args = func_get_args();

                return $this->call('fieldSanitizeCallback', $args);
            };
        }

        if (!$fieldCallback) {
            $fieldCallback = function () {
                $args = func_get_args();

                return $this->call('fieldCallback', $args);
            };
        }

        register_setting($this->getOptionGroup() . '_' . $page, VC_V_PREFIX . $fieldName, $sanitizeCallback);
        add_settings_field(
            VC_V_PREFIX . $fieldName,
            $title,
            $fieldCallback,
            $this->getSlug() . '_' . $page,
            $this->getOptionGroup() . '_' . $page,
            $args
        );

        return $this;
    }

    /**
     * Callback function for settings section
     *
     * @param string $section
     *
     * @return string
     */
    protected function sectionCallback($section)
    {
        return $section;
    }

    /**
     * Callback function for addField sanitize
     *
     * @param mixed $value
     *
     * @return mixed
     */
    protected function fieldSanitizeCallback($value)
    {
        return $value;
    }

    /**
     * Callback function for addField field
     *
     * @param mixed $value
     *
     * @return mixed
     */
    protected function fieldCallback($value)
    {
        return $value;
    }
}