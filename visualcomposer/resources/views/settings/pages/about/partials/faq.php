<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
?>
<div class="vcv-faq-tab changelog">
    <h3><?php echo __('New to Visual Composer or Looking for More Information?', 'vcwb') ?></h3>

    <p><?php printf(
            __(
                'WPBakery has complete documentation available at our knowledge base: '
                . '<a target="_blank" href="%s">kb.wpbakery.com</a> which covers everything related to '
                . 'Visual Composer starting from Installation and up to more advanced features based on our Inner API.',
                'vcwb'
            ),
            'http://kb.wpbakery.com'
        ) ?></p>

    <div class="feature-section vcv-row">
        <div class="vcv-col-xs-4">
            <h4><a target="_blank" href="http://go.wpbakery.com/preface"><?php echo __('Preface', 'vcwb');?></a></h4>
            <ul>
                <li><a target="_blank" href="http://go.wpbakery.com/introduction"><?php echo __('Introduction', 'vcwb');?></a></li>
                <li><a target="_blank" href="http://go.wpbakery.com/support-and-resources"><?php echo __('Support and Resources', 'vcwb');?></a>
                </li>
                <li><a target="_blank" href="http://go.wpbakery.com/support-policy"><?php echo __('Support Policy', 'vcwb');?></a></li>
                <li><a target="_blank" href="http://go.wpbakery.com/release-notes"><?php echo __('Release Notes', 'vcwb');?></a></li>
            </ul>
        </div>

        <div class="vcv-col-xs-4">
            <h4><a target="_blank" href="http://go.wpbakery.com/licensing"><?php echo __('Licensing', 'vcwb');?></a></h4>
            <ul>
                <li><a target="_blank" href="http://go.wpbakery.com/regular-license"><?php echo __('Regular License', 'vcwb');?></a></li>
                <li><a target="_blank" href="http://go.wpbakery.com/extended-license"><?php echo __('Extended License', 'vcwb');?></a></li>
                <li>
                    <a target="_blank" href="http://go.wpbakery.com/in-stock-license-terms"><?php echo __('In-Stock License (Theme
                        Integration)', 'vcwb');?></a>
                </li>
            </ul>
        </div>

        <div class="vcv-col-xs-4">
            <h4><a target="_blank" href="http://go.wpbakery.com/getting-started"><?php echo __('Getting Started', 'vcwb');?></a></h4>
            <ul>
                <li><a target="_blank" href="http://go.wpbakery.com/install"><?php echo __('Plugin Installation', 'vcwb');?></a></li>
                <li><a target="_blank" href="http://go.wpbakery.com/activation"><?php echo __('Activation', 'vcwb');?></a></li>
                <li><a target="_blank" href="http://go.wpbakery.com/update"><?php echo __('Update', 'vcwb');?></a></li>
                <li><a target="_blank" href="http://go.wpbakery.com/content-type"><?php echo __('Content Type', 'vcwb');?></a></li>
            </ul>
        </div>
    </div>

    <div class="feature-section vcv-row">
        <div class="vcv-col-xs-4">
            <h4><a target="_blank" href="http://go.wpbakery.com/learning-more"><?php echo __('Learning More', 'vcwb');?></a>
            </h4>
            <ul>
                <li><a target="_blank" href="http://go.wpbakery.com/basic-concept"><?php echo __('Basic Concept', 'vcwb');?></a></li>
                <li><a target="_blank" href="http://go.wpbakery.com/content-elements"><?php echo __('Content Elements', 'vcwb');?></a></li>
                <li><a target="_blank" href="http://go.wpbakery.com/general-settings"><?php echo __('General Settings', 'vcwb');?></a></li>
                <li><a target="_blank" href="http://go.wpbakery.com/custom-css"><?php echo __('Custom CSS', 'vcwb');?></a></li>
                <li><a target="_blank" href="http://go.wpbakery.com/element-design-options"><?php echo __('Element Design Options', 'vcwb');?></a>
                </li>
                <li><a target="_blank" href="http://go.wpbakery.com/responsive-settings"><?php echo __('Responsive Settings', 'vcwb');?></a></li>
                <li><a target="_blank" href="http://go.wpbakery.com/templates"><?php echo __('Templates', 'vcwb');?></a></li>
                <li><a target="_blank" href="http://go.wpbakery.com/predefined-layouts"><?php echo __('Predefined Layouts', 'vcwb');?></a></li>
                <li><a target="_blank" href="http://go.wpbakery.com/shortcode-mapper"><?php echo __('Shortcode Mapper', 'vcwb');?></a></li>
                <li><a target="_blank" href="http://go.wpbakery.com/grid-builder"><?php echo __('Grid Builder', 'vcwb');?></a></li>
                <li><a target="_blank" href="http://go.wpbakery.com/image-filters"><?php echo __('Image filters', 'vcwb');?></a></li>
                <li><a target="_blank" href="http://go.wpbakery.com/element-presets"><?php echo __('Element Presets', 'vcwb');?></a></li>
            </ul>
        </div>

        <div class="vcv-col-xs-4">
            <h4><a target="_blank" href="http://go.wpbakery.com/vcv-how-tos"><?php echo __('Visual Composer "How To\'s"', 'vcwb');?></a></h4>
            <p><?php echo __('In this section you will find a quick tips in form of video tutorials on how to operate with Visual
                Composer.', 'vcwb');?><</p>
        </div>

        <div class="vcv-col-xs-4">
            <h4><a target="_blank" href="http://go.wpbakery.com/faq"><?php echo __('FAQ', 'vcwb');?></a></h4>
            <p><?php echo __('Here you can find answers to the Frequently Asked Question about Visual Composer.', 'vcwb');?></p>
        </div>
    </div>

    <div class="feature-section vcv-row">
        <div class="vcv-col-xs-4">
            <h4><a target="_blank" href="http://go.wpbakery.com/addons"><?php echo __('Add-ons', 'vcwb');?></a></h4>
            <ul>
                <li><a target="_blank" href="http://go.wpbakery.com/templatera"><?php echo __('Templatera', 'vcwb');?></a></li>
                <li><a target="_blank" href="http://go.wpbakery.com/easy-tables"><?php echo __('Easy Tables', 'vcwb');?></a></li>
                <li>
                    <a target="_blank" href="http://go.wpbakery.com/addon-development-rules"><?php echo __('Add-on Development
                        Rules', 'vcwb');?></a>
                </li>
            </ul>
        </div>

        <div class="vcv-col-xs-4">
            <h4><a target="_blank" href="http://go.wpbakery.com/theme-integration"><?php echo __('Theme Integration', 'vcwb');?></a></h4>
            <p><?php echo __('See how you can integrate Visual Composer within your WordPress theme.', 'vcwb');?></p>
        </div>

        <div class="vcv-col-xs-4">
            <h4><a target="_blank" href="http://go.wpbakery.com/inner-api"><?php echo __('Inner API', 'vcwb');?></a></h4>
            <p><?php echo __('Inner API section describes capabilities of interaction with Visual Composer.', 'vcwb');?></p>
        </div>
    </div>
</div>

<div class="return-to-dashboard">
    <a target="_blank" href="http://kb.wpbakery.com"><?php echo __(
            'Visit Knowledge Base for more information',
            'vcwb'
        ) ?></a>
</div>
