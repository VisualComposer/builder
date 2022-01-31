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
        <a href="<?php echo $utmHelper->get('wpdashboard-news-logo'); ?>" target="_blank" rel="noopener noreferrer" class="vcwb-logo">
            <?php evcview('vendors/images/vc-logo'); ?>
        </a>
        <?php
        $userCapabilitiesHelper = vchelper('AccessUserCapabilities');
        if ($userCapabilitiesHelper->isEditorEnabled('page')) {
            ?>
            <a href="<?php echo vcfilter('vcv:about:postNewUrl', 'post-new.php?post_type=page&vcv-action=frontend'); ?>"
                    class="button button-primary">
                <?php echo esc_html__('Create New Page', 'visualcomposer'); ?>
            </a>
            <?php
        } elseif ($userCapabilitiesHelper->isEditorEnabled('post')) {
            ?>
            <a href="<?php echo vcfilter('vcv:about:postNewUrl', 'post-new.php?vcv-action=frontend'); ?>"
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
                $content = strip_tags(substr($content, strpos($content, "<p"), strpos($content, "</p>") + 4));
                $title = esc_html($item->get_title());
                $permalink = esc_url($item->get_permalink());
                $categories = $item->get_categories();
                $categoryArray = [];
                foreach ($categories as $category) {
                    $categoryArray[] = esc_html($category->term);
                }
                $categories = implode(', ', $categoryArray);
                ?>
                <li>
                    <a href="<?php echo $permalink . $utmHelper->get('wpdashboard-news-blog-post'); ?>" class="rsswidget" rel="noopener noreferrer" title=" <?php echo $title; ?>"
                            target="_blank">
                        <?php echo $title; ?>
                    </a>
                    <span class="rss-date"><?php echo $categories; ?></span>
                    <br />
                    <?php echo $content; ?>
                </li>
            <?php endforeach;
        else : ?>
            <li><?php echo esc_html__('No news found.', 'visualcomposer'); ?></li>;
        <?php endif; ?>
    </ul>
</div>
<p class="vcwb-rss-widget-bottom community-events-footer">
    <a href="<?php echo $utmHelper->get('wpdashboard-news-blog'); ?>" target="_blank" rel="noopener noreferrer"
            class="vcwb-rss-widget-link vcwb-rss-widget-link--blog">
        <?php echo esc_html__('Blog', 'visualcomposer'); ?>
        <span aria-hidden="true" class="dashicons dashicons-external"></span>
    </a> |
    <a href="<?php echo $utmHelper->get('wpdashboard-news-help'); ?>" target="_blank" rel="noopener noreferrer"
            class="vcwb-rss-widget-link vcwb-rss-widget-link--blog">
        <?php echo esc_html__('Help', 'visualcomposer'); ?>
        <span aria-hidden="true" class="dashicons dashicons-external"></span>
    </a>
    <?php if (!vchelper('License')->isPremiumActivated()) : ?>
        |
        <a href="<?php echo $utmHelper->get('wpdashboard-news-gopremium'); ?>" target="_blank" rel="noopener noreferrer"
                class="vcwb-rss-widget-link vcwb-rss-widget-link--go-premium">
            <?php echo esc_html__('Go Premium', 'visualcomposer'); ?>
            <span aria-hidden="true" class="dashicons dashicons-external"></span>
        </a>
    <?php endif; ?>
</p>
