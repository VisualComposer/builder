<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
/** @var $controller \VisualComposer\Modules\Settings\Pages\Settings */
/** @var string $slug */
function doSection($section, $slug)
{
    // @codingStandardsIgnoreStart
    global $wp_settings_fields;
    $wpSettingsFields = $wp_settings_fields;
    // @codingStandardsIgnoreEnd
    echo '<div class="' . $slug . '-section ' . $section['id'] . '">';
    if ($section['title']) {
        echo "<h2>{$section['title']}</h2>\n";
    }

    if ($section['callback']) {
        call_user_func($section['callback'], $section);
    }

    if (!isset($wpSettingsFields) || !isset($wpSettingsFields[ $slug ])
        || !isset($wpSettingsFields[ $slug ][ $section['id'] ])) {
        return;
    }
    echo '<table class="form-table">';
    do_settings_fields($slug, $section['id']);
    echo '</table>';
    if (isset($section['children']) && !empty($section['children'])) {
        ?>
        <div class="vcv-child-section">
            <?php
            foreach ($section['children'] as $child) {
                doSection($child, $slug);
            }
            ?>
        </div>
        <?php
    }
    echo '</div>';
}
?>

<form action="options.php"
        method="post"
        data-vcv-ui-element="settings-tab-<?php echo esc_attr($slug); ?>"
        class="vcv-settings-tab-content vcv-settings-tab-content-active"
    <?php
    // @codingStandardsIgnoreLine
    echo apply_filters('vc_setting-tab-form-' . esc_attr($slug), '');
    ?>
>
    <?php settings_fields($slug . '_' . $slug) ?>

    <?php

    // @codingStandardsIgnoreStart
    global $wp_settings_sections;
    $wpSettingsSection = $wp_settings_sections;
    // @codingStandardsIgnoreEnd

    if (!isset($wpSettingsSection[ $slug ])) {
        return;
    }

    $sections = (array)$wpSettingsSection[ $slug ];
    $orderedSections = [];
    foreach ($sections as $key => $section) {
        if (isset($section['parent'])) {
            $localFound = array_key_exists($section['parent'], $orderedSections);
            if (!$localFound) {
                $orderedSections[$key] = $section;
            }
            $orderedSections[$section['parent']]['children'][$key] = $section;
        } else {
            $orderedSections[$key] = $section;
        }
    }

    foreach ($orderedSections as $section) {
        doSection($section, $slug);
    }

    $submitButtonAttributes = [];
    $submitButtonAttributes = apply_filters(
        'vcv:template:settings:settings-tab-submit-button-attributes',
        $submitButtonAttributes,
        $slug
    );
    $submitButtonAttributes = apply_filters(
        'vcv:template:settings:settings-tab-submit-button-attributes' . $slug,
        $submitButtonAttributes,
        $slug
    );
    ?>

    <?php submit_button(__('Save Changes', 'vcwb'), 'primary', 'submit_btn', true, $submitButtonAttributes) ?>

    <input type="hidden" name="vcv_action" value="vcv_action-<?php echo esc_attr(
        $slug
    ); ?>" id="vcv_settings-<?php echo esc_attr($slug); ?>-action" />

</form>
