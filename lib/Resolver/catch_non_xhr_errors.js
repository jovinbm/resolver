var Promise = require('bluebird');

module.exports = function (Resolver) {
  
  /**
   *
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @param {Erry} erry_error
   * @returns {*}
   */
  Resolver.prototype.catchNonXhrErrors = function (req, res, next, erry_error) {
    var self = this;
    
    // delete these private server properties
    delete erry_error._payload.messages;
    delete erry_error._payload.error_data;
    delete erry_error._payload.instance_errors;
    delete erry_error._payload.request;
    
    return Promise.resolve()
      .then(function () {
        if (erry_error._payload.logout) {
          
          return new Promise(function (resolve) {
            req.logout();
            req.session.destroy(function (e) {
              
              // log error
              console.error(e);
              
              resolve(true);
            });
          });
          
        }
        
        return true;
      })
      .then(function () {
        
        // if we are redirecting...
        if (erry_error._payload.redirect.status) {
          
          var code = 301;
          
          if ([310, 302].indexOf(erry_error._payload.code) > -1) {
            code = erry_error._payload.code;
          }
          
          return res.redirect(code, erry_error._payload.redirect.url);
        }
        else {
          // render error
          return self.html_error_friendly(req, res, next, erry_error._payload);
        }
      });
  };
};