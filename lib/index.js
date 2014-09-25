var fs = require('fs');
var utils = require('./utils');
var express = require('express')
var lame = require('lame');
var audio = require('osx-audio');

var Webcast = function(options) {
  if (!(this instanceof Webcast)) {
    return new Webcast(options);
  }

  this.options = options;

  // we need to get the address of the local interface
  this.ip = utils.getLocalIp();
  
  // create the Encoder instance
  this.encoder = new lame.Encoder({
    // input
    channels: 2,        // 2 channels (left and right)
    bitDepth: 16,       // 16-bit samples
    sampleRate: 44100,  // 44,100 Hz sample rate

    // output
    bitRate: options.bitrate,
    outSampleRate: options.samplerate,
    mode: (options.mono ? lame.MONO : lame.STEREO) // STEREO (default), JOINTSTEREO, DUALCHANNEL or MONO
  });

  this.input = new audio.Input();
  this.input.pipe(this.encoder);

  // set up an express app
  this.app = express()

  var self = this;
  this.app.get('/' + options.url, function (req, res) {
    res.set({
      'Content-Type': 'audio/mpeg3',
      'Transfer-Encoding': 'chunked'
    });
    self.encoder.pipe(res);
  });

  this.server = this.app.listen(options.port);

  console.log("streaming at http://" + this.ip + ":" + options.port + "/" + options.url);

  return this;
};

module.exports = Webcast;
