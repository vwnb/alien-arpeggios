if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const easymidi = require('easymidi');

/**
 * Configuration
 */
const bus = 'IAC Driver Bus 1';
const lowerNote = 36;
const upperNote = 48;

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
 */
const sinOscillator = (speed = 1, depth = 1) => {
  return Math.sin(counter * speed) * depth
}

/**
 * Tangent wave oscillator
 *
 * @param {number} speed - wave period
 * @param {number} depth - wave amplitude
 */
const tanOscillator = (speed = 1, depth = 1) => {
  return Math.tan(counter * speed) * depth
}

/**
 * Simple arpeggios using the lower limit as target note
 * 
 * @param {number} speed - wave period
 * @param {number} depth - wave amplitude
 */
const simpleArpeggios = (speed = 1, depth = 1) => {
  setInterval(() => {

    playNote(lowerNote + tanOscillator(speed, depth));
    
    counter++;
  
  }, 100);
}

/**
 * Dodecaphonic arpeggios
 * 
 * @param {number} speed - wave period
 * @param {number} depth - wave amplitude
 */
const dodecaphony = (speed = 1, depth = 1) => {
  let note = Math.random() * upperNote + lowerNote

  setInterval(() => {

    if (counter % 10 === 0) {
      note = Math.random() * upperNote + lowerNote
    }

    playNote(note + tanOscillator(speed, depth));
    
    counter++;
  
  }, 100);
}

simpleArpeggios(0.2, 5);