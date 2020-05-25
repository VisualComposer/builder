<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/** @var array $wpVersion */
/** @var array $phpVersion */
/** @var array $wpDebug */
/** @var string $vcVersion */
/** @var string $refreshUrl */
/** @var array $memoryLimit */
/** @var array $timeout */
/** @var array $fileUploadSize */
/** @var array $uploadDirAccess */
/** @var array $fsMethod */
/** @var array $zipExt */
/** @var array $curlExt */
/** @var array $account */
/** @var array $aws */
?>
<div class="vcv-ui-settings-status-table-container">
    <div class="vcv-description">
        <p class="description"><?php echo esc_html__('Check system status and WordPress configuration for compliance with Visual Composer requirements.', 'visualcomposer'); ?></p>
        <a href="<?php echo esc_url($refreshUrl); ?>" class="button vcv-system-refresh"><?php echo esc_html__('Refresh', 'visualcomposer'); ?></a>
    </div>
    <style>
        .vcv-ui-settings-status-table {
            visibility: hidden;
        }

        .vcv-ui-settings-status-tables-wrapper {
            position: relative;
        }

        .vcv-table-loader {
            position: absolute;
            height: 16px;
            width: 16px;
            left: 50%;
            top: 10%;
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

    <div class="vcv-ui-settings-status-tables-wrapper">
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
        <table class="vcv-ui-settings-status-table">
            <thead>
            <tr>
                <th colspan="3"><?php echo esc_html__('WordPress environment', 'visualcomposer') ?></th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td><?php echo esc_html__('WordPress Version', 'visualcomposer') ?>:</td>
                <td class="vcv-help">
                    <span class="vcv-help-tooltip-icon"></span>
                    <span class="vcv-help-tooltip">
                        <?php echo esc_html__('The version of WordPress installed on your site', 'visualcomposer'); ?>
                    </span>
                </td>
                <td class="<?php echo $wpVersion['status'] ?>"><?php echo $wpVersion['text']; ?></td>
            </tr>
            <tr>
                <td><?php echo esc_html__('PHP Version', 'visualcomposer') ?>:</td>
                <td class="vcv-help">
                    <span class="vcv-help-tooltip-icon"></span>
                    <span class="vcv-help-tooltip">
                        <?php echo esc_html__('The version of PHP installed on your hosting server', 'visualcomposer'); ?>
                    </span>
                </td>
                <td class="<?php echo $phpVersion['status'] ?>"><?php echo $phpVersion['text']; ?></td>
            </tr>
            <tr>
                <td><?php echo esc_html__('WP_DEBUG', 'visualcomposer') ?>:</td>
                <td class="vcv-help">
                    <span class="vcv-help-tooltip-icon"></span>
                    <span class="vcv-help-tooltip">
                        <?php echo esc_html__('Displays whether of not WordPress is in Debug Mode', 'visualcomposer'); ?>
                    </span>
                </td>
                <td class="<?php echo $wpDebug['status'] ?> vcv-no-icon"><?php echo $wpDebug['text'] ?></td>
            </tr>
            <tr>
                <td><?php echo esc_html__('Visual Composer Version', 'visualcomposer') ?>:</td>
                <td class="vcv-help">
                    <span class="vcv-help-tooltip-icon"></span>
                    <span class="vcv-help-tooltip"><?php echo esc_html__('The version of Visual Composer installed on your site', 'visualcomposer'); ?>
                </span>
                </td>
                <td>
                    <?php echo $vcVersion; ?>
                </td>
            </tr>
            <?php if (vchelper('Options')->getTransient('pluginUpdateAvailable')) { ?>
                <tr>
                    <td colspan="3">
                        <div class="update-message notice inline notice-warning notice-alt">
                            <p>
                                <?php echo esc_html__(
                                    'There is a new version of Visual Composer Website Builder available.',
                                    'visualcomposer'
                                ); ?>
                                <a href="<?php echo self_admin_url('plugins.php'); ?>" class="update-link"><?php echo esc_html('Update', 'visualcomposer'); ?></a>.
                            </p>
                        </div>
                    </td>
                </tr>
            <?php } ?>
            </tbody>
        </table>

        <table class="vcv-ui-settings-status-table">
            <thead>
            <tr>
                <th colspan="3"><?php echo esc_html__('Configurations', 'visualcomposer'); ?></th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td><?php echo esc_html__('Memory Limit', 'visualcomposer') ?>:</td>
                <td class="vcv-help">
                    <span class="vcv-help-tooltip-icon"></span>
                    <span class="vcv-help-tooltip">
                        <?php echo esc_html__(
                            'The maximum amout of memory (RAM) that your site can use at one time',
                            'visualcomposer'
                        ); ?>
                    </span>
                </td>
                <td class="<?php echo $memoryLimit['status'] ?>"><?php echo $memoryLimit['text']; ?></td>
            </tr>
            <tr>
                <td><?php echo esc_html__('Post Max Size', 'visualcomposer') ?>:</td>
                <td class="vcv-help">
                    <span class="vcv-help-tooltip-icon"></span>
                    <span class="vcv-help-tooltip">
                        <?php echo esc_html__(
                            'Sets max size of post data allowed. This setting also affects file upload.',
                            'visualcomposer'
                        ) ?>
                    </span>
                </td>
                <td class="<?php echo $postMaxSize['status'] ?>"><?php echo $postMaxSize['text']; ?></td>
            </tr>
            <tr>
                <td><?php echo esc_html__('Max Input Nesting Level', 'visualcomposer') ?>:</td>
                <td class="vcv-help">
                    <span class="vcv-help-tooltip-icon"></span>
                    <span class="vcv-help-tooltip">
                        <?php echo esc_html__(
                            'Sets the max nesting depth of input variables (i.e. $_GET, $_POST.)',
                            'visualcomposer'
                        ) ?>
                    </span>
                </td>
                <td class="<?php echo $maxInputNestingLevel['status']; ?>"><?php echo $maxInputNestingLevel['text']; ?></td>
            </tr>
            <tr>
                <td><?php echo esc_html__('Max Input Vars', 'visualcomposer'); ?>:</td>
                <td class="vcv-help">
                    <span class="vcv-help-tooltip-icon"></span>
                    <span class="vcv-help-tooltip">
                        <?php echo esc_html__(
                            'How many input variables may be accepted (limit is applied to $_GET, $_POST and $_COOKIE superglobal separately)',
                            'visualcomposer'
                        ); ?>
                    </span>
                </td>
                <td class="<?php echo $maxInputVars['status']; ?>"><?php echo $maxInputVars['text']; ?></td>
            </tr>
            <tr>
                <td><?php echo esc_html__('Timeout', 'visualcomposer') ?>:</td>
                <td class="vcv-help">
                    <span class="vcv-help-tooltip-icon"></span>
                    <span class="vcv-help-tooltip">
                        <?php echo esc_html__('Amount of max execution time', 'visualcomposer') ?>
                    </span>
                </td>
                <td class="<?php echo $timeout['status'] ?>"><?php echo $timeout['text']; ?></td>
            </tr>
            <tr>
                <td><?php echo esc_html__('Upload Max Filesize', 'visualcomposer') ?>:</td>
                <td class="vcv-help">
                    <span class="vcv-help-tooltip-icon"></span>
                    <span class="vcv-help-tooltip">
                        <?php echo esc_html__(
                            'The largest filesize that can be uploaded to your WordPress installation',
                            'visualcomposer'
                        ) ?>
                    </span>
                </td>
                <td class="<?php echo $fileUploadSize['status'] ?>"><?php echo $fileUploadSize['text']; ?></td>
            </tr>
            <tr>
                <td><?php echo esc_html__('Access to Uploads Directory', 'visualcomposer') ?>:</td>
                <td class="vcv-help">
                    <span class="vcv-help-tooltip-icon"></span>
                    <span class="vcv-help-tooltip">
                        <?php echo esc_html__(
                            'Visual Composer stores assets in the WordPress uploads directory. The directory must be writable for this to happen.',
                            'visualcomposer'
                        ) ?>
                    </span>
                </td>
                <td class="<?php echo $uploadDirAccess['status'] ?>"><?php echo $uploadDirAccess['text']; ?></td>
            </tr>
            <tr>
                <td><?php echo esc_html__('File System Method', 'visualcomposer') ?>:</td>
                <td class="vcv-help">
                    <span class="vcv-help-tooltip-icon"></span>
                    <span class="vcv-help-tooltip">
                        <?php echo esc_html__('The File System method should be direct', 'visualcomposer') ?>
                    </span>
                </td>
                <td class="<?php echo $fsMethod['status'] ?>"><?php echo $fsMethod['text']; ?></td>
            </tr>
            </tbody>
        </table>

        <table class="vcv-ui-settings-status-table">
            <thead>
            <tr>
                <th colspan="3"><?php echo esc_html__('Extensions', 'visualcomposer') ?></th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td><?php echo esc_html__('Zip Extension', 'visualcomposer') ?>:</td>
                <td class="vcv-help">
                    <span class="vcv-help-tooltip-icon"></span>
                    <span class="vcv-help-tooltip">
                        <?php echo esc_html__('The Zip Extension should be enabled on your server', 'visualcomposer') ?>
                    </span>
                </td>
                <td class="<?php echo $zipExt['status'] ?>"><?php echo $zipExt['text']; ?></td>
            </tr>
            <tr>
                <td><?php echo esc_html__('Curl Extension', 'visualcomposer') ?>:</td>
                <td class="vcv-help">
                    <span class="vcv-help-tooltip-icon"></span>
                    <span class="vcv-help-tooltip">
                        <?php echo esc_html__('The version of cURL installed on your server', 'visualcomposer') ?>
                    </span>
                </td>
                <td class="<?php echo $curlExt['status'] ?>"><?php echo $curlExt['text']; ?></td>
            </tr>
            </tbody>
        </table>

        <table class="vcv-ui-settings-status-table">
            <thead>
            <tr>
                <th colspan="3"><?php echo esc_html__('Connections', 'visualcomposer') ?></th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td><?php echo esc_html__('Account', 'visualcomposer') ?>:</td>
                <td class="vcv-help">
                    <span class="vcv-help-tooltip-icon"></span>
                    <span class="vcv-help-tooltip">
                        <?php echo esc_html__('Connection with the Account', 'visualcomposer') ?>
                    </span>
                </td>
                <td class="<?php echo $account['status'] ?>"><?php echo $account['text']; ?></td>
            </tr>
            <tr>
                <td><?php echo esc_html__('AWS', 'visualcomposer') ?>:</td>
                <td class="vcv-help">
                    <span class="vcv-help-tooltip-icon"></span>
                    <span class="vcv-help-tooltip">
                        <?php echo esc_html__('The connection with the AWS', 'visualcomposer') ?>
                    </span>
                </td>
                <td class="<?php echo $aws['status'] ?>"><?php echo $aws['text']; ?></td>
            </tr>
            <tr>
                <td><?php echo esc_html__('Large Data Transfer', 'visualcomposer') ?>:</td>
                <td class="vcv-help">
                    <span class="vcv-help-tooltip-icon"></span>
                    <span class="vcv-help-tooltip">
                        <?php echo esc_html__(
                            'Ability to send large data. In case if failed - adjust your php.ini file to increase memory_limit, post_max_size and execution time.',
                            'visualcomposer'
                        ) ?>
                </span>
                </td>
                <td id="vcv-large-content-status" class="vcv-ui-wp-spinner"></td>
            </tr>
            </tbody>
        </table>
    </div>
</div>
