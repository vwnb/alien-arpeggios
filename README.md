# alien-arpeggios
Weird arpeggios using node-easymidi

Is it music? Maybe.

<img width="1222" alt="A screenshot of GarageBand displaying tangent function shaped arpeggios" src="https://user-images.githubusercontent.com/8566859/210564838-94a3dc79-0538-4cb9-a515-a8a08e9e65e6.png">

## Examples
```
npm install
node index.js
```

After setup, the MIDI output bus must be configured. On MacOS there is usually something like:
```javascript
AlienArpeggiosConfiguration
{
    constructor()
    {
        this.bus = 'IAC Driver Bus 1';
    // ...
```
It will make noise when a DAW like GarageBand is open.

The creative part of the code can look like this:
```javascript
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
```

Or simply:
```javascript
let player = new AlienArpeggios();
player.playFor(0.2, 3, 48, 3000);
```