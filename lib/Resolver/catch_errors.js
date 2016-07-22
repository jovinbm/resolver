var Promise = require('bluebird');

module.exports = function (Resolver) {
  
  /**
   *
   * @param {object} req - a request object
   * @param {object} res - a response object
   * @param {object} next - a response object
   * @param {object|Error|Erry|Errc} error
   * @returns {*}
   */
  Resolver.prototype.catchErrors = function (req, res, next, error) {
    var self = this;
    
    var erry_error;
    
    return Promise.resolve()
      .then(function () {
        return self._prepareError(error);
      })
      .then(function (e) {
        erry_error = e;
        
        // skip handled errors
        if (erry_error._payload.handled) {
          return true;
        }
        
        return Promise.resolve()
          .then(function () {
            // add request details
            erry_error.request({
              base_url    : req.baseUrl,
              cookies     : req.cookies,
              fresh       : req.fresh,
              hostname    : req.hostname,
              ip          : req.ip,
              ips         : req.ips,
              method      : req.method,
              original_url: req.originalUrl,
              params      : req.params,
              path        : req.path,
              protocol    : req.protocol,
              query       : req.query,
              route       : req.route,
              secure      : req.secure,
              subdomains  : req.subdomains,
              xhr         : req.xhr
            });
            return true;
          })
          .then(function () {
            // log
            erry_error.log();
            return true;
          })
          .then(function () {
            if (req.xhr) {
              return self.catchXhrErrors(req, res, next, erry_error);
            }
            else {
              return self.catchNonXhrErrors(req, res, next, erry_error);
            }
          })
          .then(function () {
            self.errorActionCompleted(erry_error);
            return true;
          });
      })
      .catch(next);
  };
};