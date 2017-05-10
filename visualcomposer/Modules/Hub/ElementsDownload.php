<?php

namespace VisualComposer\Modules\Hub;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Hub;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class ElementsDownload extends Container implements Module
{
    use WpFiltersActions;

    protected $elementApiUrl = '';

    public function __construct(Hub $hubHelper)
    {
        $featureToggle = false;
        if ($featureToggle) {
            $this->wpAddAction(
                'admin_init',
                'temporaryDownloadAndProcessBundle'
            );

            add_filter('http_request_host_is_external', '__return_true');
        }
    }

    protected function temporaryDownloadAndProcessBundle(Hub $hubHelper)
    {
        $hubHelper->removeBundleFolder();
        $archive = $hubHelper->requestBundleDownload();

        if (!is_wp_error($archive)) {
            $result = $hubHelper->unzipDownloadedBundle($archive);
            if (!is_wp_error($result)) {
                /** @var \VisualComposer\Application $app */
                $app = vcapp();
                var_export(
                    [
                        'path' => $hubHelper->getBundleFolder(),
                        'elements' => $app->rglob($hubHelper->getBundleFolder('*')),
                        'json' => $hubHelper->readBundleJson($hubHelper->getBundleFolder('bundle.json')),
                    ]
                );
            } else {
                die('failed to unzip archive');
            }
        } else {
            die('failed to download archive');
        }
        die;
    }
}
