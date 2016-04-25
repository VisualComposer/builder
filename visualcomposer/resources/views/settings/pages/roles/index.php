<?php
/**
 * @var $Roles VisualComposer\Modules\Settings\Pages\Roles
 */
if (!defined('ABSPATH')) {
    die('-1');
}

$editableRoles = get_editable_roles();

?>

<form action="<?php echo admin_url('admin-ajax.php'); ?>"
    method="post"
    id="vc_settings-<?php echo $slug ?>"
    class="vc_settings-tab-content vc_settings-tab-content-active"
    <?php echo apply_filters('vc_setting-tab-form-' . $slug, '') ?>
    data-vc-roles="form">

    <div class="tab_intro">
        <p>
            <?php echo __(
                'Control user group role access to the features and options of Visual Composer - manage WordPress default and custom roles.',
                'vc5'
            ) ?>
        </p>
    </div>

    <div class="vc_wp-settings">
        <div class="vc_wp-accordion" data-vc-action="collapseAll">
            <?php
            $parts = $controller->getParts();
            foreach ($editableRoles as $role => $details) : ?>
                <?php

                $name = translate_user_role($details['name']);
                $uniqueId = 'vc_role-' . $role;
                $validRoles = [];

                foreach ($parts as $part) {
                    if ($controller->hasRoleCapability($role, $controller->getPartCapability($part))) {
                        $validRoles[] = $part;
                    }
                }

                ?>

                <?php if (count($validRoles) > 0) : ?>
                    <div
                        class="vc_wp-accordion-panel vc_ui-settings-roles-role<?php echo !isset($next) ? ' vc_active'
                            : '' ?>"
                        data-vc-unique-id="<?php echo esc_attr($uniqueId) ?>"
                        data-vc-content=".vc_wp-accordion-panel-body"
                        data-vc-role="<?php echo esc_attr($role) ?>">
                        <div class="widget"
                            data-vc-accordion=""
                            data-vc-container=".vc_wp-accordion"
                            data-vc-target="[data-vc-unique-id=<?php echo esc_attr($uniqueId) ?>]">
                            <div class="widget-top">
                                <div class="widget-title-action">
                                    <a class="widget-action hide-if-no-js" href="#"></a>
                                    <a class="widget-control-edit hide-if-js">
                                        <span class="edit vc_automapper-edit-btn"><?php echo __('Edit', 'vc5') ?></span>
                                        <span class="add vc_automapper-delete-btn"><?php echo __('Add', 'vc5') ?></span>
                                        <span class="screen-reader-text"><?php echo __('Search', 'vc5') ?></span>
                                    </a>
                                </div>
                                <div class="widget-title">
                                    <h4>
                                        <?php echo esc_html($name) ?>
                                        <span class="in-widget-title"></span>
                                    </h4>
                                </div>
                            </div>

                        </div>

                        <div class="vc_wp-accordion-panel-body">
                            <table class="form-table">
                                <tbody>
                                <?php

                                $next = true;

                                foreach ($validRoles as $part) {
                                    $view = str_replace('_', '-', $part);
                                    vcview(
                                        'settings/pages/roles/partials/' . $view,
                                        [
                                            'part' => $part,
                                            'role' => $role,
                                            'controller' => $controller,
                                        ]
                                    );
                                }
                                ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                <?php endif ?>
            <?php endforeach ?>
        </div>
    </div>

    <span class="vc_settings-spinner vc_ui-wp-spinner" style="display: none;" id="vc_wp-spinner"></span>

    <?php

    wp_nonce_field('vc_settings-' . $slug . '-action', 'vc_nonce_field');

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

    submit_button(__('Save Changes', 'vc5'), 'primary', 'submit_btn', true, $submitButtonAttributes);

    ?>
    <?php /* @todo change id in JS from #vcv_settings-roles-action to #settings-save-roles-btn */ ?>
    <input type="hidden" name="action" value="vcv_roles_settings_save" id="vcv-settings-save-roles-btn"/>
</form>
