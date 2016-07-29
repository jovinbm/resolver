var BPromise = require('bluebird');

/**
 *
 * @param {Resolver} Resolver
 */
module.exports = function (Resolver) {
  
  /**
   * catches errors that are just internal, e.g event emitters cleaning up, errors that are
   * not necessarily tied to a request
   * @param {object|Error|Erry|Errc} error
   * @returns {*}
   */
  Resolver.prototype.catchInternalErrors = function (error) {
    var self = this;
    
    var erry_error;
    
    return BPromise.resolve()
      .then(function () {
        return self._prepareError(error);
      })
      .then(function (e) {
        erry_error = e;
        
        // skip handled errors
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
            self.errorActionCompleted(erry_error);
            return true;
          });
        
      });
  };
};