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
        .vcwb-logo {
            padding-top: 5px;
            margin-bottom: 10px;
            display: inline-block;
        }
        .vcwb-logo svg {
            width: 250px;
            max-width: 100%;
        }
    </style>
    <a href="<?php echo $utmHelper->get('dashboardNewsLogo'); ?>" target="_blank" rel="noopener" class="vcwb-logo">
        <?php evcview('vendors/images/vc-logo'); ?>
    </a>
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
                    <a href="<?php echo $permalink . $utmHelper->get('dashboardNewsBlogPost'); ?>" class="rsswidget" rel="noopener" title=" <?php echo $title; ?>"
                       target="_blank">
                        <?php echo $title; ?>
                    </a>
                    <span class="rss-date"><?php echo $categories; ?></span>
                    <br/>
                    <?php echo $content; ?>
                </li>
            <?php endforeach;
        else : ?>
            <li><?php echo esc_html__('No News Found', 'visualcomposer'); ?></li>;
        <?php endif; ?>
    </ul>
    <p class="vcwb-rss-widget-bottom community-events-footer">
        <a href="<?php echo $utmHelper->get('dashboardNewsBlog'); ?>" target="_blank" rel="noopener"
           class="vcwb-rss-widget-link vcwb-rss-widget-link--blog">
            <?php echo esc_html__('Blog', 'visualcomposer'); ?>
            <span aria-hidden="true" class="dashicons dashicons-external"></span>
        </a>
        <?php if (!vchelper('License')->isPremiumActivated()) : ?>
            |
            <a href="<?php echo $utmHelper->get('dashboardNewsGoPremium'); ?>" target="_blank" rel="noopener"
               class="vcwb-rss-widget-link vcwb-rss-widget-link--go-premium">
                <?php echo vchelper('License')->activationButtonTitle(); ?>
                <span aria-hidden="true" class="dashicons dashicons-external"></span>
            </a>
        <?php endif; ?>
    </p>
</div>
