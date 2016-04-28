<?php

namespace VisualComposer\Modules\Settings\Traits;

/**
 * Trait Fields.
 */
trait Fields
{
    /**
     * @var string
     */
    protected $optionGroup = 'vcv-settings';
    /**
     * @var string
     */
    protected $optionSlug = 'vcv-settings';

    /**
     * @return string
     */
    public function getOptionGroup()
    {
        return $this->optionGroup;
    }

    /**
     * @return string
     */
    public function getOptionSlug()
    {
        return $this->optionSlug;
    }

    /**
     * @param $sectionData
     *
     * @return $this
     */
    protected function addSection($sectionData)
    {
        $sectionData = array_merge(
            [
                'slug' => $this->optionSlug,
                'group' => $this->optionGroup,
                'title' => '',
                'page' => '',
                'callback' => function ($data) {
                    return $data;
                },
            ],
            $sectionData
        );

        add_settings_section(
            $sectionData['group'] . '_' . $sectionData['page'],
            $sectionData['title'],
            $sectionData['callback'],
            $sectionData['slug'] . '_' . $sectionData['page']
        );

        return $this;
    }

    /**
     * @param $fieldData
     *
     * @return $this
     */
    protected function addField($fieldData)
    {
        $fieldData = array_merge(
            [
                'group' => $this->optionGroup,
                'slug' => $this->optionSlug,
                'name' => '',
                'title' => '',
                'page' => '',
                'fieldCallback' => function ($data) {
                    return $data;
                },
                'sanitizeCallback' => function ($data) {
                    return $data;
                },
                'args' => [],
            ],
            $fieldData
        );

        register_setting(
            $fieldData['group'] . '_' . $fieldData['page'],
            VCV_PREFIX . $fieldData['name'],
            $fieldData['sanitizeCallback']
        );
        add_settings_field(
            VCV_PREFIX . $fieldData['name'],
            $fieldData['title'],
            $fieldData['fieldCallback'],
            $fieldData['slug'] . '_' . $fieldData['page'],
            $fieldData['group'] . '_' . $fieldData['page'],
            $fieldData['args']
        );

        return $this;
    }
}
