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
        return true;
      })
      .then(function () {
        // add request details
        erry_error.request(req.originalUrl);
        return true;
      })
      .then(function () {
        // log
        erry_error.log();
        return true;
      })
      .then(function () {
        if (req.xhr) {
          return self.catchXhrErrors(req, res, erry_error);
        }
        else {
          return self.catchNonXhrErrors(req, res, erry_error);
        }
      })
      .then(function () {
        self.errorActionCompleted(erry_error);
        return true;
      })
      .catch(next);
  };
};