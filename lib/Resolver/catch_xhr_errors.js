var Promise = require('bluebird');

module.exports = function (Axperror_wrapper) {
  
  /**
   *
   * @param {object} req
   * @param {object} res
   * @param {Erry} erry_error
   * @returns {*}
   */
  Axperror_wrapper.prototype.catchXhrErrors = function (req, res, erry_error) {
    
    // delete these private server properties
    delete erry_error._payload.messages;
    delete erry_error._payload.error_data;
    delete erry_error._payload.instance_errors;
    
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
        return res.status(erry_error._payload.code)
          .send({
            code : erry_error._payload.code,
            error: erry_error._payload
          });
      });
  };
};