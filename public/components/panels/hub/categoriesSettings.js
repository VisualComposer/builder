import { getService } from 'vc-cake'

const roleManager = getService('roleManager')

export default function getHubControls () {
  const controls = {
    element: {
      index: 0,
      type: 'element',
      title: 'Elements',
      visible: roleManager.can('hub_elements_templates_blocks', roleManager.defaultTrue()),
      subControls: [
        {
          title: 'Free',
          type: 'free'
        },
        {
          title: 'Premium',
          type: 'premium'
        }
      ]
    },
    template: {
      index: 1,
      type: 'template',
      title: 'Templates',
      visible: roleManager.can('hub_elements_templates_blocks', roleManager.defaultTrue()),
      subControls: [
        {
          title: 'Free',
          type: 'free'
        },
        {
          title: 'Premium',
          type: 'premium'
        }
      ]
    },
    block: {
      index: 2,
      type: 'block',
      title: 'Blocks',
      visible: roleManager.can('hub_elements_templates_blocks', roleManager.defaultTrue()),
      templateType: true
    },
    addon: {
      index: 3,
      type: 'addon',
      title: 'Addons',
      visible: roleManager.can('hub_addons', roleManager.defaultTrue())
    },
    hubHeader: {
      index: 4,
      type: 'hubHeader',
      title: 'Headers',
      visible: roleManager.can('hub_headers_footers_sidebars', roleManager.defaultTrue()),
      templateType: true
    },
    hubFooter: {
      index: 5,
      type: 'hubFooter',
      title: 'Footers',
      visible: roleManager.can('hub_headers_footers_sidebars', roleManager.defaultTrue()),
      templateType: true
    },
    hubSidebar: {
      index: 6,
      type: 'hubSidebar',
      title: 'Sidebars',
      visible: roleManager.can('hub_headers_footers_sidebars', roleManager.defaultTrue()),
      templateType: true
    },
    unsplash: {
      index: 7,
      type: 'unsplash',
      title: 'Stock Images',
      visible: roleManager.can('hub_unsplash', roleManager.defaultTrue())
    },
    giphy: {
      index: 8,
      type: 'giphy',
      title: 'Giphy',
      visible: roleManager.can('hub_giphy', roleManager.defaultTrue())
    }
  }

  return controls
}
