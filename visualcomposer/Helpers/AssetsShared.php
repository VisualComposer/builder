<?php

namespace VisualComposer\Helpers;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Helper;

class AssetsShared extends Container implements Helper
{
    public function getSharedAssets()
    {
        $urlHelper = vchelper('Url');

        return [
            'waypoints' => [
                'dependencies' => [],
                'jsBundle' => $urlHelper->to(
                    'public/sources/assetsLibrary/waypoints/dist/noframework.waypoints.min.js'
                ),
            ],
            'animate' => [
                'dependencies' => ['waypoints'],
                'jsBundle' => $urlHelper->to('public/sources/assetsLibrary/animate/dist/animate.bundle.js'),
                'cssBundle' => $urlHelper->to('public/sources/assetsLibrary/animate/dist/animate.bundle.css'),
            ],
            'backgroundColorGradient' => [
                'dependencies' => [],
                'cssBundle' => $urlHelper->to(
                    'public/sources/assetsLibrary/backgroundColorGradient/dist/backgroundColorGradient.bundle.css'
                ),
            ],
            'backgroundSimple' => [
                'dependencies' => [],
                'cssBundle' => $urlHelper->to(
                    'public/sources/assetsLibrary/backgroundSimple/dist/backgroundSimple.bundle.css'
                ),
            ],
            'backgroundSlider' => [
                'dependencies' => [],
                'jsBundle' => $urlHelper->to(
                    'public/sources/assetsLibrary/backgroundSlider/dist/backgroundSlider.bundle.js'
                ),
                'cssBundle' => $urlHelper->to(
                    'public/sources/assetsLibrary/backgroundSlider/dist/backgroundSlider.bundle.css'
                ),
            ],
            'backgroundVideoEmbed' => [
                'dependencies' => [],
                'jsBundle' => $urlHelper->to(
                    'public/sources/assetsLibrary/backgroundVideoEmbed/dist/backgroundVideoEmbed.bundle.js'
                ),
                'cssBundle' => $urlHelper->to(
                    'public/sources/assetsLibrary/backgroundVideoEmbed/dist/backgroundVideoEmbed.bundle.css'
                ),
            ],
            'backgroundVideoVimeo' => [
                'dependencies' => [],
                'jsBundle' => $urlHelper->to(
                    'public/sources/assetsLibrary/backgroundVideoVimeo/dist/backgroundVideoVimeo.bundle.js'
                ),
                'cssBundle' => $urlHelper->to(
                    'public/sources/assetsLibrary/backgroundVideoVimeo/dist/backgroundVideoVimeo.bundle.css'
                ),
            ],
            'backgroundVideoYoutube' => [
                'dependencies' => [],
                'jsBundle' => $urlHelper->to(
                    'public/sources/assetsLibrary/backgroundVideoYoutube/dist/backgroundVideoYoutube.bundle.js'
                ),
                'cssBundle' => $urlHelper->to(
                    'public/sources/assetsLibrary/backgroundVideoYoutube/dist/backgroundVideoYoutube.bundle.css'
                ),
            ],
            'parallaxBackground' => [
                'dependencies' => ['waypoints'],
                'jsBundle' => $urlHelper->to(
                    'public/sources/assetsLibrary/parallaxBackground/dist/parallaxBackground.bundle.js'
                ),
                'cssBundle' => $urlHelper->to(
                    'public/sources/assetsLibrary/parallaxBackground/dist/parallaxBackground.bundle.css'
                ),
            ],
            'parallaxFade' => [
                'dependencies' => ['waypoints'],
                'jsBundle' => $urlHelper->to('public/sources/assetsLibrary/parallaxFade/dist/parallaxFade.bundle.js'),
            ],
            'iconpicker' => [
                'dependencies' => [],
                'cssBundle' => $urlHelper->to('public/sources/assetsLibrary/iconpicker/dist/iconpicker.bundle.css'),
            ],
        ];
    }
}
