import { getService } from 'vc-cake'

const roleManager = getService('roleManager')

export default function getHubControls () {
  const controls = {}

  if (roleManager.can('hub_elements_templates_blocks', roleManager.defaultTrue())) {
    controls.element = {
      index: 0,
      type: 'element',
      title: 'Elements',
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
    }
    controls.template = {
      index: 1,
      type: 'template',
      title: 'Templates',
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
    }
    controls.block = {
      index: 2,
      type: 'block',
      title: 'Blocks',
      templateType: true
    }
  }

  if (roleManager.can('hub_addons', roleManager.defaultTrue())) {
    controls.addon = {
      index: 3,
      type: 'addon',
      title: 'Addons'
    }
  }

  if (roleManager.can('hub_headers_footers_sidebars', roleManager.defaultTrue())) {
    controls.hubHeader = {
      index: 4,
      type: 'hubHeader',
      title: 'Headers',
      templateType: true
    }
    controls.hubFooter = {
      index: 5,
      type: 'hubFooter',
      title: 'Footers',
      templateType: true
    }
    controls.hubSidebar = {
      index: 6,
      type: 'hubSidebar',
      title: 'Sidebars',
      templateType: true
    }
  }

  if (roleManager.can('hub_unsplash', roleManager.defaultTrue())) {
    controls.unsplash = {
      index: 7,
      type: 'unsplash',
      title: 'Stock Images'
    }
  }
  if (roleManager.can('hub_giphy', roleManager.defaultTrue())) {
    controls.giphy = {
      index: 8,
      type: 'giphy',
      title: 'Giphy'
    }
  }

  return controls
}
