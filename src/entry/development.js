/* eslint-disable n/no-unpublished-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable n/no-missing-require */
require('ts-node').register();

process.env.APPINSIGHTS_INSTRUMENTATIONKEY = '123456';

const extension = require('../index');

module.exports = extension;
