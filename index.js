if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const easymidi = require('easymidi');

/**
 * Public cnfiguration
 */
class AlienArpeggiosConfiguration
{
  constructor()
  {
    this.bus       = 'IAC Driver Bus 1';
    this.lowerNote = 36;
    this.upperNote = 72;
    
    if (easymidi.getOutputs().includes(this.bus)) {
      console.log('Bus connected: '+ this.bus);
    } else if(easymidi.getOutputs().length === 0) {
      console.log('No MIDI buses available. If you have a computer, you can turn one on somehow.');
      process.exit(1);
    } else {
      console.log('MIDI bus ' + this.bus + ' not available. Try one of the following.');
      console.log(easymidi.getOutputs());
      process.exit(1);
    }
    
    this.output = new easymidi.Output(this.bus);
  }
}

/**
 * Private helper class
 */
class AlienArpeggiosHelper
{
  constructor(configuration = new AlienArpeggiosConfiguration) {
    this.output  = configuration.output;
    this.counter = 0;
  }

  /**
   * Note player
   *
   * @param {number} note - MIDI note from 0 to 127
   */
  playNote = (note) =>
  {
    this.output.send('noteon', {
      note: Math.floor(note),
      velocity: 127,
      channel: 3
    });

    setTimeout(() => {
      this.output.send('noteoff', {
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
  sinOscillator = (speed = 1, depth = 1) =>
  {
    return Math.sin(this.counter * speed) * depth
  }

  /**
   * Tangent wave oscillator
   *
   * @param {number} speed - wave period
   * @param {number} depth - wave amplitude
   *
   * @return {number}
   */
  tanOscillator = (speed = 1, depth = 1) =>
  {
    return Math.tan(this.counter * speed) * depth
  }
}

/**
 * Public main class
 */
class AlienArpeggios
{
  constructor()
  {
    this.configuration = new AlienArpeggiosConfiguration;
    this.helper        = new AlienArpeggiosHelper(this.configuration);
  }

  /**
   * Simple arpeggios using the lower limit as target note
   * 
   * @param {number} speed - wave period
   * @param {number} depth - wave amplitude
   * 
   * @return {function}
   */
  simpleArpeggios = (
    speed = 1,
    depth = 1,
    targetNote = this.configuration.lowerNote,
    trigonometricFunction = this.helper.tanOscillator
  ) =>
  {
    return setInterval(() => {

      this.helper.playNote(
        targetNote + trigonometricFunction(speed, depth)
      );
      
      this.helper.counter++;
    
    }, 100);
  }

  /**
   * Play function for duration
   *
   * @param {number} speed 
   * @param {number} depth 
   * @param {number} targetNote - MIDI note from 0 to 127
   * @param {number} duration - in milliseconds
   * @param {function} trigonometricFunction - sinOscillator or the like
   * @param {function} callback - simpleArpeggios or the like
   */
  playFor = (
    speed = 1,
    depth = 1,
    targetNote = 48,
    duration = 1000,
    trigonometricFunction = this.helper.sinOscillator,
    callback = this.simpleArpeggios
  ) =>
  {
    let callbackFunction = callback(speed, depth, targetNote, trigonometricFunction);

    setTimeout(() => {

      clearInterval(callbackFunction);
    
    }, duration);
  }
}

/**
 * Creative block
 */
let player   = new AlienArpeggios();
let interval = 3000;

console.log("Playing something every " + interval + " milliseconds");

setInterval(() =>
{
  let targetNote = Math.floor(
    Math.random() * player.configuration.lowerNote + (
      player.configuration.upperNote - player.configuration.lowerNote
    )
  );

  console.log("Setting target note to " + targetNote);

  player.playFor(0.2, 3, targetNote, 3000, player.helper.tanOscillator, player.simpleArpeggios);

}, interval)