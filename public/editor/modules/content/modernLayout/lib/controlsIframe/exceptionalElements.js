import { env } from 'vc-cake'

/**
 * Elements that have various exceptions for controls in the editor
 * like color, DO, ability to paste, etc.
 * List consists of element name property.
 */

export const exceptionalElements = [
  'column',
  'tab',
  'classicTab',
  'classicAccordionSection',
  'pageableTab'
]

if (env('FT_COPY_PASTE_FOR_COLUMN')) {
  exceptionalElements.push('row')
}
