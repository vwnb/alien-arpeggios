if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

/**
 * Configuration
 */
const bus = 'IAC Driver Bus 1';
const lowerNote = 36;
const upperNote = 48;

const easymidi = require('easymidi');

if (easymidi.getOutputs().includes(bus)) {
  console.log(easymidi.getOutputs());
} else {
  console.log('MIDI bus ' + bus + ' not available');
  process.exit();
}

const output = new easymidi.Output(bus);

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
 * Functions
 */
var counter = 0;
 
var sinOscillator = (speed = 1, depth = 1) => {
  return Math.sin(counter * speed) * depth
}

var tanOscillator = (speed = 1, depth = 1) => {
  return Math.tan(counter * speed) * depth
}

/**
 * Simple arpeggios using the lower limit as target note
 */
var simpleArpeggios = () => {
  setInterval(() => {

    playNote(lowerNote + tanOscillator(0.2, 5));
    
    counter++;
  
  }, 100);
}

/**
 * Dodecaphonic arpeggios
 */
var dodecaphony = () => {
  let note = Math.random() * upperNote + lowerNote

  setInterval(() => {

    if (counter % 10 === 0) {
      note = Math.random() * upperNote + lowerNote
    }

    playNote(note + tanOscillator(0.2, 5));
    
    counter++;
  
  }, 100);
}

simpleArpeggios();