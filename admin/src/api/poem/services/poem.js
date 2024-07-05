'use strict';

/**
 * poem service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::poem.poem');
