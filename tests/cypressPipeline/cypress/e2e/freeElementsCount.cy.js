/* global describe, it, cy */

const freeElements = ['Basic Button', 'Facebook Like', 'Faq Toggle', 'Feature', 'Feature Description',
'Feature Section', 'Flickr Image', 'Google Fonts Heading', 'Google Maps', 'Hero Section', 'Icon', 'Image Gallery',
'Image Masonry Gallery', 'Instagram Image', 'Outline Button', 'Pinterest Pinit', 'Raw HTML', 'Raw JS', 'Row', 'Separator',
'Separator with Icon', 'Separator with Title', 'Shortcode', 'Simple Image Slider', 'Single Image', 'Text Block',
'Twitter Button', 'Twitter Grid', 'Twitter Timeline', 'Twitter Tweet', 'Vimeo Player', 'WordPress Custom Widget',
'WordPress Default Widget', 'YouTube Player'];

describe('Free elements count', function () {
    it('Check if all free elements are showing up', function () {

        cy.visit('/wp-admin/admin.php?page=vcv-hub')
        cy.wait(1500)

        freeElements.forEach(element => {
            cy.get(`img[alt="${element}"]`).should('not.have.class', 'vcv-ui-item-element-inactive')
        });
    }
    )})