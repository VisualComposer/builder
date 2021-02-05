<?php

namespace VisualComposer\Modules\Vendors;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Utm;

class PluginsController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct(License $licenseHelper)
    {
        $this->wpAddAction('pre_current_active_plugins', 'enqueueJs');
        $this->wpAddFilter('plugin_row_meta', 'pluginRowMeta', 10, 2);

        if (!$licenseHelper->isPremiumActivated()) {
            /** @see \VisualComposer\Modules\License\Pages\GoPremium::pluginsPageLink */
            $this->wpAddFilter(
                'plugin_action_links_' . VCV_PLUGIN_BASE_NAME,
                'pluginsPageLink'
            );
        }
    }

    /**
     * Enqueue assets and variables for deactivation feedback
     */
    protected function enqueueJs()
    {
        // Don't show the deactivation popup if the user already saw that
        $optionsHelper = vchelper('Options');
        $deactivationFeedback = $optionsHelper->getTransient('deactivation:feedback:' . get_current_user_id());
        if ($deactivationFeedback) {
            return;
        }

        $urlHelper = vchelper('Url');
        $nonceHelper = vchelper('Nonce');

        // Enqueue settings script
        wp_register_script(
            'vcv:wpVcSettings:script',
            $urlHelper->to('public/dist/wpVcSettings.bundle.js'),
            ['vcv:assets:vendor:script'],
            VCV_VERSION,
            true
        );
        wp_enqueue_script('vcv:wpVcSettings:script');
        wp_enqueue_script('vcv:assets:runtime:script');

        // Enqueue css
        wp_register_style(
            'vcv:wpVcSettings:style',
            $urlHelper->to('public/dist/wpVcSettings.bundle.css'),
            [],
            VCV_VERSION
        );
        wp_enqueue_style('vcv:wpVcSettings:style');

        // Enqeueue required variables
        $variables[] = [
            'key' => 'vcvAdminAjaxUrl',
            'value' => $urlHelper->adminAjax(),
            'type' => 'variable',
            'addScript' => false,
        ];
        $variables[] = [
            'key' => 'vcvNonce',
            'value' => $nonceHelper->admin(),
            'type' => 'variable',
            'addScript' => false,
        ];

        $scriptOutput = '';
        if (is_array($variables)) {
            foreach ($variables as $variable) {
                if (is_array($variable) && isset($variable['key'], $variable['value'])) {
                    $type = isset($variable['type']) ? $variable['type'] : 'variable';
                    $variable['addScript'] = false;
                    $scriptOutput .= vcview('partials/variableTypes/' . $type, $variable);
                }
            }
            unset($variable);
        }

        wp_add_inline_script('vcv:wpVcSettings:script', $scriptOutput, 'before');
    }

    /**
     * Add help center, api, premium support links in plugins page
     *
     * @param $pluginLinks
     * @param $pluginFile
     * @param \VisualComposer\Helpers\Utm $utmHelper
     *
     * @return mixed
     */
    protected function pluginRowMeta($pluginLinks, $pluginFile, Utm $utmHelper)
    {
        if (VCV_PLUGIN_BASE_NAME === $pluginFile) {
            $rowMeta = [
                'helpCenter' => sprintf(
                    '<a href="%s" target="_blank" rel="noopener noreferrer">%s</a>',
                    $utmHelper->get('wpplugins-meta-help-center'),
                    __('Help Center', 'visualcomposer')
                ),
                'api' => sprintf(
                    '<a href="%s" target="_blank" rel="noopener noreferrer">%s</a>',
                    $utmHelper->get('wpplugins-meta-api'),
                    __('API', 'visualcomposer')
                ),
                'premiumSupport' => sprintf(
                    '<a href="%s" target="_blank" rel="noopener noreferrer">%s</a>',
                    $utmHelper->get('wpplugins-meta-premium-support'),
                    __('Premium Support', 'visualcomposer')
                ),
            ];

            return array_merge($pluginLinks, $rowMeta);
        }

        return (array)$pluginLinks;
    }

    /**
     * Add go premium link in plugins page
     *
     * @param $links
     *
     * @return mixed
     */
    protected function pluginsPageLink($links)
    {
        /** @noinspection HtmlUnknownTarget */
        $goPremiumLink = sprintf(
            '<a href="%s" class="vcv-plugins-go-premium" target="_blank" rel="noopener noreferrer">%s</a>',
            esc_url(vchelper('Utm')->get('wpplugins')),
            __('Go Premium', 'visualcomposer')
        );

        $links[] = $goPremiumLink;

        return $links;
    }
}
