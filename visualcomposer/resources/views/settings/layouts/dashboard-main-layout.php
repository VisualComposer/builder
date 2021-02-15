<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

// Get Active Tab
$activeTab = '';
if (isset($_GET['page'])) {
    $activeTab = esc_attr($_GET['page']);
}

$tabsHelper = vchelper('SettingsTabsRegistry');
$utmHelper = vchelper('Utm');
$allTabs = $tabsHelper->getHierarchy();
$activeTabData = $tabsHelper->get($activeTab);

// Get Parent Tab
$parentSlug = $activeTabData['parent'] === false ? $activeTab : $activeTabData['parent'];

// Make hub first item
if (vcvenv('VCV_FT_DASHBOARD_HUB') && isset($allTabs['vcv-hub'])) {
    $hubArray = [
        'vcv-hub' => $allTabs['vcv-hub'],
    ];
    unset($allTabs['vcv-hub']);
    $allTabs = array_merge($hubArray, $allTabs);
}

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
            $type = isset($variable['type']) ? $variable['type'] : 'variable';
            evcview('partials/variableTypes/' . $type, $variable);
        }
    }
    unset($variable);
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
    -webkit-animation: vcv-ui-wp-spinner-animation 1.08s linear infinite;
    animation: vcv-ui-wp-spinner-animation 1.08s linear infinite;
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
        <aside class="vcv-dashboard-sidebar">
            <header class="vcv-dashboard-sidebar-header">
                <?php if (!vchelper('License')->isPremiumActivated()) : ?>
                    <a class="vcv-dashboard-logo" href="<?php echo $utmHelper->get('vcdashboard-logo-url') ?>" target="_blank" rel="noopener noreferrer">
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
                            ?>
                            <li class="vcv-dashboard-sidebar-navigation-menu-item">
                                <a class="vcv-dashboard-sidebar-navigation-link vcv-ui-icon-dashboard
                                <?php echo esc_attr($menuValue['iconClass']) . esc_attr($activeClass); ?>"
                                        href="?page=<?php echo esc_attr($menuKey) ?>">
                                    <?php echo esc_html($menuValue['name']); ?>
                                </a>
                                <?php
                                // Render sub menu items
                                if (isset($menuValue['children'])) :
                                    $subTabs = $menuValue['children'];
                                    ?>
                                    <ul class="vcv-dashboard-sidebar-navigation-menu vcv-dashboard-sidebar-navigation-menu--submenu">
                                        <?php
                                        foreach ($subTabs as $tabKey => $tab) :
                                            $activeClass = '';
                                            if ($tabKey === $activeTab) {
                                                $activeClass = ' vcv-dashboard-sidebar-navigation-link--active';
                                            }
                                            $tabTitle = empty($tab['subTitle']) ? $tab['name'] : $tab['subTitle'];
                                            if ($menuKey === $parentSlug) {
                                                $subMenuLink = 'javascript:void(0)';
                                            } else {
                                                $subMenuLink = '?page=' . esc_attr($tabKey);
                                            }
                                            ?>
                                            <li class="vcv-dashboard-sidebar-navigation-menu-item">
                                                <a class="vcv-dashboard-sidebar-navigation-link vcv-ui-icon-dashboard <?php echo esc_attr($activeClass); ?>"
                                                        href="<?php echo $subMenuLink ?>"
                                                        data-value="<?php echo esc_attr($tabKey) ?>">
                                                    <?php echo esc_html__($tabTitle, 'visualcomposer'); ?>
                                                </a>
                                            </li>
                                        <?php endforeach; ?>
                                    </ul>
                                <?php endif; ?>
                            </li>
                        <?php endforeach; ?>
                        <?php
                        $utmHelper = vchelper('Utm');
                        echo sprintf(
                            '<li class="vcv-dashboard-sidebar-navigation-menu-item"><a href="%s" class="vcv-dashboard-sidebar-navigation-link vcv-ui-icon-dashboard vcv-ui-icon-dashboard-information" target="_blank" rel="noopener noreferrer">%s</a></li>',
                            esc_url($utmHelper->get('vcdashboard-help')),
                            __('Help', 'visualcomposer')
                        );
                        echo sprintf(
                            '<li class="vcv-dashboard-sidebar-navigation-menu-item"><a href="%s" class="vcv-dashboard-sidebar-navigation-link vcv-ui-icon-dashboard vcv-ui-icon-dashboard-profile" target="_blank" rel="noopener noreferrer">%s</a></li>',
                            esc_url($utmHelper->get('vcdashboard-myvc')),
                            __('My Visual Composer', 'visualcomposer')
                        );
                        ?>
                        <?php
                        $licenseHelper = vchelper('License');
                        if (!$licenseHelper->isPremiumActivated()) {
                            echo sprintf(
                                '<li class="vcv-dashboard-sidebar-navigation-menu-item"><a href="%s" class="vcv-dashboard-sidebar-navigation-link vcv-ui-icon-dashboard vcv-ui-icon-dashboard-star" target="_blank" rel="noopener noreferrer">%s</a></li>',
                                esc_url(vchelper('Utm')->get('vcdashboard-go-premium')),
                                __('Go Premium', 'visualcomposer')
                            );
                        }
                        ?>
                    </ul>
                </nav>
            </div>
        </aside>
        <main class="vcv-dashboard-main">
            <div>
                <?php
                if (isset($allTabs[ $parentSlug ]['children'])) {
                    $renderedTabs = $allTabs[ $parentSlug ]['children'];
                    foreach ($renderedTabs as $tabKey => $tab) {
                        $tab['callback']();
                    }
                } else {
                    $activeTabData['callback']();
                }
                ?>
            </div>
            <div class="vcv-thanks-message">
                <?php
                echo sprintf(
                    __(
                        'Thank you for choosing Visual Composer Website Builder. <br>' .
                        'Like the plugin? %sRate us on WordPress.org%s',
                        'visualcomposer'
                    ),
                    '<a href="https://wordpress.org/support/plugin/visualcomposer/reviews/?filter=5" target="_blank" rel="noopener noreferrer">',
                    '</a>'
                )
                ?>
            </div>
        </main>
    </section>
</div>
