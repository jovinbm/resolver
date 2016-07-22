var Promise = require('bluebird');

module.exports = function (Resolver_browser) {
  
  /**
   * catches errors that are just internal, e.g event emitters cleaning up, errors that are
   * not necessarily tied to a request
   * @param {object|Error|Erry|Errc} error
   * @returns {*}
   */
  Resolver_browser.prototype.catchErrors = function (error) {
    var self = this;
    
    var erry_error;
    
    return Promise.resolve()
      .then(function () {
        return self._prepareError(error);
      })
      .then(function (e) {
        erry_error = e;
        
        if (erry_error._payload.handled) {
          return true;
        }
        
        return Promise.resolve()
          .then(function () {
            // log
            erry_error.log();
            return true;
          })
          .then(function () {
            return self._processError(erry_error);
          })
          .then(function () {
            self.errorActionCompleted(erry_error);
            return true;
          });
      });
  };
};