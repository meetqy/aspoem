'use strict';

/**
 * poem router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::poem.poem');
