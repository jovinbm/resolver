var BPromise = require('bluebird');
var Erry     = require('erry').Erry;
var Errc     = require('erry').Errc;

module.exports = function (Rslvr) {
  
  /**
   *
   * @param {object|Error|Erry|Errc} e
   * @returns {*}
   */
  Rslvr.prototype._prepareError = function (e) {
    return BPromise.resolve()
      .then(function () {
        if (!e) {
          return new Erry()
            .systemError('Unknown error object passed')
            .notify(true, 'error');
        }
        else if (e instanceof Erry) {
          return e;
        }
        else if (e instanceof Errc) {
          return new Erry()
            .systemError('Errc object unhandled')
            .data(Errc)
            .notify(true, 'error');
        }
        else if (e instanceof Error) {
          return new Erry(e)
            .systemError('An error occurred:')
            .notify(true, 'error');
        }
        else {
          // is just an object/string/number
          
          var d = new Erry()
            .systemError()
            .notify();
          
          switch (typeof e) {
            case 'string':
              d.setMessage(e);
              break;
            case 'number':
              d.setMessage(String(e));
              break;
            case 'object':
              if (e.msg) {
                d.setMessage(String(e.msg));
              }
              
              if (e.message) {
                d.setMessage(e.message);
              }
              break;
            case 'boolean':
              d.data(e);
              break;
            default:
              d.data(e);
          }
          
          return d;
        }
      });
  };
};