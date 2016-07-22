var Promise = require('bluebird');
var colors  = require('colors');
var ajv     = require("ajv")({
  removeAdditional: false
});

var path = require('path');
var fs   = require('fs');
Promise.promisifyAll(require('fs'));
var fileName = path.basename(__filename);

/**
 *
 * @constructor
 */
function Resolver() {
  var self  = this;
  self.name = 'Resolver';
  
  self.html_error_friendly = function (req, res, next, erry_error_payload) {
    return Promise.resolve()
      .then(function () {
        return res.status(erry_error_payload.code)
          .send(erry_error_payload);
      })
      .catch(next);
  };
}

/**
 *
 * @constructor
 * @param {object} config
 * @param {function} [config.html_error_friendly] - function to render the error page: Called with (req, res, next, erry_error_payload)
 * @param {boolean} [config.stop_on_error=false] - whether to stop process on error - useful when debugging
 */
Resolver.prototype.config = function (config) {
  var self = this;
  
  if (!config) {
    return;
  }
  
  var schema = {
    type                : 'object',
    additionalProperties: false,
    properties          : {
      html_error_friendly: {},
      stop_on_error      : {
        type: 'boolean'
      }
    }
  };
  
  var valid = ajv.validate(schema, config);
  
  if (!valid) {
    var e = new Error(ajv.errorsText());
    e.ajv = ajv.errors;
    throw e;
  }
  
  if (config.html_error_friendly) {
    if (typeof config.html_error_friendly !== 'function') {
      throw new Error('config.html_error_friendly should be function');
    }
    
    self.html_error_friendly = config.html_error_friendly;
  }
  
  self.stop_on_error = !!config.stop_on_error;
  
  if (self.stop_on_error) {
    console.log(colors.red.underline('Axperror_wrapper: Stopping on error'));
  }
  
  self.errorActionCompleted = function () {
    if (self.stop_on_error) {
      process.exit(1);
    }
  };
};

var normalizedPath = path.join(__dirname);
var excludeFiles   = [fileName];

fs.readdirSync(normalizedPath).forEach(function (fileNameWithExt) {
  if (excludeFiles.indexOf(fileNameWithExt) > -1) {
    return true;
  }
  if (fs.statSync(path.join(normalizedPath, fileNameWithExt)).isFile()) {
    require("./" + fileNameWithExt)(Resolver);
  }
  else {
    require("./" + fileNameWithExt + '/index.js')(Resolver);
  }
});

var resolver   = new Resolver();
module.exports = resolver;