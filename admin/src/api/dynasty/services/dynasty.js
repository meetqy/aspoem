'use strict';

/**
 * dynasty service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::dynasty.dynasty');
