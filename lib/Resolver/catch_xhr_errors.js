var BPromise = require('bluebird');

/**
 *
 * @param {Resolver} Resolver
 */
module.exports = function (Resolver) {
  
  /**
   *
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @param {Erry} erry_error
   * @returns {*}
   */
  Resolver.prototype.catchXhrErrors = function (req, res, next, erry_error) {
    
    // delete these private server properties
    delete erry_error._payload.messages;
    delete erry_error._payload.error_data;
    delete erry_error._payload.instance_errors;
    delete erry_error._payload.request;
    
    return BPromise.resolve()
      .then(function () {
        if (erry_error._payload.logout) {
          
          return new BPromise(function (resolve) {
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
        return res.status(erry_error._payload.code)
          .send({
            code : erry_error._payload.code,
            error: erry_error._payload
          });
      });
  };
};