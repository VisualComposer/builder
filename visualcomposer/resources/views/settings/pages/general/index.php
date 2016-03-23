<?php

if (!defined('ABSPATH')) {
    die('-1');
}
/** @var $controller \VisualComposer\Modules\Settings\Pages\General */
$optionGroup = $controller->getOptionGroup();
?>

<form action="options.php"
    method="post"
    data-vc-ui-element="settings-tab-<?php echo $slug ?>"
    class="vc_settings-tab-content vc_settings-tab-content-active"
    <?php echo apply_filters('vc_setting-tab-form-' . $slug, '') ?>
>

    <?php settings_fields($optionGroup . '_' . $slug) ?>

    <?php do_settings_sections($slug . '_' . $slug) ?>

    <?php

    $submitButtonAttributes = [];
    $submitButtonAttributes = apply_filters('vc_settings-tab-submit-button-attributes', $submitButtonAttributes, $slug);
    $submitButtonAttributes = apply_filters(
        'vc_settings-tab-submit-button-attributes-' . $slug,
        $submitButtonAttributes,
        $slug
    );

    ?>

    <?php submit_button(__('Save Changes', 'vc5'), 'primary', 'submit_btn', true, $submitButtonAttributes) ?>

    <input type="hidden" name="vc_action" value="vc_action-<?php echo $slug ?>"
        id="vc_settings-<?php echo $slug ?>-action"/>

</form>