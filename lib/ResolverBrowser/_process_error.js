var BPromise = require('bluebird');

/**
 *
 * @param {ResolverBrowser} ResolverBrowser
 */
module.exports = function (ResolverBrowser) {
  
  /**
   *
   * @param {Erry} erry_error
   * @returns {*}
   */
  ResolverBrowser.prototype._processError = function (erry_error) {
    var self = this;
    
    return BPromise.resolve()
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