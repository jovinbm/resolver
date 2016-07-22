var Promise = require('bluebird');
var Erry    = require('erry').Erry;
var Errc    = require('erry').Errc;

module.exports = function (Resolver) {
  
  /**
   *
   * @param {object|Error|Erry|Errc} e
   * @returns {*}
   */
  Resolver.prototype._prepareError = function (e) {
    return Promise.resolve()
      .then(function () {
        if (!e) {
          return new Erry()
            .systemError('Unknown error object passed');
        }
        
        if (e instanceof Erry) {
          return e;
        }
        
        if (e instanceof Errc) {
          return new Erry()
            .systemError('Errc object unhandled')
            .data(e);
        }
        
        if (e instanceof Error) {
          return new Erry(e)
            .systemError('An error occurred:');
        }
      });
  };
};