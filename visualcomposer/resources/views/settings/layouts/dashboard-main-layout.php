<?php
// phpcs:ignoreFile
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

// Get Active Tab
$activeTab = '';
$requestHelper = vchelper('Request');
if ($requestHelper->exists('page')) {
    $activeTab = esc_attr($requestHelper->input('page'));
}

$tabsHelper = vchelper('SettingsTabsRegistry');
$outputHelper = vchelper('Output');
$utmHelper = vchelper('Utm');
$allTabs = $tabsHelper->getHierarchy($tabsHelper->all());
$activeTabData = $tabsHelper->get($activeTab);
if (empty($activeTabData)) {
    wp_die(esc_html__('Sorry, you are not allowed to access this page.'));
    exit; // page not exists..
}
// Get Parent Tab
$parentSlug = $activeTabData['parent'] === false ? $activeTab : $activeTabData['parent'];
// Get Variables
$variables = vcfilter(
    'vcv:wp:dashboard:variables',
    [
        [
            'key' => 'VCV_SLUG',
            'value' => $parentSlug,
            'type' => 'constant',
        ],
    ],
    ['slug' => $slug]
);
if (is_array($variables)) {
    foreach ($variables as $variable) {
        if (is_array($variable) && isset($variable['key'], $variable['value'])) {
            $variableType = isset($variable['type']) ? $variable['type'] : 'variable';
            evcview('partials/variableTypes/' . $variableType, $variable);
        }
    }
    unset($variable);
}
evcview('settings/partials/premium-teaser-css');
$hubAddons = vchelper('HubAddons')->getAddons();
$hideMenu = true;
foreach (
    [
        'exportImport',
        'globalTemplate',
        'maintenanceMode' .
        'popupBuilder',
        'themeBuilder',
        'themeEditor',
    ] as $addonKey
) {
    if (array_key_exists($addonKey, $hubAddons) && !vcvenv('VCV_HUB_ADDON_DASHBOARD_' . strtoupper($addonKey), false)) {
        $hideMenu = false;
        break;
    }
}
if ($hideMenu) {
    // Hide only dashboard pages (skip for 3rd party)
    // Hide only when existing addons where updated to dashboard menu updates version
    $style = <<<STYLE
<style>
  #toplevel_page_vcv-settings.wp-menu-open .vcv-submenu-dashboard-page,
  #toplevel_page_vcv-getting-started.wp-menu-open .vcv-submenu-dashboard-page {
    display:none;
  }
  #toplevel_page_vcv-settings.wp-menu-open .wp-submenu.wp-submenu-wrap,
  #toplevel_page_vcv-getting-started.wp-menu-open .wp-submenu.wp-submenu-wrap {
    padding: 0;
  }
  /* add extra paddings for 3rd party */
  #toplevel_page_vcv-settings.wp-menu-open .wp-submenu.wp-submenu-wrap li:not([class]) a,
  #toplevel_page_vcv-getting-started.wp-menu-open .wp-submenu.wp-submenu-wrap li:not([class]) a {
    padding-top: 11px;
    padding-bottom: 11px;
  }
</style>
STYLE;
    $outputHelper->printNotEscaped($style);
}

?>
<style id="vcv-dashboard-styles">
  #wpwrap,
  #wpcontent,
  #wpbody,
  #wpbody-content,
  .vcv-settings {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: stretch;
    -ms-flex-align: stretch;
    align-items: stretch;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-flex: 1;
    -ms-flex: 1 0 auto;
    flex: 1 0 auto;
  }

  #adminmenumain {
    height: 0;
  }

  #wpcontent {
    padding: 0;
    position: relative;
  }

  #wpbody {
    position: static;
  }

  #wpbody-content {
    padding: 0;
  }

  .auto-fold #wpcontent {
    padding: 0;
  }

  #wpfooter {
    z-index: -1;
  }

  #wpcontent .notice,
  #wpcontent .updated,
  #wpcontent .update-nag,
  #wpcontent .error {
    display: none !important;
  }

  .vcv-dashboard-container {
    visibility: hidden;
  }

  .vcv-dashboard-loader {
    position: fixed;
    height: 16px;
    width: 16px;
    left: 55%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    -webkit-animation: vcv-ui-wp-spinner-animation .7s linear infinite;
    animation: vcv-ui-wp-spinner-animation .7s linear infinite;
  }

  .vcv-dashboard-iframe-loader-wrapper {
    display: none;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #f1f1f1;
  }

  .vcv-dashboard-iframe-loader-wrapper.vcv-dashboard-iframe-loader--visible,
  .vcv-dashboard-iframe-loader-wrapper.vcv-dashboard-iframe-loader--visible .vcv-dashboard-loader.vcv-dashboard-iframe-loader {
    display: block;
    z-index: 1001;
  }

  .vcv-dashboard-sidebar-navigation-link {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    color: #fff;
    text-decoration: none;
    font: normal 500 16px/50px 'Roboto', sans-serif;
    margin-right: auto;
  }

  #wpfooter #footer-left {
    display: none;
  }

  .vcv-thanks-message {
    position: absolute;
    bottom: 30px;
    font-family: 'Roboto', sans-serif;
    font-size: 15px;
    font-weight: 500;
    line-height: 22px;
    color: #8E8F9F;
  }

  @-webkit-keyframes vcv-ui-wp-spinner-animation {
    from {
      -webkit-transform: translate(-50%, -50%) rotate(0deg);
      transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
      -webkit-transform: translate(-50%, -50%) rotate(360deg);
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  @keyframes vcv-ui-wp-spinner-animation {
    from {
      -webkit-transform: translate(-50%, -50%) rotate(0deg);
      transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
      -webkit-transform: translate(-50%, -50%) rotate(360deg);
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  #adminmenu .wp-not-current-submenu .wp-submenu, .folded #adminmenu .wp-has-current-submenu .wp-submenu {
    margin-top: 0 !important;
  }
</style>
<div class="wrap vcv-settings">
    <div class="vcv-dashboard-loader">
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
    <section class="vcv-dashboard-container">
        <?php if ($activeTab !== 'vcv-getting-started') { ?>
            <aside class="vcv-dashboard-sidebar">
                <div class="vcv-dashboard-sidebar-inner">
                    <header class="vcv-dashboard-sidebar-header">
                        <?php if (!vchelper('License')->isPremiumActivated()) : ?>
                            <a class="vcv-dashboard-logo" href="<?php echo esc_url($utmHelper->get('vcdashboard-logo-url')); ?>" target="_blank" rel="noopener noreferrer">
                                <?php evcview('settings/partials/dashboard-logo'); ?>
                            </a>
                        <?php else : ?>
                            <a class="vcv-dashboard-logo">
                                <?php evcview('settings/partials/dashboard-logo'); ?>
                            </a>
                        <?php endif; ?>
                        <button class="vcv-dashboard-nav-toggle" aria-label="Navigation toggle" aria-expanded="false">
                            <span class="vcv-dashboard-nav-toggle-hamburger"></span>
                        </button>
                    </header>
                    <div class="vcv-dashboard-sidebar-navigation-container">
                        <nav class="vcv-dashboard-sidebar-navigation vcv-dashboard-sidebar-navigation--main">
                            <ul class="vcv-dashboard-sidebar-navigation-menu">
                                <?php
                                foreach ($allTabs as $menuKey => $menuValue) :
                                    $activeClass = '';
                                    if ($menuKey === $parentSlug) {
                                        $activeClass = ' vcv-dashboard-sidebar-navigation-link--active';
                                    }
                                    $subTabs = [];
                                    if (isset($menuValue['children'])) {
                                        $subTabs = $menuValue['children'];
                                    }
                                    $activeClassMenuItem = array_key_exists($activeTab, $subTabs) ? ' vcv-dashboard-sidebar-navigation-menu-item--active' : '';
                                    $haveChilds = count($subTabs) > 1 ? ' vcv-dashboard-sidebar-navigation-menu-item-parent' : '';
                                    $haveChildsLinkClass = count($subTabs) > 1 ? ' vcv-dashboard-sidebar-navigation-menu-item-parent-link' : '';
                                    ?>
                                    <li class="vcv-dashboard-sidebar-navigation-menu-item<?php echo esc_attr($activeClassMenuItem . $haveChilds); ?>">
                                        <a class="vcv-dashboard-sidebar-navigation-link vcv-ui-icon-dashboard <?php
                                        $iconClass = isset($menuValue['iconClass']) ? $menuValue['iconClass'] : '';
                                        echo esc_attr($iconClass) . esc_attr($activeClass) . esc_attr($haveChildsLinkClass); ?>"
                                                href="?page=<?php echo esc_attr($menuKey) ?>">
                                            <?php echo esc_html(empty($menuValue['dashboardName']) ? $menuValue['name'] : $menuValue['dashboardName']); ?>
                                        </a>
                                        <?php echo count($subTabs) > 1 ? '<span class="vcv-dashboard-caret"></span>' : '' ?>
                                        <?php
                                        // Render sub menu items
                                        if (count($subTabs) > 1) :
                                            ?>
                                            <ul class="vcv-dashboard-sidebar-navigation-menu vcv-dashboard-sidebar-navigation-menu--submenu">
                                                <?php
                                                foreach ($subTabs as $tabKey => $tabData) :
                                                    $activeClass = '';
                                                    if ($tabKey === $activeTab) {
                                                        $activeClass = ' vcv-dashboard-sidebar-navigation-link--active';
                                                    }
                                                    $tabTitle = empty($tabData['subTitle']) ? $tabData['name'] : $tabData['subTitle'];
                                                    $subMenuLink = '?page=' . esc_attr($tabKey);

                                                    $sameParent = $menuKey === $parentSlug;
                                                    $forceReload = isset($tabData['forceReloadOnOpen']) && $tabData['forceReloadOnOpen'];

                                                    if ($sameParent && !$forceReload) {
                                                        $activeClass .= ' vcv-dashboard-sidebar-navigation-link--same-parent';
                                                    }
                                                    ?>
                                                    <li class="vcv-dashboard-sidebar-navigation-menu-item">
                                                        <a class="vcv-dashboard-sidebar-navigation-link vcv-ui-icon-dashboard <?php echo esc_attr($activeClass); ?>"
                                                                href="<?php echo esc_url($subMenuLink); ?>"
                                                                data-value="<?php echo esc_attr($tabKey) ?>">
                                                            <?php echo esc_html($tabTitle); ?>
                                                            <?php if (isset($tabData['premiumActionBundle']) && !vchelper('License')->isPremiumActivated()) { ?>
                                                                <?php $titleText = __('This feature is available in Visual Composer Premium', 'visualcomposer'); ?>
                                                                <span class="vcv-ui-icon-dashboard vcv-ui-icon-dashboard-star vcv-available-in-premium" title="<?php echo esc_attr($titleText); ?>" />
                                                            <?php } ?>
                                                        </a>
                                                    </li>
                                                <?php endforeach; ?>
                                            </ul>
                                        <?php endif; ?>
                                    </li>
                                <?php endforeach; ?>
                            </ul>
                            <ul class="vcv-dashboard-sidebar-navigation-bottom-menu">
                                <?php
                                $utmHelper = vchelper('Utm');
                                echo sprintf(
                                    '<li class="vcv-dashboard-sidebar-navigation-menu-item"><a href="%s" class="vcv-dashboard-sidebar-navigation-link vcv-ui-icon-dashboard vcv-ui-icon-dashboard-information" target="_blank" rel="noopener noreferrer">%s<span aria-hidden="true" class="dashicons dashicons-external vcv-ui-icon-dashboard-external"></span></a></li>',
                                    esc_url($utmHelper->get('vcdashboard-help')),
                                    esc_html__('Help', 'visualcomposer')
                                );
                                echo sprintf(
                                    '<li class="vcv-dashboard-sidebar-navigation-menu-item"><a href="%s" class="vcv-dashboard-sidebar-navigation-link vcv-ui-icon-dashboard vcv-ui-icon-dashboard-profile" target="_blank" rel="noopener noreferrer">%s<span aria-hidden="true" class="dashicons dashicons-external vcv-ui-icon-dashboard-external"></span></a></li>',
                                    esc_url($utmHelper->get('vcdashboard-myvc')),
                                    esc_html__('My Visual Composer', 'visualcomposer')
                                );
                                ?>
                                <?php
                                $licenseHelper = vchelper('License');
                                $active = vcfilter('vcv:resources:view:dashboard:activation', $licenseHelper->isPremiumActivated());
                                if (!$active) {
                                    echo sprintf(
                                        '<li class="vcv-dashboard-sidebar-navigation-menu-item"><a href="%s" class="vcv-dashboard-sidebar-navigation-link vcv-ui-icon-dashboard vcv-ui-icon-dashboard-star" target="_blank" rel="noopener noreferrer">%s<span aria-hidden="true" class="dashicons dashicons-external vcv-ui-icon-dashboard-external"></span></a></li>',
                                        esc_url(vchelper('Utm')->get('vcdashboard-go-premium')),
                                        esc_html__('Go Premium', 'visualcomposer')
                                    );
                                }
                                ?>
                            </ul>
                        </nav>
                    </div>
                </div>
            </aside>
        <?php } ?>
        <main class="vcv-dashboard-main">
            <div class="vcv-dashboard-content">
                <?php
                if (isset($allTabs[ $parentSlug ]['children']) && !empty($allTabs[ $parentSlug ]['children'])) {
                    $renderedTabs = $allTabs[ $parentSlug ]['children'];
                    foreach ($renderedTabs as $tabKey => $tabData) {
                        $tabData['callback']();
                    }
                } else {
                    $activeTabData['callback']();
                }
                ?>
            </div>
            <div class="vcv-thanks-message">
                <?php
                echo sprintf(
                // translators: %1$s: <br>, %2$s: Url to review, %3$s: </a>
                    esc_html__(
                        'Thank you for choosing Visual Composer Website Builder. %1$s Like the plugin? %2$sRate us on WordPress.org%3$s',
                        'visualcomposer'
                    ),
                    '<br>',
                    '<a href="https://wordpress.org/support/plugin/visualcomposer/reviews/?filter=5" target="_blank" rel="noopener noreferrer">',
                    '</a>'
                )
                ?>
            </div>
        </main>
    </section>
</div>
