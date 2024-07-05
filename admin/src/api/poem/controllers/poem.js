'use strict';

/**
 * poem controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::poem.poem');
