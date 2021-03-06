var getUserMedia = require('../../lib/getUserMedia');
var AudioContext = require('../../lib/audioContext');

var SAMPLES   = 256;
var audio     = new AudioContext();
var volume    = new Uint8Array(SAMPLES);
var threshold = 40;
var analyser  = null;

var GameActions   = require('../actions/game');
var PlayerActions = require('../actions/player');

function analyze() {
  analyser.getByteFrequencyData(volume);

  var a = 0;
  var sample = volume.length;

  for (var i = 0; i < sample; i++) {
    a += volume[i];
  }

  if ((a / sample) > threshold) {
    PlayerActions.jump();
  }

  requestAnimationFrame(analyze);
}

getUserMedia({ audio: true}, (stream) => {
  GameActions.play();

  var mediaStreamSource = audio.createMediaStreamSource(stream);

  analyser = audio.createAnalyser();
  analyser.fftSize = SAMPLES;
  analyser.smoothingTimeConstant = 0.4;

  mediaStreamSource.connect(analyser);

  analyze();
}, (err) => {
  alert("Ah snap, something went wrong accessing your microphone.");
  console.log(err);
});
