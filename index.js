var Webcast = function(options) {

  var lame = require('lame');
  var audio = require('osx-audio');
  var fs = require('fs');

  // we need to get the address of the local interface
  var ip = null;
  var interfaces = require('os').networkInterfaces();
  for (dev in interfaces) {
    interfaces[dev].forEach(function(a) {
      if (a.family === 'IPv4' && a.internal === false) {
        ip = a.address;
      }
    });
  }

  // create the Encoder instance
  var encoder = new lame.Encoder({
    // input
    channels: 2,        // 2 channels (left and right)
    bitDepth: 16,       // 16-bit samples
    sampleRate: 44100,  // 44,100 Hz sample rate

    // output
    bitRate: options.bitrate,
    outSampleRate: options.samplerate,
    mode: (options.mono ? lame.MONO : lame.STEREO) // STEREO (default), JOINTSTEREO, DUALCHANNEL or MONO
  });

  var input = new audio.Input();
  input.pipe(encoder);

  // set up an express app
  var express = require('express')
  var app = express()

  app.get('/', function(req, res) {
    res.send('Nope.');
  });

  app.get('/stream.mp3', function (req, res) {
    res.set({
      'Content-Type': 'audio/mpeg3',
      'Transfer-Encoding': 'chunked'
    });
    encoder.pipe(res);
  });

  var server = app.listen(options.port);

  console.log("streaming at http://" + ip + ":" + options.port + "/stream.mp3");
}

module.exports = Webcast;
