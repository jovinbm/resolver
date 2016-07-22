// NODE
var Resolver     = require('./lib/Resolver');
var resolver     = new Resolver();
exports.Resolver = resolver;

// BROWSER
var Resolver_browser     = require('./lib/Resolver_browser');
var resolver_browser     = new Resolver_browser();
exports.Resolver_browser = resolver_browser;