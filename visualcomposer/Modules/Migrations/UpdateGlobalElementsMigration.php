<?php

namespace VisualComposer\Modules\Migrations;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;

/**
 * Class UpdateGlobalElementsMigration
 *
 * Add backward compatible for global css data 18-dec.
 *
 * @package VisualComposer\Modules\Migrations
 */
class UpdateGlobalElementsMigration extends MigrationsController implements Module
{
    protected $migrationId = 'updateGlobalElements115Migration';

    protected $migrationPriority = 3;

    /**
     * Add backward compatible for global css data
     * @todo remove few releases later (18-dec)
     */
    protected function run()
    {
        $optionsHelper = vchelper('Options');
        $assetsHelper = vchelper('Assets');
        $fileHelper = vchelper('File');

        $globalElementsCssDataUpdated = $optionsHelper->get('globalElementsCssDataUpdated');
        $globalElementsCssData = $optionsHelper->get('globalElementsCssData', []);

        if ('1' !== $globalElementsCssDataUpdated && $globalElementsCssData && is_array($globalElementsCssData)) {
            $globalElementsBaseCss = [];
            $globalElementsAttributesCss = [];
            $globalElementsMixinsCss = [];
            $toRemove = [];

            foreach ($globalElementsCssData as $postId => $postElements) {
                if (get_post($postId)) {
                    if ($postElements) {
                        foreach ($postElements as $element) {
                            $baseCssHash = wp_hash($element['baseCss']);
                            $mixinsCssHash = wp_hash($element['mixinsCss']);
                            $attributesCssHash = wp_hash($element['attributesCss']);
                            $globalElementsBaseCss[ $baseCssHash ] = $element['baseCss'];
                            $globalElementsMixinsCss[ $mixinsCssHash ] = $element['mixinsCss'];
                            $globalElementsAttributesCss[ $attributesCssHash ] = $element['attributesCss'];
                        }
                        update_post_meta($postId, VCV_PREFIX . 'globalElementsCssData', $postElements);
                    }
                } else {
                    $toRemove[] = $postId;
                }
            }

            $this->removeGlobalElementsCssData($toRemove);
            $globalElementsBaseCssContent = join('', array_values($globalElementsBaseCss));
            $globalElementsMixinsCssContent = join('', array_values($globalElementsMixinsCss));
            $globalElementsAttributesCssContent = join('', array_values($globalElementsAttributesCss));

            $globalCss = $optionsHelper->get('globalElementsCss', '');
            $globalElementsCss = $globalElementsBaseCssContent . $globalElementsAttributesCssContent
                . $globalElementsMixinsCssContent . $globalCss;
            // Remove previous file
            $previousCssFile = basename($optionsHelper->get('globalElementsCssFileUrl', ''));
            $previousCssHash = $optionsHelper->get('globalElementsCssHash', '');

            $bundleUrl = $assetsHelper->updateBundleFile($globalElementsCss, 'global-elements.css');
            if ($bundleUrl) {
                $optionsHelper->set('globalElementsCssFileUrl', $bundleUrl);
                $optionsHelper->set('globalElementsCssDataUpdated', '1');
                $optionsHelper->set('globalElementsCssHash', md5($globalElementsCss));

                if (!empty($previousCssFile) && empty($previousCssHash)) {
                    $assetsPath = $assetsHelper->getFilePath($previousCssFile);
                    if (!empty($assetsPath)) {
                        $fileHelper->getFileSystem()->delete($assetsPath);
                    }
                }
            }
        }

        return true;
    }

    /**
     * @param $toRemove
     *
     * @todo remove few releases later (18-dec)
     *
     */
    protected function removeGlobalElementsCssData($toRemove)
    {
        $optionsHelper = vchelper('Options');
        $globalElementsCssData = $optionsHelper->get('globalElementsCssData', []);
        if (!empty($toRemove)) {
            foreach ($toRemove as $postId) {
                unset($globalElementsCssData[ $postId ]);
            }
            $optionsHelper->set('globalElementsCssData', $globalElementsCssData);
        }
    }
}
