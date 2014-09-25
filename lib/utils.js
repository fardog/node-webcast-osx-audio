var interfaces = require('os').networkInterfaces();

var utils = {};

utils.getLocalIp = function(device) {
  var ip = null;
  for (dev in (device ? [device] : interfaces)) {
    interfaces[dev].forEach(function(a) {
      if (a.family === 'IPv4' && a.internal === false) {
        ip = a.address;
      }
    });
  }

  return ip;
};

module.exports = utils;
