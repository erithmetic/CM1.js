global.vows = require('vows');
global.assert = require('assert');
global.sinon = require('sinon');
global.CM1 = require('../lib/cm1');

var jsdom = require('jsdom');

window = jsdom.jsdom("<html><head></head><body></body></html>").createWindow();
global.navigator = {
  userAgent: 'jasmine'
};
global.window = window;
global.document = window.document;
global.location = { href: "http://monitoring" };
global.document.location = global.location;
