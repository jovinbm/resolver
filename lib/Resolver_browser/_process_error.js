var Promise = require('bluebird');

module.exports = function (Resolver) {
  
  /**
   *
   * @param {Erry} erry_error
   * @returns {*}
   */
  Resolver.prototype._processError = function (erry_error) {
    var self = this;
    
    return Promise.resolve()
      .then(function () {
        self.notifier(
          erry_error._payload.notification.status,
          erry_error._payload.notification.type,
          erry_error._payload.notification.msg
        );
        return true;
      })
      .then(function () {
        if (erry_error._payload.reload) {
          self.reloader();
        }
        return true;
      })
      .then(function () {
        if (erry_error._payload.redirect.status) {
          self.redirecter(erry_error._payload.redirect.url, false);
        }
        
        return true;
      });
  };
};