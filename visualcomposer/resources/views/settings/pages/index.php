<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
/** @var $controller \VisualComposer\Modules\Settings\Pages\Settings */
/** @var string $slug */
?>
<?php if ($slug === 'vcv-headers-footers' || $slug === 'vcv-custom-page-templates') { ?>
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
<form action="<?php echo vchelper('Url')->adminAjax(
    ['vcv-action' => 'settings:save:adminNonce', 'vcv-nonce' => vchelper('Nonce')->admin()]
); ?>"
        method="post"
        data-vcv-ui-element="settings-tab-<?php echo esc_attr($slug); ?>"
        class="vcv-settings-tab-content vcv-settings-tab-content-active">
    <?php

    $sectionsRegistry = vchelper('SettingsSectionsRegistry');
    $orderedSections = $sectionsRegistry->getHiearchy($sectionsRegistry->findBySlug($slug));

    $viewsHelper = vchelper('Views');
    foreach ($orderedSections as $section) {
        $viewsHelper->doNestedSection($section, $slug);
    }

    $submitButtonAttributes = [
        'id' => 'submit_btn-' . $slug,
    ];
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

    <?php $viewsHelper->renderedFieldsList(); ?>
    <div class="vcv-submit-button-container">
        <?php submit_button(__('Save Changes', 'visualcomposer'), 'vcv-dashboard-button vcv-dashboard-button--save', 'submit_btn', false, $submitButtonAttributes) ?>
    </div>

    <input type="hidden" name="vcv_action" value="vcv_action-<?php echo esc_attr(
        $slug
    ); ?>" id="vcv_settings-<?php echo esc_attr($slug); ?>-action" />
</form>
