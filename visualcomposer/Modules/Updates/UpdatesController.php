<?php

namespace VisualComposer\Modules\Updates;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use stdClass;
use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Utm;

class UpdatesController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    /**
     * Update path
     *
     * @var string
     */
    protected $updateVersionUrl;

    protected $updateChangelogUrl;

    protected $updatePackageUrl;

    protected $logoUrl = 'http://updates.visualcomposer.io/visual-composer-website-builder/logo.svg';

    public function __construct()
    {
        $this->updateVersionUrl = vcvenv('VCV_ENV_PLUGIN_UPDATE_VERSION_URL');
        $this->updateChangelogUrl = vcvenv('VCV_ENV_PLUGIN_UPDATE_CHANGELOG_URL');
        $this->updatePackageUrl = vcvenv('VCV_ENV_PLUGIN_UPDATE_PACKAGE_URL');
        /** @see \VisualComposer\Modules\Updates\UpdatesController::checkForUpdates */
        $this->wpAddFilter(
            'pre_set_site_transient_update_plugins',
            'checkForUpdates'
        );

        $this->wpAddFilter('plugins_api', 'changelog');

        $this->addEvent('vcv:system:factory:reset', 'unsetOptions');

        $this->addFilter('vcv:editor:variables', 'addPluginUpdateNoticeVariable');
    }

    /**
     * Check for updates
     *
     * @param object $transient Transient.
     * @param Options $optionsHelper
     *
     * @return mixed
     */
    protected function checkForUpdates($transient, Options $optionsHelper)
    {
        // Extra check for 3rd plugins.
        if (isset($transient->response[ VCV_PLUGIN_BASE_NAME ])) {
            $currentPlugin = $transient->response[ VCV_PLUGIN_BASE_NAME ];
            // @codingStandardsIgnoreLine
            if (is_object($currentPlugin) && isset($currentPlugin->new_version)
                // @codingStandardsIgnoreLine
                && VCV_VERSION !== $currentPlugin->new_version) {
                return $transient;
            } else {
                unset($transient->response[ VCV_PLUGIN_BASE_NAME ]);
            }
        }

        // Get the remote version.
        $info = $optionsHelper->getTransient('vcv:update:remoteVersion');
        if (!$info) {
            $info = $this->getRemoteVersionInfo();
            $optionsHelper->setTransient('vcv:update:remoteVersion', $info, 600);
        }
        // If a newer version is available, add the update.
        if ($info && version_compare(VCV_VERSION, $info['version'], '<')) {
            $plugin = new stdClass();
            $plugin->slug = VCV_PLUGIN_DIRNAME;
            $plugin->plugin = VCV_PLUGIN_BASE_NAME;
            // @codingStandardsIgnoreLine
            $plugin->new_version = $info['version'];
            $plugin->url = $this->updateChangelogUrl;
            $plugin->package = $this->updatePackageUrl;
            $plugin->tested = $info['testedVersion'];
            $plugin->icons = [
                'svg' => $this->logoUrl,
            ];
            $transient->response[ VCV_PLUGIN_BASE_NAME ] = $plugin;
            $optionsHelper->setTransient('pluginUpdateAvailable', $info['version'], 3600);
        }

        return $transient;
    }

    /**
     * Get remote version
     *
     * @return bool|array
     */
    protected function getRemoteVersionInfo()
    {
        $request = wp_remote_get(
            $this->updateVersionUrl,
            [
                'timeout' => 30,
            ]
        );
        if (!vcIsBadResponse($request)) {
            return json_decode($request['body'], true);
        }

        return false;
    }

    protected function changelog($response, $action, $arg)
    {
        if (isset($arg->slug) && $arg->slug === VCV_PLUGIN_DIRNAME) {
            $this->wpAddAction('admin_head', 'changelogAssets');

            return $this->getRemoteChangelogInformation();
        }

        return $response;
    }

    protected function getRemoteChangelogInformation()
    {
        /** @var Utm $utmHelper */
        $utmHelper = vchelper('Utm');
        $information = [];
        $information['name'] = 'Visual Composer Website Builder';
        $information['author'] = '<a target="_blank" href="' . $utmHelper->get('updatesChangelogAuthorLink')
            . '">Visual Composer Team</a>';
        $information['slug'] = VCV_PLUGIN_DIRNAME;
        $information['banners'] = [
            'high' => vchelper('Url')->assetUrl(
                'images/logo/vcwb-changelog-img.png'
            ),
        ];
        $information['homepage'] = $utmHelper->get('updatesChangelogHomepageLink');
        $information['sections'] = [];
        $information['sections']['description'] = __(
            '
<p>Visual Composer Website Builder is a perfect solution to create your WordPress site via drag and drop interface. Use content elements or predefined layouts to create any layout fast and easy.</p>
<ul>
<li>Use Frontend or Tree View to create structure</li>
<li>Create responsive websites automatically</li>
<li>Use with any WordPress theme</li>
<li>Work with pages, posts and custom post types</li>
<li>Access content elements and WordPress widgets</li>
<li>Integrate any 3rd party shortcode easily</li>
<li>Apply predefined pro quality templates</li>
<li>Control look of elements via multiple parameters and rich design options</li>
<li>Receive high-quality code optimized for SEO</li>
</ul>',
            'vcwb'
        );
        $information['sections']['Installation &#128279;'] = '<a target="_blank" href="https://visualcomposer.com/help/installation/">Installation</a>';
        $information['sections']['FAQ &#128279;'] = '<a target="_blank" href="https://visualcomposer.com/help/faq/">FAQ</a>';

        $urlHelper = vchelper('Url');
        $response = wp_remote_get(
            $urlHelper->query($this->updateChangelogUrl, ['v' => VCV_VERSION]),
            [
                'timeout' => 30,
            ]
        );
        if (!vcIsBadResponse($response)) {
            $changelogInformation = json_decode($response['body'], true);
            $information = array_merge_recursive($information, $changelogInformation);
        } else {
            $information['sections']['changelog'] = __('Failed to get changelog', 'vcwb');
        }

        return (object)$information;
    }

    /**
     *
     */
    protected function changelogAssets()
    {
        echo <<<HTML
        <style>
        #plugin-information-title h2 {
            display: none !important;
        }
        </style>
        <script>
        (function($){
          $(() => {
            var $ = window.jQuery
            var installationUrl = 'https://visualcomposer.com/help/'
            var faqUrl = 'https://visualcomposer.com/help/faq/'
            var descriptionSection = $('#section-description')
            var showDescription = function (e) {
                e.preventDefault()
                e.stopPropagation()
                setTimeout(() => {
                    descriptionSection.show()
                }, 100)
                $('<a>').attr('href', e.currentTarget.href).attr('target', '_blank')[0].click()
            }
            $('[name*="Installation"]').attr('href', installationUrl).attr('target', '_blank').click(showDescription)
            $('[name*="FAQ"]').attr('href', faqUrl).attr('target', '_blank').click(showDescription)
          })
        })(window.jQuery)
        </script>
HTML;
    }

    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper->deleteTransient('vcv:update:remoteVersion');
        delete_site_transient('update_plugins');
    }

    protected function addPluginUpdateNoticeVariable($variables, Options $optionsHelper)
    {
        $key = 'VCV_PLUGIN_UPDATE';
        $value = $optionsHelper->getTransient('pluginUpdateAvailable');

        $variables[] = [
            'key' => $key,
            'value' => !!$value,
            'type' => 'constant',
        ];

        return $variables;
    }
}
