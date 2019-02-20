<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
/** @var $controller \VisualComposer\Modules\Settings\Pages\Settings */
/** @var string $slug */
?>
<?php if ($slug === 'vcv-headers-footers') { ?>
    <style>
        .vcv-settings-tab-content,
        .vcv-headers-footers_headers-footers-all-site,
        .vcv-headers-footers_headers-footers-separate-post-types {
            visibility: hidden;
        }

        .vcv-table-loader-wrapper {
            position: relative;
            display: flex;
            justify-content: center;
        }

        .vcv-table-loader {
            height: 16px;
            width: 16px;
            margin-top: 40px;
            transform: translate(-50%, -50%);
            animation: vcv-ui-wp-spinner-animation 1.08s linear infinite;
        }

        @keyframes vcv-ui-wp-spinner-animation {
            from {
                transform: translate(-50%, -50%) rotate(0deg);
            }
            to {
                transform: translate(-50%, -50%) rotate(360deg);
            }
        }
    </style>
    <div class="vcv-table-loader-wrapper">
        <div class="vcv-table-loader">
            <svg version="1.1" id="vc_wp-spinner" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    x="0px" y="0px" width="16px" height="16px">
                <defs>
                    <mask id="hole">
                        <rect width="100%" height="100%" fill="white" />
                        <circle r="2px" cx="50%" cy="25%" />
                    </mask>
                </defs>
                <circle r="8px" cx="50%" cy="50%" mask="url(#hole)" fill="#808080" />
            </svg>
        </div>
    </div>
<?php } ?>
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
        if (isset($section['vcv-args']) & isset($section['vcv-args']['parent'])) {
            $localFound = array_key_exists($section['vcv-args']['parent'], $orderedSections);
            if (!$localFound) {
                $orderedSections[ $key ] = $section;
            }
            $orderedSections[ $section['vcv-args']['parent'] ]['children'][ $key ] = $section;
        } else {
            $orderedSections[ $key ] = $section;
        }
    }

    foreach ($orderedSections as $section) {
        vchelper('Views')->doNestedSection($section, $slug);
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
