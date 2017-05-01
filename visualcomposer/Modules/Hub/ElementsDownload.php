<?php

namespace VisualComposer\Modules\Hub;

use VisualComposer\Framework\Container;

//use VisualComposer\Framework\Illuminate\Support\Module;

class ElementsDownload extends Container/* implements Module*/
{
    protected $elementApiUrl = '';

    protected function downloadOnActivation()
    {
        // get Core elements
        $coreElementsList = [
            'row',
            'column',
            'textBlock',
            'singleImage',
            // ...
        ];
        $this->downloadElements($coreElementsList);
    }

    protected function downloadElements($elementsList)
    {
        $downloadedArchive = download_url('');
        if (is_wp_error($downloadedArchive)) {
            return $downloadedArchive;
        }
    }
}
