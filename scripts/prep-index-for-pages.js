/* eslint-disable @typescript-eslint/no-var-requires */
/* global __dirname */
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const indexContent = fs.readFileSync(
  path.resolve(__dirname, '../examples/index.html'),
  'utf8'
);

const $ = cheerio.load(indexContent);

$('[data-remove-from-deploy]').remove();

fs.writeFileSync(
  path.resolve(__dirname, '../examples/index.html'),
  $.html(),
  'utf8'
);
