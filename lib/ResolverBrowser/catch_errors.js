var BPromise = require('bluebird');

/**
 *
 * @param {ResolverBrowser} ResolverBrowser
 */
module.exports = function (ResolverBrowser) {
  
  /**
   * catches errors that are just internal, e.g event emitters cleaning up, errors that are
   * not necessarily tied to a request
   * @param {object|Error|Erry|Errc} error
   * @returns {*}
   */
  ResolverBrowser.prototype.catchErrors = function (error) {
    var self = this;
    
    var erry_error;
    
    return BPromise.resolve()
      .then(function () {
        return self._prepareError(error);
      })
      .then(function (e) {
        erry_error = e;
        
        if (erry_error._payload.handled) {
          return true;
        }
        
        return BPromise.resolve()
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