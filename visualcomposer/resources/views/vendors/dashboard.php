<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

$utmHelper = vchelper('Utm');

/** @var $controller \VisualComposer\Modules\Vendors\DashboardController */
/** @var string $rssItems */
?>
<div class="rss-widget">
    <style>
      .vcwb-logo-container {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        -ms-flex-line-pack: center;
        align-content: center;
        margin: 0 -12px 10px;
        padding: 0 12px 10px 12px;
        border-bottom: 1px solid #f0f0f1;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
      }

      .vcwb-logo-container .button.button-primary {
        margin: 5px 0;
      }

      .vcwb-logo {
        margin: 5px 10px 5px 0;
        display: -webkit-inline-box;
        display: -ms-inline-flexbox;
        display: inline-flex;
      }

      .vcwb-logo svg {
        width: 200px;
        max-width: 100%;
      }

      #visualcomposer-blog-dashboard .inside {
        padding: 0;
      }

      #visualcomposer-blog-dashboard .rss-widget {
        padding: 0 12px;
      }

      #visualcomposer-blog-dashboard .rss-widget:last-of-type {
        padding-bottom: 8px;
      }
    </style>
    <div class="vcwb-logo-container">
        <a href="<?php echo esc_url($utmHelper->get('wpdashboard-news-logo')); ?>" target="_blank" rel="noopener noreferrer" class="vcwb-logo">
            <?php evcview('vendors/images/vc-logo'); ?>
        </a>
        <?php
        $userCapabilitiesHelper = vchelper('AccessUserCapabilities');
        if ($userCapabilitiesHelper->isEditorEnabled('page')) {
            ?>
            <a href="<?php echo esc_url(vcfilter('vcv:about:postNewUrl', 'post-new.php?post_type=page&vcv-action=frontend')); ?>"
                    class="button button-primary">
                <?php echo esc_html__('Create New Page', 'visualcomposer'); ?>
            </a>
            <?php
        } elseif ($userCapabilitiesHelper->isEditorEnabled('post')) {
            ?>
            <a href="<?php echo esc_url(vcfilter('vcv:about:postNewUrl', 'post-new.php?vcv-action=frontend')); ?>"
                    class="button button-primary">
                <?php echo esc_html__('Create a new post', 'visualcomposer'); ?>
            </a>
            <?php
        }
        ?>
    </div>
    <ul>
        <?php
        if (isset($rssItems) && !empty($rssItems)) :
            foreach ($rssItems as $item) :
                $content = $item->get_description();
                $content = wp_strip_all_tags(substr($content, strpos($content, "<p"), strpos($content, "</p>") + 4));
                $itemTitle = $item->get_title();
                $permalink = $item->get_permalink();
                $categories = $item->get_categories();
                $categoryArray = [];
                foreach ($categories as $category) {
                    $categoryArray[] = esc_html($category->term);
                }
                $categories = implode(', ', $categoryArray);
                ?>
                <li>
                    <a href="<?php echo esc_url($permalink . $utmHelper->get('wpdashboard-news-blog-post')); ?>" class="rsswidget" rel="noopener noreferrer" title=" <?php echo esc_attr($itemTitle); ?>"
                            target="_blank">
                        <?php echo esc_html($itemTitle); ?>
                    </a>
                    <span class="rss-date"><?php echo esc_html($categories); ?></span>
                    <br />
                    <?php echo esc_html($content); ?>
                </li>
            <?php endforeach;
        else : ?>
            <li><?php echo esc_html__('No news found.', 'visualcomposer'); ?></li>;
        <?php endif; ?>
    </ul>
</div>
<p class="vcwb-rss-widget-bottom community-events-footer">
    <a href="<?php echo esc_url($utmHelper->get('wpdashboard-news-blog')); ?>" target="_blank" rel="noopener noreferrer"
            class="vcwb-rss-widget-link vcwb-rss-widget-link--blog">
        <?php echo esc_html__('Blog', 'visualcomposer'); ?>
        <span aria-hidden="true" class="dashicons dashicons-external"></span>
    </a> |
    <a href="<?php echo esc_url($utmHelper->get('wpdashboard-news-help')); ?>" target="_blank" rel="noopener noreferrer"
            class="vcwb-rss-widget-link vcwb-rss-widget-link--blog">
        <?php echo esc_html__('Help', 'visualcomposer'); ?>
        <span aria-hidden="true" class="dashicons dashicons-external"></span>
    </a>
    <?php
    $active = vcfilter('vcv:resources:view:dashboard:activation', vchelper('License')->isPremiumActivated());
    if (!$active) : ?>
        |
        <a href="<?php echo esc_url($utmHelper->get('wpdashboard-news-gopremium')); ?>" target="_blank" rel="noopener noreferrer"
                class="vcwb-rss-widget-link vcwb-rss-widget-link--go-premium">
            <?php echo esc_html__('Go Premium', 'visualcomposer'); ?>
            <span aria-hidden="true" class="dashicons dashicons-external"></span>
        </a>
    <?php endif; ?>
</p>
