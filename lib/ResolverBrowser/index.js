var BPromise = require('bluebird');
var ajv      = require("ajv")({
  removeAdditional: false
});
var path     = require('path');
var fs       = require('fs');
BPromise.promisifyAll(require('fs'));
var fileName = path.basename(__filename);

/**
 *
 * @constructor
 */
function ResolverBrowser() {
  var self  = this;
  self.name = 'ResolverBrowser';
  
  /**
   *
   * @param {string} [path]
   * @param {boolean} [openInNewTab] -- whether to open path in a new tab
   * @returns {boolean}
   */
  self.redirecter = function (path, openInNewTab) {
    
    if (typeof path !== 'string') {
      console.error('redirecter', 'Path not string');
      return false;
    }
    
    if (path[0] !== '/') {
      path = '/' + String(path);
    }
    if (openInNewTab) {
      window.open(path);
    }
    else {
      window.location.href = path;
    }
    
    return true;
  };
  
  /**
   *
   * @returns {boolean}
   */
  self.reloader = function () {
    window.location.reload(true);
    return true;
  };
  
  /**
   *
   * @param status
   * @param type
   * @param msg
   */
  self.notifier = function (status, type, msg) {
    console.info('Notification:', {
      status: status,
      type  : type,
      msg   : msg
    });
  };
}

require('../_prepareError')(ResolverBrowser);

/**
 *
 * @constructor
 * @param {object} config
 * @param {function} [config.notifier] - called notifier(status, type, msg)
 * @param {function} [config.reloader] - called reloader()
 * @param {function} [config.redirecter] - called redirecter(path, openInNewTab)
 */
ResolverBrowser.prototype.config = function (config) {
  var self = this;
  
  if (!config) {
    return;
  }
  
  var schema = {
    type                : 'object',
    additionalProperties: false,
    properties          : {
      notifier  : {},
      reloader  : {},
      redirecter: {}
    }
  };
  
  var valid = ajv.validate(schema, config);
  
  if (!valid) {
    var e = new Error(ajv.errorsText());
    e.ajv = ajv.errors;
    throw e;
  }
  
  if (config.notifier) {
    if (typeof config.notifier !== 'function') {
      throw new Error('config.notifier should be function');
    }
    
    self.notifier = config.notifier;
  }
  
  if (config.reloader) {
    if (typeof config.reloader !== 'function') {
      throw new Error('config.reloader should be function');
    }
    
    self.reloader = config.reloader;
  }
  
  if (config.redirecter) {
    if (typeof config.redirecter !== 'function') {
      throw new Error('config.redirecter should be function');
    }
    
    self.redirecter = config.redirecter;
  }
  
  self.errorActionCompleted = function (e) {
    console.error(e);
  };
};

var normalizedPath = path.join(__dirname);
var excludeFiles   = [fileName];

fs.readdirSync(normalizedPath).forEach(function (fileNameWithExt) {
  if (excludeFiles.indexOf(fileNameWithExt) > -1) {
    return true;
  }
  if (fs.statSync(path.join(normalizedPath, fileNameWithExt)).isFile()) {
    require("./" + fileNameWithExt)(ResolverBrowser);
  }
  else {
    require("./" + fileNameWithExt + '/index.js')(ResolverBrowser);
  }
});

module.exports = ResolverBrowser;