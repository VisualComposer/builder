<?php

class HelpersSettingsSectionsTest extends WP_UnitTestCase
{
    public function testSectionsRegistryHelper()
    {
        $sectionsRegistry = vchelper('SettingsSectionsRegistry');
        $this->assertTrue(is_object($sectionsRegistry));
        $this->assertTrue(method_exists($sectionsRegistry, 'set'));
        $this->assertTrue(method_exists($sectionsRegistry, 'get'));
        $this->assertTrue(method_exists($sectionsRegistry, 'all'));
        $this->assertTrue(method_exists($sectionsRegistry, 'findBySlug'));
        $this->assertTrue(method_exists($sectionsRegistry, 'getHiearchy'));
    }

    public function testSectionsRegistryAdd()
    {
        /** @var \VisualComposer\Helpers\Settings\sectionsRegistry $sectionsRegistry */
        $sectionsRegistry = vchelper('SettingsSectionsRegistry');
        $this->assertTrue(empty($sectionsRegistry->all()));

        $sectionsRegistry->set(
            'vcv-test',
            [
                'id' => 'test',
                'slug' => 'test2',
                'group' => 'test3',
            ]
        );

        $this->assertNotTrue(empty($sectionsRegistry->all()));
        $this->assertEquals(
            [
                'id' => 'test',
                'slug' => 'test2',
                'group' => 'test3',
            ],
            $sectionsRegistry->get('vcv-test')
        );
    }

    public function testSectionRegistryFind()
    {
        /** @var \VisualComposer\Helpers\Settings\sectionsRegistry $sectionsRegistry */
        $sectionsRegistry = vchelper('SettingsSectionsRegistry');
        // should not be empty
        $this->assertNotTrue(empty($sectionsRegistry->all()));
        $this->assertNotTrue(empty($sectionsRegistry->findBySlug('test2', 'slug')));
        $this->assertEquals(
            [
                'vcv-test' => [
                    'id' => 'test',
                    'slug' => 'test2',
                    'group' => 'test3',
                ],
            ],
            $sectionsRegistry->findBySlug('test2', 'slug')
        );
    }

    public function testSectionRegistryFindDefault()
    {
        /** @var \VisualComposer\Helpers\Settings\sectionsRegistry $sectionsRegistry */
        $sectionsRegistry = vchelper('SettingsSectionsRegistry');
        // should not be empty
        $this->assertNotTrue(empty($sectionsRegistry->all()));
        $this->assertTrue(empty($sectionsRegistry->findBySlug('test')));
        $this->assertTrue(empty($sectionsRegistry->findBySlug('test2')));
        $this->assertNotTrue(empty($sectionsRegistry->findBySlug('test3')));
        $this->assertEquals(
            [
                'vcv-test' => [
                    'id' => 'test',
                    'slug' => 'test2',
                    'group' => 'test3',
                ],
            ],
            $sectionsRegistry->findBySlug('test3')
        );
    }

    public function testSectionRegistryHiearchy()
    {
        /** @var \VisualComposer\Helpers\Settings\sectionsRegistry $sectionsRegistry */
        $sectionsRegistry = vchelper('SettingsSectionsRegistry');

        $input = [
            'vcv-headers-footers_headers-footers-override' =>
                [
                    'slug' => 'headers-footers-override',
                    'group' => 'vcv-headers-footers',
                    'title' => '',
                    'page' => 'vcv-headers-footers',
                    'parent' => '',
                    'vcv-args' => '',
                ],
            'vcv-headers-footers_headers-footers-all-site' =>
                [
                    'slug' => 'headers-footers-all-site',
                    'group' => 'vcv-headers-footers',
                    'title' => 'All Site',
                    'page' => 'vcv-headers-footers',
                    'parent' => '',
                    'vcv-args' =>
                        [
                            'class' => 'vcv-hidden',
                            'parent' => 'headers-footers-override',
                        ],
                ],
            'vcv-headers-footers_headers-footers-separate-post-types' =>
                [
                    'slug' => 'headers-footers-separate-post-types',
                    'group' => 'vcv-headers-footers',
                    'title' => '',
                    'page' => 'vcv-headers-footers',
                    'parent' => '',
                    'vcv-args' =>
                        [
                            'class' => 'vcv-hidden',
                            'parent' => 'headers-footers-override',
                        ],
                ],
            'vcv-headers-footers_headers-footers-separate-post-type-post' =>
                [
                    'slug' => 'headers-footers-separate-post-type-post',
                    'group' => 'vcv-headers-footers',
                    'title' => 'Post',
                    'page' => 'vcv-headers-footers',
                    'parent' => '',
                    'vcv-args' =>
                        [
                            'parent' => 'headers-footers-separate-post-types',
                        ],
                ],
            'vcv-headers-footers_headers-footers-separate-post-type-page' =>
                [
                    'slug' => 'headers-footers-separate-post-type-page',
                    'group' => 'vcv-headers-footers',
                    'title' => 'Page',
                    'page' => 'vcv-headers-footers',
                    'parent' => '',
                    'vcv-args' =>
                        [
                            'parent' => 'headers-footers-separate-post-types',
                        ],
                ],
            'vcv-headers-footers_headers-footers-page-type-frontPage' =>
                [
                    'slug' => 'headers-footers-page-type-frontPage',
                    'group' => 'vcv-headers-footers',
                    'title' => 'Front Page',
                    'page' => 'vcv-headers-footers',
                    'parent' => '',
                    'vcv-args' =>
                        [
                            'parent' => 'headers-footers-separate-post-types',
                        ],
                ],
            'vcv-headers-footers_headers-footers-page-type-postPage' =>
                [
                    'slug' => 'headers-footers-page-type-postPage',
                    'group' => 'vcv-headers-footers',
                    'title' => 'Post Listing Page',
                    'page' => 'vcv-headers-footers',
                    'parent' => '',
                    'vcv-args' =>
                        [
                            'parent' => 'headers-footers-separate-post-types',
                        ],
                ],
            'vcv-headers-footers_headers-footers-page-type-archive' =>
                [
                    'slug' => 'headers-footers-page-type-archive',
                    'group' => 'vcv-headers-footers',
                    'title' => 'Post Archive Page',
                    'page' => 'vcv-headers-footers',
                    'parent' => '',
                    'vcv-args' =>
                        [
                            'parent' => 'headers-footers-separate-post-types',
                        ],
                ],
            'vcv-headers-footers_headers-footers-page-type-category' =>
                [
                    'slug' => 'headers-footers-page-type-category',
                    'group' => 'vcv-headers-footers',
                    'title' => 'Categories',
                    'page' => 'vcv-headers-footers',
                    'parent' => '',
                    'vcv-args' =>
                        [
                            'parent' => 'headers-footers-separate-post-types',
                        ],
                ],
            'vcv-headers-footers_headers-footers-page-type-author' =>
                [
                    'slug' => 'headers-footers-page-type-author',
                    'group' => 'vcv-headers-footers',
                    'title' => 'Authors',
                    'page' => 'vcv-headers-footers',
                    'parent' => '',
                    'vcv-args' =>
                        [
                            'parent' => 'headers-footers-separate-post-types',
                        ],
                ],
            'vcv-headers-footers_headers-footers-page-type-search' =>
                [
                    'slug' => 'headers-footers-page-type-search',
                    'group' => 'vcv-headers-footers',
                    'title' => 'Search',
                    'page' => 'vcv-headers-footers',
                    'parent' => '',
                    'vcv-args' => [
                        'parent' => 'headers-footers-separate-post-types',
                    ],
                ],
            'vcv-headers-footers_headers-footers-page-type-notFound' =>
                [
                    'slug' => 'headers-footers-page-type-notFound',
                    'group' => 'vcv-headers-footers',
                    'title' => '404 Page',
                    'page' => 'vcv-headers-footers',
                    'parent' => '',
                    'vcv-args' => [
                        'parent' => 'headers-footers-separate-post-types',
                    ],
                ],
        ];

        // Result:
        $expectedOutput = [
            'vcv-headers-footers_headers-footers-override' =>
                [
                    'slug' => 'headers-footers-override',
                    'group' => 'vcv-headers-footers',
                    'title' => '',
                    'page' => 'vcv-headers-footers',
                    'parent' => '',
                    'vcv-args' => '',
                    'children' =>
                        [
                            'vcv-headers-footers_headers-footers-all-site' =>
                                [
                                    'slug' => 'headers-footers-all-site',
                                    'group' => 'vcv-headers-footers',
                                    'title' => 'All Site',
                                    'page' => 'vcv-headers-footers',
                                    'parent' => '',
                                    'vcv-args' =>
                                        [
                                            'class' => 'vcv-hidden',
                                            'parent' => 'headers-footers-override',
                                        ],
                                ],
                            'vcv-headers-footers_headers-footers-separate-post-types' =>
                                [
                                    'slug' => 'headers-footers-separate-post-types',
                                    'group' => 'vcv-headers-footers',
                                    'title' => '',
                                    'page' => 'vcv-headers-footers',
                                    'parent' => '',
                                    'vcv-args' =>
                                        [
                                            'class' => 'vcv-hidden',
                                            'parent' => 'headers-footers-override',
                                        ],
                                    'children' =>
                                        [
                                            'vcv-headers-footers_headers-footers-separate-post-type-post' =>
                                                [
                                                    'slug' => 'headers-footers-separate-post-type-post',
                                                    'group' => 'vcv-headers-footers',
                                                    'title' => 'Post',
                                                    'page' => 'vcv-headers-footers',
                                                    'parent' => '',
                                                    'vcv-args' =>
                                                        [
                                                            'parent' => 'headers-footers-separate-post-types',
                                                        ],
                                                ],
                                            'vcv-headers-footers_headers-footers-separate-post-type-page' =>
                                                [
                                                    'slug' => 'headers-footers-separate-post-type-page',
                                                    'group' => 'vcv-headers-footers',
                                                    'title' => 'Page',
                                                    'page' => 'vcv-headers-footers',
                                                    'parent' => '',
                                                    'vcv-args' =>
                                                        [
                                                            'parent' => 'headers-footers-separate-post-types',
                                                        ],
                                                ],
                                            'vcv-headers-footers_headers-footers-page-type-frontPage' =>
                                                [
                                                    'slug' => 'headers-footers-page-type-frontPage',
                                                    'group' => 'vcv-headers-footers',
                                                    'title' => 'Front Page',
                                                    'page' => 'vcv-headers-footers',
                                                    'parent' => '',
                                                    'vcv-args' =>
                                                        [
                                                            'parent' => 'headers-footers-separate-post-types',
                                                        ],
                                                ],
                                            'vcv-headers-footers_headers-footers-page-type-postPage' =>
                                                [
                                                    'slug' => 'headers-footers-page-type-postPage',
                                                    'group' => 'vcv-headers-footers',
                                                    'title' => 'Post Listing Page',
                                                    'page' => 'vcv-headers-footers',
                                                    'parent' => '',
                                                    'vcv-args' =>
                                                        [
                                                            'parent' => 'headers-footers-separate-post-types',
                                                        ],
                                                ],
                                            'vcv-headers-footers_headers-footers-page-type-archive' =>
                                                [
                                                    'slug' => 'headers-footers-page-type-archive',
                                                    'group' => 'vcv-headers-footers',
                                                    'title' => 'Post Archive Page',
                                                    'page' => 'vcv-headers-footers',
                                                    'parent' => '',
                                                    'vcv-args' =>
                                                        [
                                                            'parent' => 'headers-footers-separate-post-types',
                                                        ],
                                                ],
                                            'vcv-headers-footers_headers-footers-page-type-category' =>
                                                [
                                                    'slug' => 'headers-footers-page-type-category',
                                                    'group' => 'vcv-headers-footers',
                                                    'title' => 'Categories',
                                                    'page' => 'vcv-headers-footers',
                                                    'parent' => '',
                                                    'vcv-args' =>
                                                        [
                                                            'parent' => 'headers-footers-separate-post-types',
                                                        ],
                                                ],
                                            'vcv-headers-footers_headers-footers-page-type-author' =>
                                                [
                                                    'slug' => 'headers-footers-page-type-author',
                                                    'group' => 'vcv-headers-footers',
                                                    'title' => 'Authors',
                                                    'page' => 'vcv-headers-footers',
                                                    'parent' => '',
                                                    'vcv-args' =>
                                                        [
                                                            'parent' => 'headers-footers-separate-post-types',
                                                        ],
                                                ],
                                            'vcv-headers-footers_headers-footers-page-type-search' =>
                                                [
                                                    'slug' => 'headers-footers-page-type-search',
                                                    'group' => 'vcv-headers-footers',
                                                    'title' => 'Search',
                                                    'page' => 'vcv-headers-footers',
                                                    'parent' => '',
                                                    'vcv-args' =>
                                                        [
                                                            'parent' => 'headers-footers-separate-post-types',
                                                        ],
                                                ],
                                            'vcv-headers-footers_headers-footers-page-type-notFound' =>
                                                [
                                                    'slug' => 'headers-footers-page-type-notFound',
                                                    'group' => 'vcv-headers-footers',
                                                    'title' => '404 Page',
                                                    'page' => 'vcv-headers-footers',
                                                    'parent' => '',
                                                    'vcv-args' =>
                                                        [
                                                            'parent' => 'headers-footers-separate-post-types',
                                                        ],
                                                ],
                                        ],
                                ],
                        ],
                ],
        ];

        $this->assertEquals($expectedOutput, $sectionsRegistry->getHiearchy($input));
    }
}
