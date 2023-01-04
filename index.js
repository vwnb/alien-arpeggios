if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

/**
 * Configuration
 */
const bus = 'IAC Driver Bus 1';
const lowerNote = 24;
const upperNote = 72;

const easymidi = require('easymidi');

const output = new easymidi.Output(bus);

console.log(easymidi.getOutputs());

const playNote = (note) => {
  output.send('noteon', {
    note: note,
    velocity: 127,
    channel: 3
  });

  setTimeout(() => {
    output.send('noteoff', {
        note: note,
        velocity: 127,
        channel: 3
      });
  }, 50);
}

/**
 * Clock block
 */
var counter = 0;
 
var sinOscillator = (speed = 1, depth = 1) => {
  return Math.sin(counter * speed) * depth
}

var tanOscillator = (speed = 1, depth = 1) => {
  return Math.tan(counter * speed) * depth
}

setInterval(() => {

  let note = Math.floor(Math.random() * upperNote) + lowerNote

  // playNote(upperNote + sinOscillator(0.7, 10));
  playNote(upperNote + tanOscillator(0.2, 5));
  
  counter++;

}, 100);