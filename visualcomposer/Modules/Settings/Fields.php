<?php
namespace VisualComposer\Modules\Settings;

trait Fields
{
    /**
     * @param $page
     * @param $title
     * @param $callback
     */
    protected function addSection($page, $title = null, $callback = null)
    {
        $defaultCallback = function ($data) {
            return $data;
        };

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
        $defaultCallback = function ($data) {
            return $data;
        };

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
}