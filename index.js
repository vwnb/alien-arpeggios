if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const easymidi = require('easymidi');

/**
 * Configuration
 */
const bus = 'IAC Driver Bus 1';
const lowerNote = 36;
const upperNote = 72;

if (easymidi.getOutputs().includes(bus)) {
  console.log(easymidi.getOutputs());
} else {
  console.log('MIDI bus ' + bus + ' not available');
  process.exit();
}

const output = new easymidi.Output(bus);

var counter  = 0;

/**
 * Note player
 *
 * @param {number} note - MIDI note from 0 to 127
 */
const playNote = (note) => {
  output.send('noteon', {
    note: Math.floor(note),
    velocity: 127,
    channel: 3
  });

  setTimeout(() => {
    output.send('noteoff', {
        note: Math.floor(note),
        velocity: 127,
        channel: 3
      });
  }, 50);
}
 
/**
 * Sine wave oscillator
 *
 * @param {number} speed - wave period
 * @param {number} depth - wave amplitude
 *
 * @return {number}
 */
const sinOscillator = (speed = 1, depth = 1) => {
  return Math.sin(counter * speed) * depth
}

/**
 * Tangent wave oscillator
 *
 * @param {number} speed - wave period
 * @param {number} depth - wave amplitude
 *
 * @return {number}
 */
const tanOscillator = (speed = 1, depth = 1) => {
  return Math.tan(counter * speed) * depth
}

/**
 * Simple arpeggios using the lower limit as target note
 * 
 * @param {number} speed - wave period
 * @param {number} depth - wave amplitude
 * 
 * @return {function}
 */
const simpleArpeggios = (speed = 1, depth = 1, targetNote = lowerNote) => {
  return setInterval(() => {

    playNote(lowerNote + tanOscillator(speed, depth));
    
    counter++;
  
  }, 100);
}

/**
 * Play function for duration
 *
 * @param {number} speed 
 * @param {number} depth 
 * @param {number} targetNote - MIDI note from 0 to 127
 * @param {number} duration - in milliseconds
 * @param {function} callback - simpleArpeggios or the like
 */
const playFor = (speed, depth, targetNote, duration = 1000, callback = () => {}) => {
  let callbackFunction = callback(speed, depth, targetNote);

  setTimeout(() => {

    clearInterval(callbackFunction);
  
  }, duration);
}

/**
 * Creative block
 */
setInterval(() => {

  let targetNote = Math.floor(Math.random() * upperNote + lowerNote);
  console.log("Setting target note to "+targetNote);

  playFor(0.2, 3, targetNote, 3000, simpleArpeggios);

}, 3000)