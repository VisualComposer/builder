<?php

namespace VisualComposer\Modules\Account\Pages;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Modules\Settings\Traits\Page;

class ActivationPage extends Container implements Module
{
    use Page;
    use EventsFilters;

    /**
     * @var string
     */
    protected $slug = 'vcv-activation';

    /**
     * @var string
     */
    protected $templatePath = 'account/partials/activation-layout';

    public function __construct(Token $tokenHelper)
    {
        if (!$tokenHelper->isSiteAuthorized()) {
            /** @see \VisualComposer\Modules\Account\Pages\ActivationPage::addPage */
            $this->addFilter(
                'vcv:settings:getPages',
                'addPage',
                40
            );
        }
    }

    protected function beforeRender()
    {
        wp_enqueue_script('vcv:settings:script');
        wp_enqueue_style('vcv:settings:style');
    }

    /**
     * @param array $pages
     *
     * @return array
     */
    private function addPage($pages)
    {
        $pages[] = [
            'slug' => $this->getSlug(),
            'title' => __('Activation', 'vc5'),
            'showTab' => false,
            'controller' => $this,
        ];

        return $pages;
    }

    public function getSlides()
    {
        $urlHelper = vchelper('Url');

        return [
            [
                'title' => __('Set up your own navigation position or change it at any time.', 'vc5'),
                'url' => $urlHelper->assetUrl('images/account/001.gif'),
            ],
            [
                'title' => __('Access and see the path to your elements, columns, and rows from one control.', 'vc5'),
                'url' => $urlHelper->assetUrl('images/account/002.gif'),
            ],
            [
                'title' => __('Use inline text editing to change content with one click.', 'vc5'),
                'url' => $urlHelper->assetUrl('images/account/003.gif'),
            ],
            [
                'title' => __('Control and overview your page structure from the Tree View mode.', 'vc5'),
                'url' => $urlHelper->assetUrl('images/account/004.gif'),
            ],
            [
                'title' => __('Divide your row into columns with Row layout and pre-made layouts.', 'vc5'),
                'url' => $urlHelper->assetUrl('images/account/005.gif'),
            ],
            [
                'title' => __('Apply changes instantly and revert back with Undo/Redo at any time.', 'vc5'),
                'url' => $urlHelper->assetUrl('images/account/006.gif'),
            ],
            [
                'title' => __('Resize columns with easy to use resize tool.', 'vc5'),
                'url' => $urlHelper->assetUrl('images/account/007.gif'),
            ],
            [
                'title' => __('Choose Backend editor schematic view with the quick preview option.', 'vc5'),
                'url' => $urlHelper->assetUrl('images/account/008.gif'),
            ],
        ];
    }
}
