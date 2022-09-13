<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
/**
 * @var array $stateCapabilities
 * @var string $role
 * @var \WP_Role $roleObject
 * @var string $part
 */
?>
<div class="vcv-settings-section vcv-settings_vcv-settings-gutenberg-editor-enabled">
    <h2><?php echo esc_html__('Post Types', 'visualcomposer'); ?></h2>
    <div class="vcv-ui-settings-status-tables-wrapper">
        <div class="vcv-ui-settings-status-table">
            <p class="description"><?php echo esc_html__('Specify post types where you want to use Visual Composer editor.', 'visualcomposer'); ?></p>
        </div>
        <div class="vcv-ui-settings-status-table">
            <?php
            $availablePostTypes = vchelper('PostType')->getPostTypes(['attachment']);
            foreach ($availablePostTypes as $postType) :
                $postTypeObject = get_post_type_object($postType['value']);
                if (!$postTypeObject) {
                    continue;
                }
                $hasAccess = $roleObject->has_cap($postTypeObject->cap->edit_posts);
                if (!$hasAccess) {
                    continue;
                }
                ?>
                <div class="vcv-ui-settings-status-table-row">
                    <div class="vcv-ui-settings-status-table-title description"><?php echo esc_html($postType['label']); ?></div>
                    <div class="vcv-ui-settings-status-table-content">
                        <?php
                        $index = 'edit_' . $postType['value'];
                        $capabilityKey = 'vcv_access_rules__' . $part . '_' . $index;
                        $isEnabled = isset($stateCapabilities[ $capabilityKey ]) && $stateCapabilities[ $capabilityKey ];
                        evcview(
                            'settings/fields/toggle',
                            [
                                'value' => $index,
                                'name' => 'vcv-role-manager[' . $role . '][' . $part . '][]',
                                'isEnabled' => $isEnabled,
                                'title' => '',
                            ]
                        );
                        ?>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</div>
